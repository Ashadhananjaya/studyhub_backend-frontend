package com.studyhub.studyhub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle validation errors (@Valid failed)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldError()
                .getDefaultMessage();

        return new ResponseEntity<>(
                new ErrorResponse("error", message),
                HttpStatus.BAD_REQUEST
        );
    }

    // Handle runtime exceptions with correct status codes
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {

        HttpStatus status = HttpStatus.BAD_REQUEST;
        String msg = ex.getMessage();

        if (msg != null) {
            if (msg.equalsIgnoreCase("Note not found") ||
                msg.equalsIgnoreCase("User not found")) {
                status = HttpStatus.NOT_FOUND;           // 404
            } else if (msg.equalsIgnoreCase("Unauthorized")) {
                status = HttpStatus.FORBIDDEN;           // 403
            }
        }

        return new ResponseEntity<>(
                new ErrorResponse("error", msg != null ? msg : "An error occurred"),
                status
        );
    }
}
