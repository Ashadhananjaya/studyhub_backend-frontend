package com.studyhub.studyhub.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studyhub.studyhub.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}