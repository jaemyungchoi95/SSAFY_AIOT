package kr.kro.areuhot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("kr.kro.areuhot")
public class AreuhotApplication {

	public static void main(String[] args) {
		SpringApplication.run(AreuhotApplication.class, args);
	}

}
