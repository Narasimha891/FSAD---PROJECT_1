package com.klu.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendGenericEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            logger.info("Email sent to: {} with subject: {}", to, subject);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        String subject = "🎓 Welcome to EduWebinar Platform!";
        String body = "Dear " + userName + ",\n\n"
                + "Welcome to the EduWebinar - Career Guidance Platform! 🎉\n\n"
                + "Your account has been successfully created. Here's what you can do:\n\n"
                + "✅ Browse and register for upcoming webinars\n"
                + "✅ Attend live sessions with industry experts\n"
                + "✅ Access recordings and resources\n"
                + "✅ Track your learning progress\n"
                + "✅ Earn certificates\n\n"
                + "Start exploring now at: http://localhost:3000/login\n\n"
                + "Best regards,\n"
                + "The Career Guidance Team";
        sendGenericEmail(toEmail, subject, body);
    }

    @Async
    public void sendRegistrationConfirmation(String toEmail, String userName, String webinarTitle) {
        String subject = "✅ Registration Confirmed - " + webinarTitle;
        String body = "Dear " + userName + ",\n\n"
                + "You have been successfully registered for the webinar: " + webinarTitle + ".\n\n"
                + "We look forward to seeing you there!\n\n"
                + "Best regards,\nCareer Guidance Team";
        sendGenericEmail(toEmail, subject, body);
    }

    @Async
    public void sendWebinarCreatedNotification(String toEmail, String webinarTitle) {
        String subject = "📢 New Webinar Created - " + webinarTitle;
        String body = "A new webinar has been created: " + webinarTitle + ".\n\n"
                + "Check it out on the Career Guidance platform!\n\n"
                + "Best regards,\nCareer Guidance Team";
        sendGenericEmail(toEmail, subject, body);
    }
}

