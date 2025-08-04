package kr.kro.areuhot.alert.util;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;

import javax.net.ssl.*;
import java.io.FileInputStream;
import java.io.IOException;
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
            
            // CA 인증서 로드
            CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
            X509Certificate caCert = (X509Certificate) certFactory.generateCertificate(new FileInputStream(caCertPath));
            log.debug("CA 인증서 로드 완료: {}", caCert.getSubjectDN());
            
            // 클라이언트 인증서 로드
            X509Certificate clientCert = (X509Certificate) certFactory.generateCertificate(new FileInputStream(clientCertPath));
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
    
    private static PrivateKey loadPrivateKey(String privateKeyPath) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        try (FileInputStream fis = new FileInputStream(privateKeyPath)) {
            byte[] keyBytes = fis.readAllBytes();
            String keyString = new String(keyBytes);
            
            log.debug("개인키 파일 내용 길이: {} bytes", keyBytes.length);
            
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