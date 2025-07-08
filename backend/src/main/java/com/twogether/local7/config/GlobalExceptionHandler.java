package com.twogether.local7.config; // 적절한 패키지로 변경해주세요.

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * 전역 예외 처리 핸들러
 * 애플리케이션 전체에서 발생하는 예외를 한 곳에서 처리합니다.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * IllegalArgumentException 예외를 처리합니다.
     * 잘못된 인자 값으로 인해 발생하는 예외를 400 Bad Request 상태로 응답합니다.
     * @param ex 발생한 IllegalArgumentException
     * @return 에러 메시지와 함께 400 Bad Request 응답
     */
    @ExceptionHandler(value = {IllegalArgumentException.class})
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    /**
     * 모든 일반적인 예외를 처리합니다.
     * 예상치 못한 모든 예외를 500 Internal Server Error 상태로 응답합니다.
     * @param ex 발생한 Exception
     * @return 에러 메시지와 함께 500 Internal Server Error 응답
     */
    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        return new ResponseEntity<>("An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 필요하다면 여기에 다른 종류의 예외를 처리하는 @ExceptionHandler 메소드를 추가할 수 있습니다.
    // 예: @ExceptionHandler(value = {YourCustomException.class})
    // public ResponseEntity<String> handleYourCustomException(YourCustomException ex) {
    //     return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    // }
}