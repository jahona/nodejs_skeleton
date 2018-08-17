window.onload = function() {
  $("#loginBtn").click(function() {
    const userId = document.getElementById("userId").value;
    const userPw = document.getElementById("userPw").value;

    if (userId === "" || userPw === "") {
      alert("아이디 혹은 비밀번호를 입력해주세요");
    }

    let data = {
      userId: userId,
      userPw: userPw
    };

    data = JSON.stringify(data);

    let url = "http://localhost:8888/auth/login";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);

    xhr.addEventListener("load", function() {
      let result = JSON.parse(xhr.responseText);

      switch (xhr.status) {
        case 200:
          // 성공 처리
          location.href = "rooms.html";
          break;
        case 404:
          // 예외 처리
          alert("아이디 혹은 비밀번호를 다시 확인해주세요");
          break;
      }
    });
  });
};
