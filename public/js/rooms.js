window.onload = function() {
  const getRoomList = function() {
    return new Promise(function(resolve, reject) {
      let url = "http://localhost:8888/rooms";

      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(null);

      xhr.addEventListener("load", function() {
        let result = JSON.parse(xhr.responseText);

        switch (xhr.status) {
          case 200:
            // 성공 처리
            resolve(result.rooms);
          case 500:
            // 예외 처리
            reject("server error");
        }
      });
    });
  };

  const goChattingRoom = function(index) {
    return function() {
      location.href = "room.html";
    };
  };

  var roomList = [];

  getRoomList()
    .then(function(data) {
      return (roomList = data);
    })
    .then(function() {
      let ul = document.getElementById("roomList");

      for (var i = 0; i < roomList.length; i++) {
        var node = document.createElement("li");
        var t = document.createTextNode(roomList[i].title);
        node.appendChild(t);
        node.addEventListener("click", goChattingRoom(i));

        ul.appendChild(node);
      }
    });
};
