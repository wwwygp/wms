window.onload = function() {
  var shit = !-[1, ];
  var oWin = document.getElementById("win");
  var oLay = document.getElementById("overlay");
  // var oBtn = document.getElementsByTagName("button")[0];
  var oClose = document.getElementsByClassName("close");
  var oH2 = oWin.getElementsByTagName("h2")[0];
  var bDrag = false;
  var disX = disY = 0;
  var iScrollT = document.documentElement.scrollTop || document.body.scrollTop;
  var iScrollL = document.documentElement.scrollLeft || document.body.scrollLeft;
  oBtn.onclick = function() {
    oLay.style.display = "block";
    oWin.style.display = "block";
    shit && (oLay.style.height = document.body.offsetHeight + "px");
  };
  for (var i = 0; i < oClose.length; i++) {
    oClose[i].onclick = function() {
      //注意涉及到这个对象不能使用oClose[i],要用this代替
      oLay.style.display = "none";
      oWin.style.display = "none";
    }
  }
};
