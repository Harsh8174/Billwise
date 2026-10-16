
package com.app.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

@Service
public class NotificationserviceImpl implements NotificatonService {

    private final Resend resend;

    public NotificationserviceImpl(
            @Value("${resend.api-key}") String apiKey) {
        this.resend = new Resend(apiKey);
    }

    @Override
    public void sendmail(String to, String subject, String body) {

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Billwise <onboarding@resend.dev>")
                .to(to)
                .subject(subject)
                .text(body)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(params);
            System.out.println(
                    "Resend accepted email. ID: " + response.getId());

        } catch (ResendException e) {
            System.err.println("Failed to send email using Resend.");
            throw new IllegalStateException(
                    "Billwise email delivery failed.", e);
        }
    }
}
