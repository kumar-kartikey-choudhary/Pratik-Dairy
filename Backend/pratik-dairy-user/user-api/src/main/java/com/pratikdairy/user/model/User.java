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
import org.springframework.context.annotation.Role;

@Entity
@Table(name = "`user`")
@Data
@EqualsAndHashCode(callSuper = false)
public class User extends BaseEntity {
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
    private String role = "user";

    @NotNull
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$")
    @Column(name = "PASSWORD", columnDefinition = "VARCHAR(50) NOT NULL" , nullable = false)
    private String password;

}
