package com.service;

import com.entity.User;
import com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Iterable<User> getAllUsers(){
        return userRepository.findAll();
    }

    public void addUser(User user){
        userRepository.save(user);
    }

    public User signUp(User user){
        return userRepository.save(user);
    }
    public User login(String username,String password){
        return userRepository.findFirstByUsernameAndPassword(username, password);
    }

    public User createGroup(User[] members, String userId){
        return userRepository.findByUserId(members);
    }

    public String[] getGroups(String userId){
        return userRepository.findGroupsByUserId(userId);
    }

    public String[] getMembers(String userId){
        return userRepository.findUsersByGroupId(userId);
    }


}