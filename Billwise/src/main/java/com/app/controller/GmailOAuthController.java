package com.app.controller;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class GmailOAuthController {

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GmailOAuthController(
            @Value("${GOOGLE_CLIENT_ID}") String clientId,
            @Value("${GOOGLE_CLIENT_SECRET}") String clientSecret,
            @Value("${GOOGLE_REDIRECT_URI}") String redirectUri) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }

    @GetMapping("/oauth2/authorize")
    public java.util.Map<String, String> authorize(HttpSession session) {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);

        String state = HexFormat.of().formatHex(bytes);
        session.setAttribute("gmail_oauth_state", state);

        String url = "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + encode(clientId)
                + "&redirect_uri=" + encode(redirectUri)
                + "&response_type=code"
                + "&scope=" + encode(
                    "https://www.googleapis.com/auth/gmail.send")
                + "&access_type=offline"
                + "&prompt=consent"
                + "&state=" + encode(state);

        return java.util.Map.of("authorizationUrl", url);
    }

    @GetMapping("/oauth2/callback")
    public String callback(
            @RequestParam String code,
            @RequestParam String state,
            HttpSession session)
            throws IOException, InterruptedException {

        Object savedState = session.getAttribute("gmail_oauth_state");
        session.removeAttribute("gmail_oauth_state");

        if (!(savedState instanceof String)
                || !savedState.equals(state)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid OAuth state");
        }

        String form = "client_id=" + encode(clientId)
                + "&client_secret=" + encode(clientSecret)
                + "&code=" + encode(code)
                + "&grant_type=authorization_code"
                + "&redirect_uri=" + encode(redirectUri);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://oauth2.googleapis.com/token"))
                .header("Content-Type",
                        "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();

        HttpResponse<String> response = httpClient.send(
                request, HttpResponse.BodyHandlers.ofString());

        JsonNode json = objectMapper.readTree(response.body());

        if (response.statusCode() != 200) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Google token exchange failed. Check Railway logs.");
        }

        JsonNode refreshToken = json.get("refresh_token");

        if (refreshToken == null || refreshToken.asText().isBlank()) {
            return "Google did not return a refresh token. "
                    + "Revoke this app's access in your Google Account "
                    + "and authorize again.";
        }

        // Displayed once in the response; do not share this page.
        return "OAuth authorization successful.\n\n"
                + "Copy this refresh token into Railway's "
                + "GOOGLE_REFRESH_TOKEN variable:\n\n"
                + refreshToken.asText()
                + "\n\nDo not share this token or save it in GitHub.";
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
