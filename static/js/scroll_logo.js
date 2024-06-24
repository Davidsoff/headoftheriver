window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    //   document.getElementById("navbar").style.padding = "30px 10px";
      document.getElementById("navbar-logo").style.height = "90px";
      document.getElementById("navbar-logo").style.width = "90px";
    } else {
    //   document.getElementById("navbar").style.padding = "80px 10px";
      document.getElementById("navbar-logo").style.height = "120px";
      document.getElementById("navbar-logo").style.width = "120px";
    }
  }