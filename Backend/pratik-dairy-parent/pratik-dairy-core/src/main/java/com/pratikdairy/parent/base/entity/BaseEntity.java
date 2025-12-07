package com.pratikdairy.parent.base.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.ZonedDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
public class BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @CreatedBy
    @Column(name = "CREATED_BY" ,columnDefinition = "CHAR(100) NOT NULL DEFAULT 'ADMIN'", updatable = false)
    private String createdBy;

    @CreationTimestamp
    @Column(name = "CREATED_AT", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", updatable = false)

    private ZonedDateTime createdAt;

    @LastModifiedBy
    @Column(name = "MODIFIED_BY" ,columnDefinition = "CHAR(100) NOT NULL DEFAULT 'ADMIN'")
    private String modifiedBy;

    @UpdateTimestamp
    @Column(name = "MODIFIED_AT", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private ZonedDateTime modifiedAt;
}
