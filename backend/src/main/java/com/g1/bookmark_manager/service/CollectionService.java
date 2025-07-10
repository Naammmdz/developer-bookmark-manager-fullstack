package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.dto.request.CollectionRequest;
import com.g1.bookmark_manager.dto.response.CollectionResponse;
import com.g1.bookmark_manager.entity.Collection;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.repository.CollectionRepository;
import com.g1.bookmark_manager.repository.UserRepository;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final UserRepository userRepository;

    @Autowired
    public CollectionService(CollectionRepository collectionRepository, UserRepository userRepository) {
        this.collectionRepository = collectionRepository;
        this.userRepository = userRepository;
    }

    // Create a new collection
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

        return CollectionResponse.fromEntity(collection);
    }

    // Get all collections for a user
    public List<CollectionResponse> getAllCollections(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return collectionRepository.findByUserOrderBySortOrder(user)
                .stream()
                .map(CollectionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Update an existing collection
    public CollectionResponse updateCollection(Long collectionId, CollectionRequest request) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + collectionId));

        collection.setName(request.getName());
        collection.setIcon(request.getIcon());
        collection.setDescription(request.getDescription());
        collection.setIsPublic(request.getIsPublic());
        collection.setSortOrder(request.getSortOrder());
        collectionRepository.save(collection);

        return CollectionResponse.fromEntity(collection);
    }

    // Delete a collection
    public void deleteCollection(Long collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + collectionId));

        collectionRepository.delete(collection);
    }
}
