package com.pratikdairy.user.dto;

import com.pratikdairy.parent.base.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserDto extends BaseDto {

    private String firstName;
    private String middleName;
    private String lastName;
    private String username;
    private String email;
    private String role;
    private String password;
}
