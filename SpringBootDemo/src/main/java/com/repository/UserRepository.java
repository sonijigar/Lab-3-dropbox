package com.repository;

import com.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository

public interface UserRepository extends CrudRepository<User, Long> {

    User findFirstByUsernameAndPassword(String username, String password);

    User findByUserId(User[] userId);

    String[] findGroupsByUserId(String userId);

    String[] findUsersByGroupId(String userId);


    @Override
    public <S extends User> S save(S user);
}