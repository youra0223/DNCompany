package com.example.dncompany.controller.help;

import com.example.dncompany.dto.help.HelpListDTO;
import com.example.dncompany.dto.help.HelpDetailDTO;
import com.example.dncompany.dto.help.HelpSearchDTO;
import com.example.dncompany.dto.help.HelpWriteDTO;
import com.example.dncompany.dto.help.pet.HelpPetListDTO;
import com.example.dncompany.mapper.help.HelpMapper;
import com.example.dncompany.service.help.HelpService;
import com.example.dncompany.service.help.pet.HelpPetService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/help")
@RequiredArgsConstructor
public class HelpController {
    private final HelpService helpService;
    private final HelpPetService helpPetService;
    private final HelpMapper helpMapper;

    /**
     * 도와주세요 게시글 작성 페이지 요청을 처리
     *
     * @param usersId 세션에서 가져온 사용자 ID
     * @param model   View에 데이터를 전달하기 위한 Model 객체
     * @return 로그인이 안된 경우 로그인 페이지로, 로그인된 경우 글쓰기 페이지로 이동
     */
    @GetMapping("/write")
    public String helpWrite(@SessionAttribute(value = "usersId", required = false) Long usersId,
                            Model model) {
        //  usersId = 6L; // 임시 처리

        // 로그인 여부 체크
        if (usersId == null) {
            return "/user/login";
        }


        // 로그인한 사용자의 반려동물 목록 조회
        List<HelpPetListDTO> petList = helpPetService.getPetListByUsersId(usersId);
        model.addAttribute("petList", petList); // 펫 리스트를 모델에 추가

        return "help/write";
    }

    /**
     * 도와주세요 게시글 등록 요청을 처리
     *
     * @param usersId      세션에서 가져온 사용자 ID
     * @param helpWriteDTO helpWriteDTO 게시글 작성 데이터를 담은 DTO
     * @return 게시글 목록 페이지로 리다이렉트
     */
    @PostMapping("/write")
    public String helpWrite(@SessionAttribute(value = "usersId", required = false) Long usersId,
                            HelpWriteDTO helpWriteDTO) {
        log.info("helpWriteDTO: {}", helpWriteDTO);
        //  usersId = 6L; // 임시 처리

        helpService.registerHelp(helpWriteDTO, usersId); // 게시글 등록 처리

        return "redirect:/help/list";
    }

    /**
     * 도와주세요 게시글 목록 페이지 요청 처리
     *
     * @param usersId 세션에서 가져온 사용자 ID
     * @param model   View에 데이터를 전달하기 위한 Model 객체
     * @return 로그인이 안된 경우 로그인 페이지, 로그인이 된 경우 목록 페이지로 이동
     */
    @GetMapping("/list")
    public String helpList(@SessionAttribute(value = "usersId", required = false) Long usersId,
                           Model model) {
        // 로그인 체크
        if (usersId == null) {
            return "/user/login";
        }

        // 게시글 목록 조회
        List<HelpListDTO> helpList = helpService.getHelpList();

        // 각 게시글의 신청 상태를 Map에 저장
        Map<Long, Boolean> offerStatus = new HashMap<>();
        for(HelpListDTO help : helpList) {
            offerStatus.put(help.getHelpId(), helpMapper.checkHelpOfferExists(help.getHelpId()) > 0);
        }

        // 모델에 데이터 추가
        model.addAttribute("helpList", helpList);
        model.addAttribute("offerStatus", offerStatus);

        return "help/list";


    }

    /**
     * 도와주세요 상세 페이지 요청을 처리
     *
     * @param helpId 조회할 게시글 ID
     * @param model  View에 데이터를 전달하기 위한 Model 객체
     * @return 상세 페이지 이동
     */
//    @GetMapping("/detail")
//    public String helpDetail(@RequestParam Long helpId, Model model) {
//        // 게시글 상세 정보 조회
//        HelpDetailDTO helpDetail = helpService.getHelpDetail(helpId);
//        log.info("helpDetail: {}", helpDetail);
//        model.addAttribute("helpDetail", helpDetail);
//        return "help/detail";
//
//
//    }
    @GetMapping("/detail")
    public String helpDetail(@RequestParam Long helpId, Model model) {
        HelpDetailDTO helpDetail = helpService.getHelpDetail(helpId);
        log.info("helpDetail: {}", helpDetail);

        // 모집 상태 확인
        boolean isRecruiting = helpMapper.checkHelpOfferExists(helpId) > 0;

        model.addAttribute("helpDetail", helpDetail);
        model.addAttribute("isRecruiting", isRecruiting);
        return "help/detail";
    }

    /**
     * 도와주세요 게시글 검색 요청을 처리
     *
     * @param searchDTO 검색 조건을 담은 DTO
     * @param model     View에 데이터를 전달하기 위한 Model 객체
     * @return 검색 결과를 포함한 목록 페이지로 이동
     */
    @GetMapping("/search")
    public String searchHelp(@ModelAttribute HelpSearchDTO searchDTO, Model model) {
        log.info("검색 요청 DTO: {}", searchDTO); // 검색 조건 로그

        // 검색 조건에 맞는 게시글 목록 조회
        List<HelpListDTO> searchResult = helpService.searchHelpList(searchDTO);
        log.info("검색 결과 개수: {}", searchResult.size()); // 결과 개수 로그

        // 검색 결과와 검색 조건을 모델에 추가
        model.addAttribute("helpList", searchResult);
        model.addAttribute("searchDTO", searchDTO);
        return "help/list";
    }

}














