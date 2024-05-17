// Country code inputs
const phoneInputField = document.querySelector("#phone");
var mobile = 0;
var email = "";
function validateForm(f) {
  email = document.getElementById('email').value;
  console.log(email);
  if (email == "") {
    $("#errorEmail").text("Email is required.");
    return false;
  }
  else {
    var re = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    var x = re.test(email);
    if (x) {
      $('#errorEmail').html("");
      mobile = document.getElementById('phone').value;
      var regX = /^[6789]\d{9}$/;
      var y = regX.test(mobile);
      if (!y) {
        $("#errorMobile").text("Mobile number is required.");
        return false;
      }
      else {
        $('#errorMobile').html("");
        if (f.agree.checked == false) {
          $("#errorAgree").text("Please check the box to continue.");
          return false;
        } else {
          $('#errorAgree').html("");
          document.getElementById("mobileNumber").innerHTML = mobile;
          // console.log("inside IF");

          $("#btn-pr-dm").removeClass('l-btn');
          $("#btn-pr-dm").addClass('y-btn');

          ajaxCallDriverMobile(); // uncomment
          toggleVisibility('driver_get_otp');

          console.log('timer started');
          $('.js-timeout').text("2:00");
          countdown();

          document.getElementById('btn-pr-dm').style.backgroundColor = '#ffc107';
          document.getElementById('email').value = "";
          document.getElementById('phone').value = "";
          // document.getElementById('agree').checked = false;
          $("#agree").attr("checked", false);

          return true;
        }
      }
    }
    else {
      $("#errorEmail").text("Email id not in correct format");
      return false;
    }
  }
}

function ajaxCallDriverMobile() {
  $.ajax({
    url: `${API_URL_9000}driver/verify-mobile`,
    type: "POST",
    data: {
      "mobileNumber": mobile,
      "memberType": "rydr"
    },
    success: function (data) {
      var x = JSON.stringify(data);
      console.log(x);
    },
    error: function (error) {
      console.log(`Error ${error}`);
    }
  });
}