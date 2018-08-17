window.onload = function() {
  $("#registerBtn").click(function() {
    const userId = document.getElementById("userId").value;
    const userPw = document.getElementById("userPw").value;
    const userPwConfirm = document.getElementById("userPw-confirm").value;
    const nickname = document.getElementById("nickname").value;

    if (userId === "" || userPw === "" || nickname === "") {
      alert("가입 정보를 모두 입력해주세요");
      return;
    }

    if (userPw !== userPwConfirm) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    let data = {
      userId: userId,
      userPw: userPw,
      nickname: nickname
    };

    data = JSON.stringify(data);

    let url = "http://localhost:8888/users";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);

    xhr.addEventListener("load", function() {
      let result = JSON.parse(xhr.responseText);

      switch (xhr.status) {
        case 200:
          // 성공 처리
          alert("가입이 완료되었습니다");
          location.href = "/html/login.html";
          break;
        case 409:
          // 성공 처리
          alert("일치하는 계정이 존재합니다");
          break;
        case 500:
          // 예외 처리
          alert("서버 에러입니다");
          break;
      }
    });
  });
};
