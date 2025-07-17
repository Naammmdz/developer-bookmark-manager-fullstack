package com.g1.bookmark_manager.service;

import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.TimeUnit;

@Service
public class LinkValidationService {
    private static final int TIMEOUT_MILLIS = (int) TimeUnit.SECONDS.toMillis(5);

    public LinkStatus checkLink(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(TIMEOUT_MILLIS);
            connection.setReadTimeout(TIMEOUT_MILLIS);
            connection.setRequestMethod("HEAD");
            int responseCode = connection.getResponseCode();
            if (responseCode >= 200 && responseCode < 400) {
                return LinkStatus.ALIVE;
            } else {
                return LinkStatus.DEAD;
            }
        } catch (Exception e) {
            return LinkStatus.ERROR;
        }
    }

    public enum LinkStatus {
        ALIVE, DEAD, ERROR
    }
} 