package com.pratikdairy.jwt.service;

import com.pratikdairy.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository repository;

    @Autowired
    public CustomUserDetailService(UserRepository repository)
    {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Inside @class CustomUserDetailService @method loadUserByUsername");
        return this.repository.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("Username not found in the database"));
    }
}
