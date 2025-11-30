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
@FeignClient(name = "User-Service" , url = "${user.url}", primary = false)
public interface UserController {

    @PostMapping(path = "auth/register")
    ResponseEntity<UserDto> create(@Valid  @RequestBody UserDto userDto);

    @PostMapping(path = "auth/login")
    ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest);

    @GetMapping(path = "admin/find/{id}")
    ResponseEntity<UserDto> find(@PathVariable("id") Long id);

    @GetMapping(path = "admin/findAll")
    ResponseEntity<List<UserDto>> findAll();

//    @GetMapping(path = "admin/findByName")
//    ResponseEntity<List<UserDto>> findUserByName(@RequestParam(name = "name") String name);

    @PutMapping(path = "update/{id}")
    ResponseEntity<UserDto> update(@Valid @RequestBody UserDto userDto, @PathVariable(name = "id") Long id);

    @DeleteMapping(path = "delete/{id}")
    void delete(@PathVariable(name = "id") Long id);
}
