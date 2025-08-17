package kr.kro.areuhot.event;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final TokenMapper tokenMapper;

    @PostMapping("/token")
    public ResponseEntity<Void> saveToken(@RequestBody TokenVO tokenVO) {
        tokenMapper.insertToken(tokenVO);
        return ResponseEntity.ok().build();
    }
}
