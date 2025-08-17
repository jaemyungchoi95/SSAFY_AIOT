package kr.kro.areuhot.event;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CreatedEventListener {
    private final NotificationService notificationService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCreatedAlertEvent(CreatedAlertEvent createdAlertEvent) {
        notificationService.sendNotificationWhenCreatedAlert(createdAlertEvent);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCreatedMapEvent(CreatedMapEvent createdMapEvent) {
        notificationService.sendNotificationWhenCreatedMap(createdMapEvent);
    }

}
