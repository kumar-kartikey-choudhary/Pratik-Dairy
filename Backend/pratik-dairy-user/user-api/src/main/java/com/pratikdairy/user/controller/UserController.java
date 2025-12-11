package com.pratikdairy.user.controller;

import com.pratikdairy.user.dto.LoginRequest;
import com.pratikdairy.user.dto.LoginResponse;
import com.pratikdairy.user.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@ResponseBody
@FeignClient(name = "PRATIK-DAIRY-USER" ,  primary = false , url = "${user.url}")
public interface UserController {

    @PostMapping(path = "register")
    ResponseEntity<UserDto> create(@Valid  @RequestBody UserDto userDto);

    @PostMapping(path = "login")
    ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest);

    @GetMapping(path = "admin/find/{id}")
    ResponseEntity<UserDto> find(@PathVariable("id") String id);

    @GetMapping(path = "admin/findAll")
    ResponseEntity<List<UserDto>> findAll();

    @PutMapping(path = "update/{id}")
    ResponseEntity<UserDto> update(@Valid @RequestBody UserDto userDto, @PathVariable(name = "id") String id);

    @DeleteMapping(path = "delete/{id}")
    void delete(@PathVariable(name = "id") String id);
}
