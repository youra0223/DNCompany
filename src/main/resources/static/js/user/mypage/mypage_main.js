let currentHelpOfferId;
let currentHelpId;

document.addEventListener("DOMContentLoaded", () => {
  const petLists = document.querySelectorAll(".mypage_main_pet_list");
  const prevButton = document.querySelector(".mypage_main_pet_button_left");
  const nextButton = document.querySelector(".mypage_main_pet_button_right");
  let currentIndex = 0;

  // 초기 활성화
    petLists[currentIndex]?.classList.add("active");


  // 이전 버튼 클릭 이벤트
  prevButton.addEventListener("click", () => {
    petLists[currentIndex].classList.remove("active");
    currentIndex = (currentIndex - 1 + petLists.length) % petLists.length;
    petLists[currentIndex].classList.add("active");
  });

  // 다음 버튼 클릭 이벤트
  nextButton.addEventListener("click", () => {
    petLists[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % petLists.length;
    petLists[currentIndex].classList.add("active");
  });
});

// 버튼 및 모달 선택
const reviewBtns = document.querySelectorAll(".review-btn"); // 후기 버튼 리스트
const reportBtns = document.querySelectorAll(".report-btn"); // 신고 버튼 리스트
const reviewModal = document.querySelector(".review_modal_box"); // 리뷰 모달
const reportModal = document.querySelector(".report_modal_box"); // 신고 모달
const reviewCancelBtn = document.querySelector(".review-cancel-btn"); // 리뷰 취소 버튼
const reportCancelBtn = document.querySelector(".report-cancel-btn"); // 신고 취소 버튼

// 디버깅 로그
console.log("리뷰 버튼 리스트:", reviewBtns);
console.log("신고 버튼 리스트:", reportBtns);

// 리뷰 버튼 클릭 시 모달 열기
reviewBtns.forEach((btn) => {
  btn.addEventListener("click", function() {
    console.log("후기 버튼 클릭됨");

    // data 속성에서 ID 값들을 가져옴
    currentHelpOfferId = this.dataset.helpOfferId;
    console.log(this);
    currentHelpId = this.dataset.helpId;

    console.log('helpOfferId:', currentHelpOfferId);
    console.log('helpId:', currentHelpId);

    reviewModal.style.display = "flex";
  });
});

// 신고 버튼 클릭 시 모달 열기
reportBtns.forEach((btn) => {
  btn.addEventListener("click", function() {
    console.log("신고 버튼 클릭됨");
    console.log("버튼의 전체 dataset:", this.dataset);  // 모든 data 속성 확인
    currentHelpOfferId = this.dataset.helpOfferId;
    console.log('설정된 helpOfferId:', currentHelpOfferId); // 값이 제대로 설정되었는지 확인
    reportModal.style.display = "flex";
  });
});

// 리뷰 취소 버튼 클릭 시 모달 닫기
reviewCancelBtn.addEventListener("click", () => {
  console.log("리뷰 취소 버튼 클릭됨"); // 디버깅 로그
  reviewModal.style.display = "none"; // 모달 숨기기
});

// 신고 취소 버튼 클릭 시 모달 닫기
reportCancelBtn.addEventListener("click", () => {
  console.log("신고 취소 버튼 클릭됨"); // 디버깅 로그
  reportModal.style.display = "none"; // 모달 숨기기
});

document.querySelectorAll('.star_rating > .star').forEach(function (star) {
  star.addEventListener('click', function () {
    // 부모 요소의 모든 'star' 요소에서 'on' 클래스 제거
    const stars = this.parentNode.querySelectorAll('.star');
    stars.forEach(function (s) {
      s.classList.remove('on');
    });

    // 클릭된 별과 그 이전 별들에 'on' 클래스 추가
    this.classList.add('on');
    let prevStar = this.previousElementSibling;
    while (prevStar) {
      prevStar.classList.add('on');
      prevStar = prevStar.previousElementSibling;
    }

    // 별점 값 콘솔 출력 (선택사항)
    const rating = this.getAttribute('data-value');
    console.log(`선택한 별점: ${rating}`);

  });

});



// 리뷰 제출 버튼 이벤트
document.querySelector('.review_btn').addEventListener('click', function() {
  const reviewTitle = document.getElementById('reviewTitle').value;
  const reviewContent = document.getElementById('reviewContent').value;
  const selectedStars = document.querySelectorAll('.star_rating .star.on');
  const reviewStarRating = selectedStars.length;

  // 예외 체크
  if (!reviewTitle.trim()) {
    alert('제목을 입력해주세요.');
    return;
  }
  if (reviewStarRating === 0) {
    alert('별점을 선택해주세요.');
    return;
  }
  if (!reviewContent.trim()) {
    alert('리뷰 내용을 입력해주세요.');
    return;
  }

  const reviewWriteDTO = {
    reviewStarRating: reviewStarRating,
    reviewContent: reviewContent,
    helpOfferId: currentHelpOfferId,
    reviewTitle: reviewTitle,
    helpId: currentHelpId
  };
  console.log('전송되는 데이터:', reviewWriteDTO);
  fetch('/mypage/review/write', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewWriteDTO)
  })
      .then(response => {
        if (response.ok) {
          alert('리뷰가 성공적으로 등록되었습니다.');
          reviewModal.style.display = 'none';// 모달 닫기
          // 폼 초기화
          document.getElementById('reviewTitle').value = '';
          document.getElementById('reviewContent').value = '';
          document.querySelectorAll('.star_rating .star').forEach(star => {
            star.classList.remove('on');
          });

        } else {
          alert('리뷰 등록에 실패했습니다.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다.');
      });
});

// 신고 제출 버튼 이벤트
document.querySelector('.report_btn').addEventListener('click', function() {
  const reportTitle = document.getElementById('reportTitle').value;
  const reportContent = document.getElementById('reportContent').value;

  console.log('현재 helpOfferId 값:', currentHelpOfferId); // 전송 직전의 값 확인
  // 입력값 검증
  if (!reportTitle.trim()) {
    alert('제목을 입력해주세요.');
    return;
  }
  if (!reportContent.trim()) {
    alert('신고 내용을 입력해주세요.');
    return;
  }

  const reportWriteDTO = {
    reportContent: reportContent,
    helpOfferId: currentHelpOfferId,
    reportTitle: reportTitle,
    reportDate: new Date().toISOString()
  };

  console.log('전송되는 데이터:', reportWriteDTO);

  fetch('/mypage/report/write', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reportWriteDTO)
  })
      .then(response => {
        if (response.ok) {
          alert('신고가 성공적으로 등록되었습니다.');
          reportModal.style.display = 'none';  // 모달 닫기
          // 폼 초기화
          document.getElementById('reportTitle').value = '';
          document.getElementById('reportContent').value = '';
        } else {
          alert('신고 등록에 실패했습니다.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다.');
      });
});






