package com.repository;

//import com.entity.User;
//import org.springframework.data.repository.CrudRepository;

import com.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository

public interface FileRepository extends CrudRepository<User, Long> {
    List<User> findByEmailAndPassword(String email,String password);

    void delete(User file);

    public <S extends User> S save(String user, String file);

    void store(MultipartFile file);
}