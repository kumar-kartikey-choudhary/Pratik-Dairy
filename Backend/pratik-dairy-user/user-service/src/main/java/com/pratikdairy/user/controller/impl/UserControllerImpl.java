package com.pratikdairy.user.controller.impl;

import com.pratikdairy.user.controller.UserController;
import com.pratikdairy.jwt.dto.LoginRequest;
import com.pratikdairy.jwt.dto.LoginResponse;
import com.pratikdairy.user.dto.UserDto;
import com.pratikdairy.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200",
        methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE},
        allowedHeaders = "*")
@Primary
@RequestMapping("/users")
public class UserControllerImpl implements UserController {

    private final UserService userService;


    @Autowired
    public UserControllerImpl(UserService userService){
        this.userService = userService;
    }

    @Override
    public ResponseEntity<UserDto> create(UserDto userDto) {
        return new ResponseEntity<>(this.userService.create(userDto), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
        return ResponseEntity.ok(this.userService.login(loginRequest));
    }

    @Override
    public ResponseEntity<UserDto> find(Long id) {
        return ResponseEntity.ok(this.userService.find(id));
    }

    @Override
    public ResponseEntity<List<UserDto>> findAll() {
        return ResponseEntity.ok(this.userService.findAll());
    }

//    @Override
//    public ResponseEntity<List<UserDto>> findUserByName(String name) {
//        return ResponseEntity.ok(this.userService.findUserByName(name));
//    }

    @Override
    public ResponseEntity<UserDto> update(UserDto userDto, Long id) {
        return ResponseEntity.ok(this.userService.update(userDto, id));
    }

    @Override
    public void delete(Long id) {
        this.userService.delete(id);
    }
}
