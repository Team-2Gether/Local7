package com.twogether.local7;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.twogether.local7")
public class SraApplication {

	public static void main(String[] args) {
		SpringApplication.run(SraApplication.class, args);
	}
}
