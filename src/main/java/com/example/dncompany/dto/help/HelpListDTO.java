package com.example.dncompany.dto.help;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter@Setter@ToString
public class HelpListDTO {
    private Long helpId;
    private String helpTitle;
    private String helpCareType;
    private String helpAddress;
    private Integer helpPoint;
    private Integer helpPrice;
    private LocalDate helpCareDate;
    private LocalDateTime helpCreatedAt;
}