package com.example.dncompany.dto.admin.board;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class AdminReportBoardDTO {

    private Long reportId;
    private String category;
    private String title;
    private String status;
    private String writer;
    private String email;
    private String phoneNumber;
    private String createdAt;
}