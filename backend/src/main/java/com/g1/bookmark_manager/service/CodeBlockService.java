package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.dto.request.CodeBlockRequest;
import com.g1.bookmark_manager.dto.response.CodeBlockResponse;
import com.g1.bookmark_manager.entity.CodeBlock;
import com.g1.bookmark_manager.entity.Collection;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import com.g1.bookmark_manager.repository.CodeBlockRepository;
import com.g1.bookmark_manager.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CodeBlockService {
    
    @Autowired
    private CodeBlockRepository codeBlockRepository;
    
    @Autowired
    private CollectionRepository collectionRepository;
    
    @Transactional
    public CodeBlockResponse createCodeBlock(CodeBlockRequest request, User user) {
        CodeBlock codeBlock = new CodeBlock();
        codeBlock.setTitle(request.getTitle());
        codeBlock.setCode(request.getCode());
        codeBlock.setLanguage(request.getLanguage());
        codeBlock.setDescription(request.getDescription());
        codeBlock.setTags(request.getTags());
        codeBlock.setCollection(request.getCollection());
        codeBlock.setIsPublic(request.getIsPublic());
        codeBlock.setIsFavorite(request.getIsFavorite());
        codeBlock.setUser(user);
        
        // Set collection entity if collection name is provided
        if (request.getCollection() != null && !request.getCollection().isEmpty()) {
            Collection collection = collectionRepository.findByNameAndUser(request.getCollection(), user)
                    .orElse(null);
            codeBlock.setCollectionEntity(collection);
        }
        
        CodeBlock savedCodeBlock = codeBlockRepository.save(codeBlock);
        return convertToResponse(savedCodeBlock);
    }
    
    public List<CodeBlockResponse> getAllCodeBlocks(User user) {
        List<CodeBlock> codeBlocks = codeBlockRepository.findByUserOrderByCreatedAtDesc(user);
        return codeBlocks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CodeBlockResponse> getCodeBlocksByCollection(User user, String collection) {
        List<CodeBlock> codeBlocks = codeBlockRepository.findByUserAndCollectionOrderByCreatedAtDesc(user, collection);
        return codeBlocks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CodeBlockResponse> getFavoriteCodeBlocks(User user) {
        List<CodeBlock> codeBlocks = codeBlockRepository.findByUserAndIsFavoriteOrderByCreatedAtDesc(user, true);
        return codeBlocks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public CodeBlockResponse getCodeBlockById(Long id, User user) {
        CodeBlock codeBlock = codeBlockRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("CodeBlock not found with id: " + id));
        return convertToResponse(codeBlock);
    }
    
    @Transactional
    public CodeBlockResponse updateCodeBlock(Long id, CodeBlockRequest request, User user) {
        CodeBlock codeBlock = codeBlockRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("CodeBlock not found with id: " + id));
        
        codeBlock.setTitle(request.getTitle());
        codeBlock.setCode(request.getCode());
        codeBlock.setLanguage(request.getLanguage());
        codeBlock.setDescription(request.getDescription());
        codeBlock.setTags(request.getTags());
        codeBlock.setCollection(request.getCollection());
        codeBlock.setIsPublic(request.getIsPublic());
        codeBlock.setIsFavorite(request.getIsFavorite());
        
        // Set collection entity if collection name is provided
        if (request.getCollection() != null && !request.getCollection().isEmpty()) {
            Collection collection = collectionRepository.findByNameAndUser(request.getCollection(), user)
                    .orElse(null);
            codeBlock.setCollectionEntity(collection);
        } else {
            codeBlock.setCollectionEntity(null);
        }
        
        CodeBlock updatedCodeBlock = codeBlockRepository.save(codeBlock);
        return convertToResponse(updatedCodeBlock);
    }
    
    @Transactional
    public void deleteCodeBlock(Long id, User user) {
        CodeBlock codeBlock = codeBlockRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("CodeBlock not found with id: " + id));
        codeBlockRepository.delete(codeBlock);
    }
    
    @Transactional
    public CodeBlockResponse toggleFavorite(Long id, User user) {
        CodeBlock codeBlock = codeBlockRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("CodeBlock not found with id: " + id));
        
        codeBlock.setIsFavorite(!codeBlock.getIsFavorite());
        CodeBlock updatedCodeBlock = codeBlockRepository.save(codeBlock);
        return convertToResponse(updatedCodeBlock);
    }
    
    public List<CodeBlockResponse> searchCodeBlocks(User user, String searchTerm) {
        List<CodeBlock> codeBlocks = codeBlockRepository.findByUserAndSearchTerm(user, searchTerm);
        return codeBlocks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CodeBlockResponse> searchCodeBlocksByCollection(User user, String collection, String searchTerm) {
        List<CodeBlock> codeBlocks = codeBlockRepository.findByUserAndCollectionAndSearchTerm(user, collection, searchTerm);
        return codeBlocks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CodeBlockResponse> getCodeBlocksByLanguage(User user, String language) {
        List<CodeBlock> codeBlocks = codeBlockRepository.findByUserAndLanguageOrderByCreatedAtDesc(user, language);
        return codeBlocks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Long getCodeBlockCountByCollection(User user, String collection) {
        return codeBlockRepository.countByUserAndCollection(user, collection);
    }
    
    public List<String> getDistinctCollections(User user) {
        return codeBlockRepository.findDistinctCollectionsByUser(user);
    }
    
    private CodeBlockResponse convertToResponse(CodeBlock codeBlock) {
        CodeBlockResponse response = new CodeBlockResponse();
        response.setId(codeBlock.getId());
        response.setTitle(codeBlock.getTitle());
        response.setCode(codeBlock.getCode());
        response.setLanguage(codeBlock.getLanguage());
        response.setDescription(codeBlock.getDescription());
        response.setTags(codeBlock.getTags());
        response.setCollection(codeBlock.getCollection());
        response.setIsPublic(codeBlock.getIsPublic());
        response.setIsFavorite(codeBlock.getIsFavorite());
        response.setCreatedAt(codeBlock.getCreatedAt());
        response.setUpdatedAt(codeBlock.getUpdatedAt());
        response.setUserEmail(codeBlock.getUser().getEmail());
        return response;
    }
}
