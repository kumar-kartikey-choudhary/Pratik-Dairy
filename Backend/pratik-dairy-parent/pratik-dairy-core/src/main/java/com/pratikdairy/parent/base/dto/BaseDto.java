package com.pratikdairy.parent.base.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class BaseDto {

    private Long id;
    private String createdBy;
    private ZonedDateTime createdAt;
    private String modifiedBy;
    private ZonedDateTime modifiedAt;
}
