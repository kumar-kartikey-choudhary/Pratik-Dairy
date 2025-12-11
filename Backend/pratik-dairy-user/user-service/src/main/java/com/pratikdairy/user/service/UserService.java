package com.pratikdairy.user.service;

import com.pratikdairy.user.dto.LoginRequest;
import com.pratikdairy.user.dto.LoginResponse;
import com.pratikdairy.user.dto.UserDto;

import java.util.List;

public interface UserService {

    UserDto create(UserDto userDto);

    UserDto find(String id);

    List<UserDto> findAll();

    UserDto update(UserDto userDto, String id);

    void delete(String id);

    LoginResponse login(LoginRequest loginRequest);
}
