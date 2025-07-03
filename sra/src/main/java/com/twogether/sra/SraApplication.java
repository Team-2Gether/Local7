package com.twogether.sra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class SraApplication {

	public static void main(String[] args) {
		SpringApplication.run(SraApplication.class, args);
	}
}
