
package com.app.services;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NotificationserviceImpl implements NotificatonService {

    private final String clientId;
    private final String clientSecret;
    private final String refreshToken;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public NotificationserviceImpl(
            @Value("${GOOGLE_CLIENT_ID}") String clientId,
            @Value("${GOOGLE_CLIENT_SECRET}") String clientSecret,
            @Value("${GOOGLE_REFRESH_TOKEN}") String refreshToken) {

        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
    }

    @Override
    public void sendmail(String to, String subject, String body) {

        try {
            // Step 1: Exchange refresh token for an access token.
            String form =
                    "client_id=" + encode(clientId)
                    + "&client_secret=" + encode(clientSecret)
                    + "&refresh_token=" + encode(refreshToken)
                    + "&grant_type=refresh_token";

            HttpRequest tokenRequest = HttpRequest.newBuilder()
                    .uri(URI.create(
                            "https://oauth2.googleapis.com/token"))
                    .header("Content-Type",
                            "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(form))
                    .build();

            HttpResponse<String> tokenResponse = httpClient.send(
                    tokenRequest,
                    HttpResponse.BodyHandlers.ofString());

            if (tokenResponse.statusCode() != 200) {
                throw new IllegalStateException(
                        "Google access-token request failed. HTTP status: "
                        + tokenResponse.statusCode());
            }

            JsonNode tokenJson =
                    objectMapper.readTree(tokenResponse.body());

            String accessToken =
                    tokenJson.path("access_token").asText();

            if (accessToken.isBlank()) {
                throw new IllegalStateException(
                        "Google did not return an access token.");
            }

            // Step 2: Build the email message.
            String encodedSubject = Base64.getEncoder()
                    .encodeToString(
                            subject.getBytes(StandardCharsets.UTF_8));

            String mimeMessage =
                    "To: " + to + "\r\n"
                    + "Subject: =?UTF-8?B?" + encodedSubject + "?=\r\n"
                    + "MIME-Version: 1.0\r\n"
                    + "Content-Type: text/plain; charset=UTF-8\r\n"
                    + "Content-Transfer-Encoding: base64\r\n"
                    + "\r\n"
                    + Base64.getMimeEncoder(76, "\r\n".getBytes(
                            StandardCharsets.US_ASCII))
                            .encodeToString(
                                    body.getBytes(StandardCharsets.UTF_8));

            String rawMessage = Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(
                            mimeMessage.getBytes(StandardCharsets.UTF_8));

            // Step 3: Send email using the Gmail API.
            String requestBody = objectMapper.writeValueAsString(
                    Map.of("raw", rawMessage));

            HttpRequest emailRequest = HttpRequest.newBuilder()
                    .uri(URI.create(
                            "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"))
                    .header("Authorization",
                            "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> emailResponse = httpClient.send(
                    emailRequest,
                    HttpResponse.BodyHandlers.ofString());

            if (emailResponse.statusCode() != 200) {
                throw new IllegalStateException(
                        "Gmail API email sending failed. HTTP status: "
                        + emailResponse.statusCode());
            }

            System.out.println("Gmail API accepted the email.");

        } catch (IOException e) {
            throw new IllegalStateException(
                    "Network or JSON error while sending email.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Email sending was interrupted.", e);
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
