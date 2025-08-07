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

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Value("${aws.bucket.prefix}")
    private String bucketPrefix;

    @Value("${aws.accessKey}")
    private String accessKey;

    @Value("${aws.secretKey}")
    private String secretKey;

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
        log.info("S3 버킷: {}, 접두사: {}", bucketName, bucketPrefix);
        log.info("임시 디렉토리: {}", TEMP_DIR);

        // S3 클라이언트 생성 - application.properties의 자격 증명 사용
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);
        S3Client s3Client = S3Client.builder()
                .region(Region.AP_NORTHEAST_2)
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();

        try {
            // 임시 디렉토리 생성 확인
            Path tempDir = Paths.get(TEMP_DIR);
            if (!Files.exists(tempDir)) {
                Files.createDirectories(tempDir);
                log.info("임시 디렉토리 생성됨: {}", tempDir);
            }

            // 기존 인증서 파일들 삭제 (잘못된 파일 방지)
            for (String fileName : CERTIFICATE_FILES) {
                Path existingFile = tempDir.resolve(fileName);
                if (Files.exists(existingFile)) {
                    Files.delete(existingFile);
                    log.info("기존 파일 삭제: {}", existingFile);
                }
            }

            // 각 인증서 파일 다운로드
            for (String fileName : CERTIFICATE_FILES) {
                String s3Key = bucketPrefix + "/" + fileName;
                Path localPath = tempDir.resolve(fileName);

                try {
                    log.info("S3에서 파일 다운로드 시작: {} -> {}", s3Key, localPath);
                    
                    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                            .bucket(bucketName)
                            .key(s3Key)
                            .build();

                    s3Client.getObject(getObjectRequest, localPath);

                    // 파일 존재 여부 및 크기 확인
                    if (Files.exists(localPath) && Files.size(localPath) > 0) {
                        long fileSize = Files.size(localPath);
                        log.info("인증서 파일 다운로드 완료: {} -> {} (크기: {} bytes)", 
                                s3Key, localPath, fileSize);
                        
                        // 파일 내용 검증
                        validateDownloadedFile(localPath, fileName);
                        
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
    
    private void validateDownloadedFile(Path filePath, String fileName) throws IOException {
        String content = Files.readString(filePath);
        long fileSize = Files.size(filePath);
        
        log.debug("파일 검증 - {} (크기: {} bytes)", fileName, fileSize);
        log.debug("파일 내용 (처음 300자): {}", content.substring(0, Math.min(300, content.length())));
        
        // Access Denied 오류 XML 확인
        if (content.contains("<Error>") && content.contains("AccessDenied")) {
            log.error("S3 Access Denied 오류가 파일에 포함되어 있습니다: {}", fileName);
            log.error("파일 전체 내용: {}", content);
            throw new RuntimeException("S3 Access Denied 오류 - " + fileName);
        }
        
        // 파일별 검증 로직
        if (fileName.equals("AmazonRootCA1.pem")) {
            if (!content.contains("-----BEGIN CERTIFICATE-----") || !content.contains("-----END CERTIFICATE-----")) {
                log.error("AmazonRootCA1.pem 파일이 올바른 인증서 형식이 아닙니다");
                throw new RuntimeException("AmazonRootCA1.pem 파일 형식 오류");
            }
        } else if (fileName.equals("certificate.pem.crt")) {
            if (!content.contains("-----BEGIN CERTIFICATE-----") || !content.contains("-----END CERTIFICATE-----")) {
                log.error("certificate.pem.crt 파일이 올바른 인증서 형식이 아닙니다");
                throw new RuntimeException("certificate.pem.crt 파일 형식 오류");
            }
        } else if (fileName.equals("private.pem.key")) {
            if (!content.contains("-----BEGIN") || !content.contains("-----END")) {
                log.error("private.pem.key 파일이 올바른 개인키 형식이 아닙니다");
                throw new RuntimeException("private.pem.key 파일 형식 오류");
            }
        }
        
        log.debug("파일 검증 완료: {}", fileName);
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
            
            // 파일 내용 재검증
            validateDownloadedFile(certPath, fileName);
            
            log.debug("인증서 파일 경로 반환: {} (크기: {} bytes)", certPath, Files.size(certPath));
            return certPath.toString();
        } catch (IOException e) {
            throw new RuntimeException("인증서 파일 확인 중 오류 발생: " + fileName, e);
        }
    }
} 