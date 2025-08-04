package kr.kro.areuhot.alert.util;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;

import javax.net.ssl.*;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.*;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateKeySpec;
import java.util.Base64;

@Slf4j
public class PemSocketFactory {

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    public static SSLSocketFactory createSSLSocketFactory(String caCertPath, String clientCertPath, String privateKeyPath) {
        try {
            log.info("SSL 소켓 팩토리 생성 시작 - CA: {}, Client: {}, Key: {}", caCertPath, clientCertPath, privateKeyPath);
            
            // 파일 존재 여부 및 내용 검증
            validateCertificateFile(caCertPath, "CA 인증서");
            validateCertificateFile(clientCertPath, "클라이언트 인증서");
            validatePrivateKeyFile(privateKeyPath, "개인키");
            
            // CA 인증서 로드
            CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
            X509Certificate caCert = loadCertificate(caCertPath, certFactory, "CA");
            log.debug("CA 인증서 로드 완료: {}", caCert.getSubjectDN());
            
            // 클라이언트 인증서 로드
            X509Certificate clientCert = loadCertificate(clientCertPath, certFactory, "클라이언트");
            log.debug("클라이언트 인증서 로드 완료: {}", clientCert.getSubjectDN());
            
            // 개인키 로드
            PrivateKey privateKey = loadPrivateKey(privateKeyPath);
            log.debug("개인키 로드 완료: {}", privateKey.getAlgorithm());
            
            // KeyStore 설정
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            keyStore.load(null, null);
            keyStore.setCertificateEntry("ca", caCert);
            keyStore.setCertificateEntry("client", clientCert);
            keyStore.setKeyEntry("client-key", privateKey, "".toCharArray(), new X509Certificate[]{clientCert});
            
            // TrustManager 설정
            TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            trustManagerFactory.init(keyStore);
            
            // KeyManager 설정
            KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
            keyManagerFactory.init(keyStore, "".toCharArray());
            
            // SSLContext 설정 - TLS 1.2 명시
            SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
            sslContext.init(keyManagerFactory.getKeyManagers(), trustManagerFactory.getTrustManagers(), null);
            
            log.info("SSL 소켓 팩토리 생성 완료");
            return sslContext.getSocketFactory();
            
        } catch (Exception e) {
            log.error("SSL 소켓 팩토리 생성 실패", e);
            throw new RuntimeException("SSL 소켓 팩토리 생성 실패", e);
        }
    }
    
    private static void validateCertificateFile(String filePath, String fileType) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new RuntimeException(fileType + " 파일이 존재하지 않습니다: " + filePath);
        }
        
        long fileSize = Files.size(path);
        if (fileSize == 0) {
            throw new RuntimeException(fileType + " 파일이 비어있습니다: " + filePath);
        }
        
        String content = Files.readString(path);
        if (!content.contains("-----BEGIN CERTIFICATE-----") || !content.contains("-----END CERTIFICATE-----")) {
            log.error("{} 파일 내용 (처음 200자): {}", fileType, content.substring(0, Math.min(200, content.length())));
            throw new RuntimeException(fileType + " 파일이 올바른 PEM 인증서 형식이 아닙니다: " + filePath);
        }
        
        log.debug("{} 파일 검증 완료 - 크기: {} bytes", fileType, fileSize);
    }
    
    private static void validatePrivateKeyFile(String filePath, String fileType) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new RuntimeException(fileType + " 파일이 존재하지 않습니다: " + filePath);
        }
        
        long fileSize = Files.size(path);
        if (fileSize == 0) {
            throw new RuntimeException(fileType + " 파일이 비어있습니다: " + filePath);
        }
        
        String content = Files.readString(path);
        if (!content.contains("-----BEGIN") || !content.contains("-----END")) {
            log.error("{} 파일 내용 (처음 200자): {}", fileType, content.substring(0, Math.min(200, content.length())));
            throw new RuntimeException(fileType + " 파일이 올바른 PEM 개인키 형식이 아닙니다: " + filePath);
        }
        
        log.debug("{} 파일 검증 완료 - 크기: {} bytes", fileType, fileSize);
    }
    
    private static X509Certificate loadCertificate(String certPath, CertificateFactory certFactory, String certType) throws CertificateException, IOException {
        try (FileInputStream fis = new FileInputStream(certPath)) {
            X509Certificate cert = (X509Certificate) certFactory.generateCertificate(fis);
            log.debug("{} 인증서 로드 성공 - 주체: {}", certType, cert.getSubjectDN());
            return cert;
        } catch (CertificateException e) {
            log.error("{} 인증서 로드 실패: {}", certType, certPath);
            throw e;
        }
    }
    
    private static PrivateKey loadPrivateKey(String privateKeyPath) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        try (FileInputStream fis = new FileInputStream(privateKeyPath)) {
            byte[] keyBytes = fis.readAllBytes();
            String keyString = new String(keyBytes);
            
            log.debug("개인키 파일 내용 길이: {} bytes", keyBytes.length);
            log.debug("개인키 파일 내용 (처음 100자): {}", keyString.substring(0, Math.min(100, keyString.length())));
            
            // 다양한 PEM 형식 지원
            if (keyString.contains("-----BEGIN PRIVATE KEY-----")) {
                // PKCS#8 형식
                keyString = keyString.replace("-----BEGIN PRIVATE KEY-----", "")
                        .replace("-----END PRIVATE KEY-----", "")
                        .replaceAll("\\s", "");
                
                byte[] decodedKey = Base64.getDecoder().decode(keyString);
                PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
                KeyFactory keyFactory = KeyFactory.getInstance("RSA");
                
                log.debug("PKCS#8 형식 개인키 로드 완료");
                return keyFactory.generatePrivate(keySpec);
                
            } else if (keyString.contains("-----BEGIN RSA PRIVATE KEY-----")) {
                // RSA 형식 (AWS IoT Core에서 주로 사용)
                keyString = keyString.replace("-----BEGIN RSA PRIVATE KEY-----", "")
                        .replace("-----END RSA PRIVATE KEY-----", "")
                        .replaceAll("\\s", "");
                
                byte[] decodedKey = Base64.getDecoder().decode(keyString);
                PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
                KeyFactory keyFactory = KeyFactory.getInstance("RSA");
                
                log.debug("RSA 형식 개인키 로드 완료");
                return keyFactory.generatePrivate(keySpec);
                
            } else {
                log.error("지원되지 않는 개인키 형식. 파일 내용: {}", keyString);
                throw new IllegalArgumentException("지원되지 않는 개인키 형식입니다. PKCS#8 또는 RSA 형식이어야 합니다.");
            }
        }
    }
    
    public static void configureMqttConnectOptions(MqttConnectOptions options, String caCertPath, String clientCertPath, String privateKeyPath) {
        try {
            SSLSocketFactory sslSocketFactory = createSSLSocketFactory(caCertPath, clientCertPath, privateKeyPath);
            options.setSocketFactory(sslSocketFactory);
            
            // AWS IoT Core 최적화 설정
            options.setConnectionTimeout(30);
            options.setKeepAliveInterval(60);
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            
            log.info("MQTT 연결 옵션에 SSL 소켓 팩토리 설정 완료");
        } catch (Exception e) {
            log.error("MQTT 연결 옵션 SSL 설정 실패", e);
            throw new RuntimeException("MQTT 연결 옵션 SSL 설정 실패", e);
        }
    }
} 