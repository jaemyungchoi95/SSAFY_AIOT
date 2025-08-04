package kr.kro.areuhot.alert.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
public class S3CertificateDownloadService {

    @Value("${aws.accessKey}")
    private String accessKey;

    @Value("${aws.secretKey}")
    private String secretKey;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Value("${aws.bucket.prefix}")
    private String bucketPrefix;

    private static final List<String> CERTIFICATE_FILES = Arrays.asList(
            "AmazonRootCA1.pem",
            "certificate.pem.crt",
            "private.pem.key"
    );

    // Windows 호환 경로 처리
    private static final String TEMP_DIR = System.getProperty("os.name").toLowerCase().contains("windows") 
            ? System.getProperty("java.io.tmpdir") 
            : "/tmp";

    public void downloadCertificates() throws IOException {
        log.info("S3에서 TLS 인증서 파일들을 다운로드 시작...");
        log.info("임시 디렉토리: {}", TEMP_DIR);

        // S3 클라이언트 생성
        S3Client s3Client = S3Client.builder()
                .region(Region.AP_NORTHEAST_2)
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();

        try {
            // 임시 디렉토리 생성 확인
            Path tempDir = Paths.get(TEMP_DIR);
            if (!Files.exists(tempDir)) {
                Files.createDirectories(tempDir);
                log.info("임시 디렉토리 생성됨: {}", tempDir);
            }

            // 각 인증서 파일 다운로드
            for (String fileName : CERTIFICATE_FILES) {
                String s3Key = bucketPrefix + "/" + fileName;
                Path localPath = tempDir.resolve(fileName);

                try {
                    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                            .bucket(bucketName)
                            .key(s3Key)
                            .build();

                    s3Client.getObject(getObjectRequest, localPath);

                    // 파일 존재 여부 및 크기 확인
                    if (Files.exists(localPath) && Files.size(localPath) > 0) {
                        log.info("인증서 파일 다운로드 완료: {} -> {} (크기: {} bytes)", 
                                s3Key, localPath, Files.size(localPath));
                    } else {
                        throw new RuntimeException("다운로드된 파일이 비어있거나 존재하지 않음: " + fileName);
                    }
                } catch (Exception e) {
                    log.error("인증서 파일 다운로드 실패: {}", fileName, e);
                    throw new RuntimeException("인증서 파일 다운로드 실패: " + fileName, e);
                }
            }

            log.info("모든 TLS 인증서 파일 다운로드 완료");
        } finally {
            s3Client.close();
        }
    }

    public String getCertificatePath(String fileName) {
        Path certPath = Paths.get(TEMP_DIR, fileName);
        
        try {
            // 파일 존재 여부 확인
            if (!Files.exists(certPath)) {
                throw new RuntimeException("인증서 파일이 존재하지 않음: " + certPath);
            }
            
            if (Files.size(certPath) == 0) {
                throw new RuntimeException("인증서 파일이 비어있음: " + certPath);
            }
            
            log.debug("인증서 파일 경로 반환: {} (크기: {} bytes)", certPath, Files.size(certPath));
            return certPath.toString();
        } catch (IOException e) {
            throw new RuntimeException("인증서 파일 확인 중 오류 발생: " + fileName, e);
        }
    }
} 