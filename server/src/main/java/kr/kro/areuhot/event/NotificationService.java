package kr.kro.areuhot.event;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class NotificationService {
    private final TokenMapper tokenMapper;

    @Qualifier("notificationExecutor")
    @Autowired
    Executor notificationExecutor;

    public void sendNotificationWhenCreatedAlert(CreatedAlertEvent createdAlertEvent) {
        List<TokenVO> tokens = tokenMapper.findAllToken();

        tokens
                .forEach(token -> {
                    ApiFuture<String> apiFuture = FirebaseMessaging.getInstance().sendAsync(
                            Message.builder()
                                    .putData("redirectUri", "/")
                                    .putData("title",  "비정상 온도 감지")
                                    .putData("body", createdAlertEvent.getRackId() + "번 Rack " + createdAlertEvent.getSpotId() + "Spot")
                                    // .setNotification(
                                    // Notification.builder()
                                    // .setTitle(event.getAskerName())
                                    // .setBody(event.getContent())
                                    // .build()
                                    // )
                                    .setToken(token.getToken())
                                    .build());
                    apiFuture.addListener(() -> {
                        try {
                            String response = apiFuture.get();
                            log.info("Push Success : {}", response);
                        } catch (InterruptedException | ExecutionException executionException) {
                            if (executionException
                                    .getCause() instanceof FirebaseMessagingException firebaseMessagingException) {
                                MessagingErrorCode errorCode = firebaseMessagingException.getMessagingErrorCode();
                                log.info("error : {}", errorCode);
                            }
                        }

                    }, notificationExecutor);
                });
    }

    public void sendNotificationWhenCreatedMap(CreatedMapEvent createdMapEvent) {
        List<TokenVO> tokens = tokenMapper.findAllToken();

        tokens
                .forEach(token -> {
                    ApiFuture<String> apiFuture = FirebaseMessaging.getInstance().sendAsync(
                            Message.builder()
                                    .putData("redirectUri", "/")
                                    .putData("title", "맵 생성 완료!")
                                    .putData("body", createdMapEvent.getWarehouseId() + "번 창고의 맵이 생성되었습니다")
                                    // .setNotification(
                                    // Notification.builder()
                                    // .setTitle(event.getAskerName())
                                    // .setBody(event.getContent())
                                    // .build()
                                    // )
                                    .setToken(token.getToken())
                                    .build());
                    apiFuture.addListener(() -> {
                        try {
                            String response = apiFuture.get();
                            log.info("Push Success : {}", response);
                        } catch (InterruptedException | ExecutionException executionException) {
                            if (executionException
                                    .getCause() instanceof FirebaseMessagingException firebaseMessagingException) {
                                MessagingErrorCode errorCode = firebaseMessagingException.getMessagingErrorCode();
                                log.info("error : {}", errorCode);
                            }
                        }

                    }, notificationExecutor);
                });
    }

}
