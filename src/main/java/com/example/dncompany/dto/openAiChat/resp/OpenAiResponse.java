package com.example.dncompany.dto.openAiChat.resp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter @Setter @ToString
public class OpenAiResponse {
    private String id;
    private String model;
    private List<OpenAiChoice> choices;
}













