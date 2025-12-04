package com.pratikdairy.user.service;

import com.pratikdairy.jwt.dto.LoginRequest;
import com.pratikdairy.jwt.dto.LoginResponse;
import com.pratikdairy.user.dto.UserDto;

import java.util.List;

public interface UserService {

    UserDto create(UserDto userDto);

    UserDto find(Long id);

    List<UserDto> findAll();

    UserDto update(UserDto userDto, Long id);

    void delete(Long id);

    LoginResponse login(LoginRequest loginRequest);

//    List<UserDto> findUserByName(String name);
}
