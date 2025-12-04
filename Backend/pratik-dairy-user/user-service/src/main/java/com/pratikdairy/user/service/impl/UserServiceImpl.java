package com.pratikdairy.user.service.impl;

import com.pratikdairy.parent.utility.MapperUtility;
import com.pratikdairy.jwt.dto.LoginRequest;
import com.pratikdairy.jwt.dto.LoginResponse;
import com.pratikdairy.user.dto.UserDto;
import com.pratikdairy.user.model.User;
import com.pratikdairy.user.repository.UserRepository;
import com.pratikdairy.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }


    @Override
    @Transactional
    public UserDto create(UserDto userDto) {
        log.info("Inside @class UserServiceImpl @method create @Param userDto :{}", userDto);
//        if(userDto.getId() != null)
//        {
//            throw new IllegalCallerException("User id must be null");
//        }
        try {
            User user = MapperUtility.sourceToTarget(userDto, User.class);
            log.info("Save user object to db");
            try{
            user = userRepository.saveAndFlush(user);
            } catch (Exception e) {
                throw new RuntimeException("Not save to db", e.fillInStackTrace());
            }
            return MapperUtility.sourceToTarget(user, UserDto.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        log.info("Inside @class UserServiceImpl @method login @Param loginRequest :{}", loginRequest);

        if(loginRequest == null)
        {
            throw new IllegalCallerException("Login request object can not be null");
        }
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new RuntimeException("User not found with that user name"));
        log.info("user:{}",user);
        String role = user.getRole();
        log.info("role:{}",role);
        return new LoginResponse(user.getId(),user.getUsername(), role);
    }


    @Override
    public UserDto find(Long id) {
        log.info("Inside @class UserServiceImpl @method find @Param id :{}", id);
        if(id == null)
        {
            throw new IllegalCallerException("User id can not be null");
        }
        try {
            User user = this.userRepository.findById(id).orElseThrow(() -> new RuntimeException());
            if(user == null)
            {
                log.info("Can not find user by that id :{}" ,id);
            }
            return MapperUtility.sourceToTarget(user, UserDto.class,"password");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<UserDto> findAll() {
        log.info("Inside @class UserServiceImpl @method findAll");
        try {
            List<User> all = this.userRepository.findAll();
            return  all.stream().map(user -> {
                try {
                    return MapperUtility.sourceToTarget(user, UserDto.class,"password");
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }).toList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public UserDto update(UserDto userDto, Long id) {
        log.info("Inside @class UserServiceImpl @method update @Param id :{}", id);
        if(id == null)
        {
            create(userDto);
        }
        try{
            User user = this.userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setFirstName(userDto.getFirstName());
            user.setMiddleName(userDto.getMiddleName());
            user.setLastName(userDto.getLastName());
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            user.setPassword(userDto.getPassword());

            log.info("User with id {} updated successfully", id);
            
            User user1 = this.userRepository.saveAndFlush(user);

            return MapperUtility.sourceToTarget(user1, UserDto.class,"password");

        } catch (Exception e) {
            log.error("Error while updating user with id {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to update user", e);
        }
    }

    @Override
    public void delete(Long id) {

        log.info("Inside @class UserServiceImpl @method delete @Param id :{}", id);

        if (id == null) {
            log.warn("User ID is null. Cannot delete user.");
            throw new IllegalArgumentException("User ID cannot be null");
        }

        try {
            // Step 1: Check if user exists
            Optional<User> existingUserOpt = userRepository.findById(id);
            if (existingUserOpt.isEmpty()) {
                log.warn("User with id {} not found. Nothing to delete.", id);
                throw new EntityNotFoundException("User not found with id: " + id);
            }

            // Step 2: Delete the user
            userRepository.deleteById(id);
            log.info("User with id {} deleted successfully", id);

        } catch (Exception e) {
            log.error("Error while deleting user with id {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to delete user", e);
        }

    }



//    @Override
//    public List<UserDto> findUserByName(String name) {
//        log.info("Inside @class UserServiceImpl @method findUserByName @Param name :{}",name);
//        if (name == null || name.isEmpty())
//            this.findAll();
//        try {
//            List<User> users = this.userRepository.findByNameContainingIgnoreCase(name);
//            return users.stream().map(user -> {
//                try {
//                    return MapperUtility.sourceToTarget(user, UserDto.class, "password");
//                } catch (Exception e) {
//                    throw new RuntimeException(e);
//                }
//            }).toList();
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }
}
