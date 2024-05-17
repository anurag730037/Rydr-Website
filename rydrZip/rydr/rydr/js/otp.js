$('.digit-group').find('input').each(function () {
    $(this).attr('maxlength', 1);
    $(this).on('keyup', function (e) {

        var parent = $($(this).parent());
        //shift key
        if (e.keyCode == 16) {
            return false;
        }
        if (e.keyCode === 8 || e.keyCode === 37) {
            var prev = parent.find('input#' + $(this).data('previous'));

            if (prev.length) {
                $(prev).select();
            }
        } else if ((e.keyCode >= 48 && e.keyCode <= 57)) {
            var next = parent.find('input#' + $(this).data('next'));

            if (next.length) {
                $(next).select();
            } else {
                if (parent.data('autosubmit')) {
                    parent.submit();
                }
            }
        } else {
            $(this).val("");
        }
    });
});

function otpValidation() {
    console.log("inside OTP");
    var otp = $("#digit-1").val() + $("#digit-2").val() + $("#digit-3").val() + $("#digit-4").val() + $("#digit-5").val() + $("#digit-6").val();

    console.log(otp);
    if (otp == null) {
        $(".otpError").hide();
    } else if (otp.length != 6) {
        $(".otpError").show();
        $(".otpError").html("One Time Password is required.");
    } else {
        $("#otp_submit").removeClass('l-btn');
        $("#otp_submit").addClass('y-btn');

        // console.log(otp);
        ajaxCallOTP(otp); // uncomment
        // toggleVisibility("success");  // comment

        return true;
    }
}
var accessToken = "";  // uncomment
// var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiX2lkIjoiNjRjMGZlZGM1MjU5MTY3OTMwMWFmMTY5In0sImlhdCI6MTY5MDM2OTgxNCwiZXhwIjoxNjkyOTYxODE0LCJ0eXBlIjoiYWNjZXNzIn0.ZcJ0FUBE0oyqgJcuJq8x-E2XCp5xDgJvyMahzlW-IA0";   // comment
function ajaxCallOTP(otp) {
    $.ajax({
        // Our sample url to make request
        url: `${API_URL_9000}otp/verify`,
        // Type of Request
        type: "POST",
        data: {
            "mobileNumber": mobile,
            "memberType": "rydr",
            "otp": otp,
            "deviceModel": "desktop",
            "lat": 22,
            "long" : 22
        },
        success: function (data, status, xhttp) {
            if (data) {
                console.log("res", data);
                var response = JSON.stringify(data);
                console.log("response: ", response);
                if (response != null) {
                    toggleVisibility("success");
                    cityData = response;
                }
                // Store the access token in the local storage
                accessToken = data.data.accessToken;
                console.log("accessToken: " + accessToken);
                localStorage.setItem('accessToken', accessToken);

                // get the access token from local storage
                var getToken = localStorage.getItem('accessToken');
                console.log("getToken: " + getToken);
            }
            else {
                console.log("Inside Error");
            }
        },
        error: function (error) {
            console.log(`Error ${JSON.stringify(error.responseJSON)}`);
            $(".otpError").show();
            $(".otpError").html(JSON.stringify(error.responseJSON.message));
        }
    });
}

// Timer Countdown
var interval;

function countdown() {
    $("#resend_btn_div").hide();
    clearInterval(interval);
    interval = setInterval(function () {
        var timer = $('.js-timeout').html();
        timer = timer.split(':');
        var minutes = timer[0];
        var seconds = timer[1];
        seconds -= 1;
        if (minutes < 0) return;
        else if (seconds < 0 && minutes != 0) {
            minutes -= 1;
            seconds = 59;
        }
        else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;
        $('.js-timeout').html(minutes + ':' + seconds);
        if (minutes == 0 && seconds == 0) {
            $("#resend_btn_div").show();
            $("#timerdiv").hide();
            clearInterval(interval);
        }
    }, 1000);
}

$('#js-resetTimer').click(function (interval) {
    ajaxCallDriverMobile();
    $('.js-timeout').text("2:00");
    clearInterval(interval);
    countdown();
    $("#timerdiv").show();
});