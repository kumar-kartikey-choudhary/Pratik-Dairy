package com.pratikdairy.user.controller.impl;

import com.pratikdairy.user.controller.UserController;
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
@RequestMapping(path = "users")
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
    public ResponseEntity<UserDto> find(String id) {
        return ResponseEntity.ok(this.userService.find(id));
    }

    @Override
    public ResponseEntity<List<UserDto>> findAll() {
        return ResponseEntity.ok(this.userService.findAll());
    }

    @Override
    public ResponseEntity<UserDto> update(UserDto userDto, String id) {
        return ResponseEntity.ok(this.userService.update(userDto, id));
    }

    @Override
    public void delete(String id) {
        this.userService.delete(id);
    }
}
