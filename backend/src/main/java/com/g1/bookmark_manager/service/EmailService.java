package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.dto.request.CollectionRequest;
import com.g1.bookmark_manager.dto.response.CollectionResponse;
import com.g1.bookmark_manager.entity.Collection;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.enums.AuditAction;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import com.g1.bookmark_manager.repository.CollectionRepository;
import com.g1.bookmark_manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Gửi email và ghi lại log gửi email nếu người dùng tồn tại.
     */
    public void sendSimpleEmail(String to, String subject, String body) {
        // Gửi email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);

        // Ghi log nếu tìm được user theo email
        Optional<User> userOpt = userRepository.findByEmail(to);
        userOpt.ifPresent(user -> {
            auditLogService.log(user.getId(), AuditAction.SEND_EMAIL, "Gửi email với tiêu đề: " + subject);
        });
    }

    /**
     * Tạo bộ sưu tập và gửi email thông báo.
     */
    public CollectionResponse createCollection(Long userId, CollectionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Collection collection = new Collection();
        collection.setName(request.getName());
        collection.setIcon(request.getIcon());
        collection.setDescription(request.getDescription());
        collection.setIsPublic(request.getIsPublic());
        collection.setSortOrder(request.getSortOrder());
        collection.setUser(user);

        collectionRepository.save(collection);

        // ✅ Gửi email thông báo
        String subject = "🎉 Bộ sưu tập mới đã được tạo!";
        String body = "Chào " + user.getUsername() + ",\n\n"
                + "Bạn vừa tạo bộ sưu tập mới: \"" + request.getName() + "\".\n"
                + "Hãy bắt đầu thêm các bookmark yêu thích vào nhé!\n\n"
                + "📁 Bookmark Manager Team";
        this.sendSimpleEmail(user.getEmail(), subject, body);

        return CollectionResponse.fromEntity(collection);
    }
}
