package com.g1.bookmark_manager.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    @Value("${spring.mail.from}")
    private String emailFrom;
    @Value("${app.login.url:http://localhost:5173/landing}")
    private String loginUrl;

    public String sendEmail(String toWho, String subject, String username,String name,String password ,MultipartFile[] files) {
        try {
            log.info("Đang gửi email đến: {}...", toWho);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(emailFrom, "President Bookmark Manager");
            if (toWho.contains(",")) {
                helper.setTo(InternetAddress.parse(toWho));
            } else {
                helper.setTo(toWho);
            }

            // Tạo context cho Thymeleaf
            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("username", username);
            variables.put("name", name);
            variables.put("password", password);
            variables.put("loginUrl", loginUrl);
            context.setVariables(variables);

            // Xử lý template HTML với Thymeleaf
            String htmlContent = templateEngine.process("mail", context);
            helper.setText(htmlContent, true); // true để chỉ định nội dung là HTML

            // Thêm các file đính kèm (nếu có)
            if (files != null) {
                for (MultipartFile file : files) {
                    helper.addAttachment(file.getOriginalFilename(), file);
                }
            }

            helper.setSubject(subject);
            mailSender.send(message);
            log.info("Email đã được gửi đến: {}", toWho);
            return "sent";
        } catch (Exception e) {
            log.error("Gửi email đến {} thất bại: {}", toWho, e.getMessage(), e);
            return "failed";
        }
    }
}
