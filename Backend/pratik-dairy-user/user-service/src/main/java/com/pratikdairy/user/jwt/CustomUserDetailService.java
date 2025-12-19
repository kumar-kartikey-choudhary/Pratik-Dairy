package com.pratikdairy.user.jwt;

import com.pratikdairy.user.model.User;
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

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Inside @class CustomUserDetailService @method loadUserByUsername");
        try{
            User user= this.userRepository.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("User With this username is not found"));
            log.info("User :{}",user);
            return user;
        } catch (UsernameNotFoundException e) {
            throw new RuntimeException("User not found....");
        }
    }
}
