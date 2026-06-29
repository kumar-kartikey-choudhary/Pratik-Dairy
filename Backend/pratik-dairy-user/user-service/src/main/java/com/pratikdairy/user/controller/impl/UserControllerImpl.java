package com.pratikdairy.user.controller.impl;

import com.pratikdairy.user.controller.UserController;
import com.pratikdairy.user.dto.LoginRequest;
import com.pratikdairy.user.dto.LoginResponse;
import com.pratikdairy.user.dto.UserDto;
import com.pratikdairy.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:4200",
//        methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE},
//        allowedHeaders = "*")
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
    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
        return ResponseEntity.ok(this.userService.login(loginRequest));
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String loggedInUsername = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ADMIN"));
        // Find karo ki {id} waala user kaun hai
        UserDto targetUser;
        try {
            targetUser = this.userService.find(id);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

        // Admin ya sirf apna account — dono allow hain
        if (!isAdmin && !loggedInUsername.equals(targetUser.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(this.userService.update(userDto, id));
    }

    @Override
    public void delete(String id) {
        this.userService.delete(id);
    }
}
