package com.pratikdairy.user.model;

import com.pratikdairy.parent.base.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "`user`")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class User extends BaseEntity  implements UserDetails {
    @Column(name = "FIRST_NAME" , columnDefinition = "VARCHAR(20) NOT NULL" , nullable = false)
    @NotNull
    private String firstName;

    @Column(name = "MIDDLE_NAME" , columnDefinition = "VARCHAR(20) ")
    private String middleName;

    @NotNull
    @Column(name = "LAST_NAME" , columnDefinition = "VARCHAR(20) NOT NULL", nullable = false)
    private String lastName;

    @NotNull
    @Column(name = "USERNAME" , columnDefinition = "VARCHAR(50) NOT NULL", nullable = false)
    private String username;

    @NotNull
    @Email
    @Column(name = "EMAIL" , columnDefinition = "VARCHAR(50) NOT NULL" , unique = true, nullable = false)
    private String email;

    @NotNull
    @Column(name = "ROLE", columnDefinition = "VARCHAR(20) NOT NULL DEFAULT 'USER'" , nullable = false)
    private String role = "CUSTOMER";

    @NotNull
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$")
    @Column(name = "PASSWORD", columnDefinition = "VARCHAR(1000) NOT NULL" , nullable = false)
    private String password;

    public User(String userId, String role) {
        this.setId(userId);
        this.role = role;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_"+ this.role));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
