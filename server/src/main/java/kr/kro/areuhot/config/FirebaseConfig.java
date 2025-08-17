package kr.kro.areuhot.config;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class FirebaseConfig {
    private final ResourceLoader resourceLoader;

    @Value("${firebase.key}")
    private String key;

    @PostConstruct
    public void init() throws IOException {
        FirebaseOptions firebaseOptions = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(resourceLoader.getResource(key).getInputStream()))
                .build();

        FirebaseApp.initializeApp(firebaseOptions);
    }
}