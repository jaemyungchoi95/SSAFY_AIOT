package kr.kro.areuhot.common.util;

import jakarta.annotation.PostConstruct;
import kr.kro.areuhot.common.exception.CustomException;
import kr.kro.areuhot.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class S3Util {
    private final int URL_DURATION = 5;

    @Value("${aws.bucket.name}")
    private String bucket;

    @Value("${aws.bucket.region}")
    private String region;

    @Value("${aws.accessKey}")
    private String accessKey;

    @Value("${aws.secretKey}")
    private String secretKey;

    private S3Presigner presigner;

    @PostConstruct
    public void init() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }

    public String generatePresignedUrl(String key) {
        try {
            if(presigner == null) {
                throw new IllegalStateException("S3Presigner이 초기화되지 않았습니다.");
            }
            if (key == null || key.isBlank()) {
                throw new CustomException(ErrorCode.PATH_MISSING);
            }

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();

            GetObjectPresignRequest getPresignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(URL_DURATION))
                    .getObjectRequest(getObjectRequest)
                    .build();

            URL url = presigner.presignGetObject(getPresignRequest).url();
            return url.toString();

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.PRESIGN_FAILED);
        }
    }

    public String extractKeyFromUrl(String url) {
        try {
            URI uri = new URI(url);
            URL parsedUrl = uri.toURL();
            return parsedUrl.getPath().substring(1);
        } catch (URISyntaxException | MalformedURLException e) {
            throw new RuntimeException("잘못된 S3 URL 형식: " + url);
        }
    }
}
