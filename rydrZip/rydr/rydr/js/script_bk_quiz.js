var divs = ["driver_mobile_number", "driver_get_otp", "success", "choose_city", "choose_vehicle",
    "verify_documents", "PAN", "Aadhaar", "DrivingLicenseVerify", "VehicleRC", "CaptainTraining",
    "Profile", "training_success", "AddBankDetails", "quiz"];
var visibleDivId = null;
var visibleDiv = "";

function toggleVisibility(divId) {
    if (visibleDivId === divId) {
        //visibleDivId = null;
    } else {
        visibleDivId = divId;
    }
    hideNonVisibleDivs();
}

function hideNonVisibleDivs() {
    var i, divId, div;
    for (i = 0; i < divs.length; i++) {
        divId = divs[i];
        div = document.getElementById(divId);
        if (visibleDivId === divId) {
            div.style.display = "block";  // visible
            console.log(divId);
            $("#btn-pr-dm").addClass('l-btn');
            $('#digit-1').focus();
            $("#otp_submit").addClass('l-btn');
            $("#emailInput").text(email);

            if (divId === 'VehicleRC') {
                ajaxCallVehicleColorSelection();
            }
            if(divId === 'CaptainTraining'){
                ajaxCallGetAllLessons();
            }
        }
        else {
            div.style.display = "none";   // hide
            $("input[type='text'], input[type='email'], input[type='number'], input[type='date'], input[type='file'], input[type='radio']").val('');
            $("input[type='radio']").prop('checked', false);
            $('.p-front').attr('src', 'images/front.png');
            $('.p-back').attr('src', 'images/back.png');
            $('.errorText').text('');
            $('#successNumber_PAN').text('');
            $('#successNumber_Aadhaar').text('');
        }
    }
}
/* :: Check weather city is already mentioned or not :: */
var cityData = "";
function checkCity() {
    // console.log('cityData ' + cityData); // uncomment
    // var response = JSON.parse(cityData); // uncomment
    // console.log('RESPONSE ' + response); // uncomment
    // var userCity = response.data.user.cityName; // uncomment
    // console.log("userCity : " + userCity); // uncomment
    var userCity = "Delhi NCR" // comment
    if (userCity != null) {
        toggleVisibility("choose_vehicle");
    }
    else {
        ajaxCallSelectCity();
    }
}
/* :: SELECT CITY  :: */
function cityList(res) {
    let option = `<option value="{__}">{__}</option>`
    toggleVisibility('choose_city');
    var text = `<option value="select">Select City</option>`;
    console.log(res);
    console.log(res.data);
    for (let i = 0; i < res.data.length; i++) {
        text += option.replaceAll('{__}', res.data[i]);
    }
    document.getElementById('city').innerHTML = text;
}
function ajaxCallSelectCity() {
    $.ajax({
        url: `${API_URL_9000}serviceableCities/city-list`,
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (data, status, xhttp) {
            if (data) {
                console.log("DATA : " + data);
                var response = data;
            }
            cityList(JSON.parse(JSON.stringify(response)));
        },
        error: function (error) {
            console.log(`Error ${JSON.stringify(error.responseJSON)}`);
            $(".otpError").show();
            $(".otpError").html(JSON.stringify(error.responseJSON.message));
        }
    });
}
/* :: REDIRECT TO VEHICLE FROM SUCCESS :: */
var selectedItem = ""
function selectVehicle() {
    console.log("You have selected the name - " + selectedItem);
    selectedItem = $('#city').children("option:selected").val();
    console.log("You have selected the name - " + selectedItem);
    // $("select.city").change(function () {
    //     selectedItem = $(this).children("option:selected").val();
    // });
    ajaxCallSelectVehicle();
}
function ajaxCallSelectVehicle() {
    $.ajax({
        url: `${API_URL_9000}driver/update-profile`,
        type: "POST",
        data: {
            "CityName": selectedItem
        },
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (data, status, xhttp) {
            toggleVisibility('choose_vehicle');
        },
        error: function (error) {
        }
    });
}
/* :: SELECT VEHICLE:: */
var bikeID = "";
function vehicleList() {
    document.getElementById("bike").style.borderColor = "lightgreen";
    $("#vl_continue").removeClass('l-btn');
    $("#vl_continue").addClass('y-btn');
    bikeID = true;
}
function ajaxCallVehicle() {
    console.log("ACCESSTOKEN : " + accessToken);
    if (bikeID) {
        $.ajax({
            url: `${API_URL_9000}driver/update-profile`,
            type: "POST",
            data: {
                "vehicleType": "Bike",
            },
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function() {
                ajaxCallDocVerify();
            },
            error: function(error) {
                $("#errorVehicle").text("Not processing...");
            }
        });
    }
    else {
        $("#errorVehicle").text("Please select vehicle and continue...");
    }
}
/* :: VERIFY DOCUMENT :: */
function ajaxCallDocVerify() {
    $.ajax({
        // Driver document verify and check the status api url to make request
        url: `${API_URL_9000}driver/checkDocStatus`,
        type: "POST",
        data: {
            "docTypes": [
                "PAN",
                "AADHAR",
                "DL",
                "RC",
                "Training",
                "Profile",
                "Payment"
            ]
        },
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            if (response) {
                var responseVerifyDoc = JSON.stringify(response);
                // console.log("verify doc response data" + responseVerifyDoc);
                var responseData = JSON.parse(responseVerifyDoc);
                // console.log("responseData : " + responseData);
                var documentList = responseData.data;
                // console.log("DocName: " + documentList);

                toggleVisibility('verify_documents');
                var document_LI = `<li class="d-flex justify-content-between align-items-center statusClass" onclick="toggleVisibility('{DIV}');">
                                        <div class="w-100">
                                            <p>DOC_NAME</p>
                                            <small style="display:none" id="verify_txt">Under Verification...</small>
                                        </div>
                                        <img src="IMAGE" alt="">
                                    </li>`;
                let list = "";
                for (let i = 0; i < documentList.length; i++) {
                    // console.log(documentList[i]);
                    document_LI;
                    // console.log("documentList[i].docName : " + documentList[i].docName);
                    // console.log("documentList[i].navigaton : " + documentList[i].navigation);
                    // if (documentList[i].docName == "Aadhar Card") {
                    //     list += document_LI.replace('DOC_NAME', 'Aadhaar Card');
                    // }
                    if (documentList[i].status == "complete" || documentList[i].status == "verified") {
                        list += document_LI.replace('DOC_NAME', documentList[i].docName).replace('IMAGE', 'images/complete.png').replace('{DIV}', documentList[i].navigation).replace('statusClass', 'disabled-div');
                    }
                    else if (documentList[i].status == "under verification") {
                        list += document_LI.replace('DOC_NAME', documentList[i].docName).replace('IMAGE', 'images/under-verification.png').replace('{DIV}', documentList[i].navigation).replace('style="display:none"', 'style="display:block"');
                    }
                    else {
                        list += document_LI.replace('DOC_NAME', documentList[i].docName).replace('IMAGE', 'images/info.png').replace('{DIV}', documentList[i].navigation);
                    }
                }
                document.getElementById('documentListFE').innerHTML = list;
            }
        },
        error: function (error) {
        }
    });
}

/* :: Driver License :: */
// Image Upload Click Event :: Driving License upload
var imgInputFront_DL = document.getElementById('imgUploadFront_DL');
var imgInputBack_DL = document.getElementById('imgUploadBack_DL');
var imgInputFront_PAN = document.getElementById('imgUploadFront_PAN');
var imgInputBack_PAN = document.getElementById('imgUploadBack_PAN');
var imgInputFront_Aadhaar = document.getElementById('imgUploadFront_Aadhaar');
var imgInputBack_Aadhaar = document.getElementById('imgUploadBack_Aadhaar');
var imgInputFront_RC = document.getElementById('imgUploadFront_RC');
var imgInputBack_RC = document.getElementById('imgUploadBack_RC');
var imgPathFront_DL = null;
var imgPathBack_DL = null;
var imgPathFront_PAN = null;
var imgPathBack_PAN = null;
var imgPathFront_Aadhaar = null;
var imgPathBack_Aadhaar = null;
var imgPathFront_RC = null;
var imgPathBack_RC = null;

function uploader(input, id) {
    let reader = new FileReader();
    reader.onload = function (e) {
        switch (id) {
            case "previewFront_DL":
                $("#previewFront_DL").attr("src", e.target.result);
                break;
            case "previewBack_DL":
                $("#previewBack_DL").attr("src", e.target.result);
                break;
            case "previewFront_PAN":
                $("#previewFront_PAN").attr("src", e.target.result);
                break;
            case "previewBack_PAN":
                $("#previewBack_PAN").attr("src", e.target.result);
                break;
            case "previewFront_Aadhaar":
                $("#previewFront_Aadhaar").attr("src", e.target.result);
                break;
            case "previewBack_Aadhaar":
                $("#previewBack_Aadhaar").attr("src", e.target.result);
                break;
            case "previewFront_RC":
                $("#previewFront_RC").attr("src", e.target.result);
                break;
            case "previewBack_RC":
                $("#previewBack_RC").attr("src", e.target.result);
                break;
        }
    };
    reader.readAsDataURL(input);
}

imgInputFront_DL.addEventListener('change', function (e) {
    if (e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/png'
        || e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/jpg') {
        uploader(e.currentTarget.files[e.currentTarget.files.length - 1], 'previewFront_DL');
        imgPathFront_DL = e.currentTarget.files[e.currentTarget.files.length - 1];
        document.getElementById('errorFront_DL').style.display = 'none';
    } else {
        document.getElementById('errorFront_DL').style.display = 'block';
        $('#previewFront_DL').attr('src', 'images/front.png');
    }
})

imgInputBack_DL.addEventListener('change', function (e) {
    if (e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/png'
        || e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/jpg') {
        uploader(e.currentTarget.files[e.currentTarget.files.length - 1], 'previewBack_DL');
        imgPathBack_DL = e.currentTarget.files[e.currentTarget.files.length - 1];
        document.getElementById('errorBack_DL').style.display = 'none';
    } else {
        document.getElementById('errorBack_DL').style.display = 'block';
        $('#previewBack_DL').attr('src', 'images/back.png');
    }
})

// Validate Driver license Numbers
var license_Number = "";
function isValid_License_Number() {
    license_Number = document.getElementById('DL_input').value;
    console.log(license_Number);
    $("#errorDrivingLicence").focus();
    let regex = /^[A-Z]{2}[0-9]{7,13}$/;
    var y = regex.test(license_Number);
    if (y) {
        console.log("license_Number === true");
        $("#errorDrivingLicence").html("");
        $("#uploadDrivingLicense").show();
    } else if (license_Number === "") {
        $("#errorDrivingLicence").html("Please enter a valid Driving Licence.");
        $("#dl-eg").hide();
        $("#uploadDrivingLicense").hide();
    } else {
        $("#errorDrivingLicence").html("Please enter a valid Driving Licence...");
        $("#uploadDrivingLicense").hide();
    }
}
function ajaxCallUploadDriverLicense() {
    var formData = new FormData();
    formData.append('docType', 'DL');
    formData.append('docNumber', license_Number);
    formData.append('documentFront', imgPathFront_DL);
    formData.append('documentBack', imgPathBack_DL);
    $.ajax({
        // Our sample url to make request
        url: `${API_URL_9000}driver/upload`,
        // Type of Request
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (data, status, xhttp) {
            console.log("upload image data : " + data);
            ajaxCallDocVerify();
            // $('#license_Number').html("");
            // $('#imgUploadFront_DL').value("");
            // $('#imgUploadBack_DL').value("");
        },
        error: function (error) {
            $("#errorApi_DL").html(JSON.stringify(error.responseJSON.message));
        }
    });
}

/* :: PAN Card :: */
// Image Upload Click Event :: PAN Card upload

imgInputFront_PAN.addEventListener('change', function (f) {
    console.log('imgInputFront_PAN.addEventListener');
    if (f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/png'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpg')
    {
        uploader(f.currentTarget.files[f.currentTarget.files.length - 1], 'previewFront_PAN');
        imgPathFront_PAN = f.currentTarget.files[f.currentTarget.files.length - 1];
        console.log('imgPathFront_PAN : ' + imgPathFront_PAN);
        document.getElementById('errorFront_PAN').style.display = 'none';
    } else {
        document.getElementById('errorFront_PAN').style.display = 'block';
        $('#previewFront_PAN').attr('src', 'images/front.png');
    }
})

imgInputBack_PAN.addEventListener('change', function (f) {
    if (f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/png'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpg')
    {
        uploader(f.currentTarget.files[f.currentTarget.files.length - 1], 'previewBack_PAN');
        imgPathBack_PAN = f.currentTarget.files[f.currentTarget.files.length - 1];
        document.getElementById('errorBack_PAN').style.display = 'none';
    } else {
        document.getElementById('errorBack_PAN').style.display = 'block';
        $('#previewBack_PAN').attr('src', 'images/back.png');
    }
})
// Validate PAN Numbers
var PAN_Number = "";
function validate_PAN() {
    PAN_Number = document.getElementById('PAN_input').value;
    console.log(PAN_Number);
    $("#PAN_input").focus();
    let regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    var y = regex.test(PAN_Number);
    if (y) {
        console.log("PAN_Number === true");
        $("#errorNumber_PAN").hide();
        $("#uploadDoc_PAN").show();
        ajaxCallVerifyPAN(PAN_Number);
    } else if (PAN_Number === "") {
        $("#errorNumber_PAN").html("This field is required and cannot be empty.");
        $("#uploadDoc_PAN").hide();
    } else if (PAN_Number !== 10) {
        $("#errorNumber_PAN").html("PAN card number must be 10 characters long.");
        $("#uploadDoc_PAN").hide();
    } else {
        $("#errorNumber_PAN").html("Please enter a valid PAN Number...");
        $("#uploadDoc_PAN").hide();
    }
}
function ajaxCallVerifyPAN(panNum) {
    $.ajax({
        // Our sample url to make request
        url: `${API_URL_9000}payOut/verifyPan`,
        // Type of Request
        type: "POST",
        data: { "pan": panNum },
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response, status, xhttp) {
            console.log(response);
            if (response) {
                var responsePAN = JSON.stringify(response);

                var responseData_P = JSON.parse(responsePAN);
                console.log("verify doc response data" + responseData_P);
                $("#successNumber_PAN").html(responseData_P.data.message);
            }
        },
        error: function (error) {
            $("#errorApi_PAN").html(JSON.stringify(error.responseJSON.message));
        }
    });
}
function ajaxCallUploadPAN() {
    var formDataPAN = new FormData();
    formDataPAN.append('docType', 'PAN');
    formDataPAN.append('docNumber', PAN_Number);
    formDataPAN.append('documentFront', imgPathFront_PAN);
    formDataPAN.append('documentBack', imgPathBack_PAN);
    validate_PAN();
    $.ajax({
        // Our sample url to make request
        url: `${API_URL_9000}driver/upload`,
        // Type of Request
        type: "POST",
        data: formDataPAN,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            if (response) {
                var panVerifySuccess = response.data.message;
                $("#successNumber_PAN").html(panVerifySuccess);
            }
            ajaxCallDocVerify();
        },
        error: function (error) {
            $("#errorApi_PAN").html(JSON.stringify(error.responseJSON.message));
        }
    });
}

/* :: Aadhaar Card :: */
// Image Upload Click Event :: Aadhaar Card upload

imgInputFront_Aadhaar.addEventListener('change', function (f) {
    console.log('imgInputFront_Aadhaar.addEventListener');
    if (f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/png'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpg') {
        uploader(f.currentTarget.files[f.currentTarget.files.length - 1], 'previewFront_Aadhaar');
        imgPathFront_Aadhaar = f.currentTarget.files[f.currentTarget.files.length - 1];
        console.log('imgPathFront_Aadhaar : ' + imgPathFront_Aadhaar);
        document.getElementById('errorFront_Aadhaar').style.display = 'none';
    } else {
        document.getElementById('errorFront_Aadhaar').style.display = 'block';
        $('#previewFront_Aadhaar').attr('src', 'images/front.png');
    }
})

imgInputBack_Aadhaar.addEventListener('change', function (f) {
    if (f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/png'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpg') {
        uploader(f.currentTarget.files[f.currentTarget.files.length - 1], 'previewBack_Aadhaar');
        imgPathBack_Aadhaar = f.currentTarget.files[f.currentTarget.files.length - 1];
        document.getElementById('errorBack_Aadhaar').style.display = 'none';
    } else {
        document.getElementById('errorBack_Aadhaar').style.display = 'block';
        $('#previewBack_Aadhaar').attr('src', 'images/back.png');
    }
})
// Validate Aadhaar Number
var Aadhaar_Number = "";
function validate_Aadhaar()
{
    Aadhaar_Number = document.getElementById('Aadhaar_input').value;
    console.log('Aadhaar_Number : ', Aadhaar_Number);
    var errorNumber_Aadhaar = document.getElementById("errorNumber_Aadhaar");
        errorNumber_Aadhaar.innerHTML = "";
    var successNumber_Aadhaar = document.getElementById("successNumber_Aadhaar");
        successNumber_Aadhaar.innerHTML = "";
    $("#Aadhaar_input").focus();

    var RegExpr = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
    var r = RegExpr.test(Aadhaar_Number);
    if(r) {
        console.log("Aadhaar_Number === true");
        $("#errorNumber_Aadhaar").hide();
        ajaxCallVerifyAadhaar(Aadhaar_Number);
    }
    else if (Aadhaar_Number === "") {
        $("#errorNumber_Aadhaar").html("This field is required and cannot be empty.");
        $("#uploadDoc_Aadhaar").hide();
    }
    else if (Aadhaar_Number !== 12) {
        $("#errorNumber_Aadhaar").show();
        $("#errorNumber_Aadhaar").html("Aadhaar number must be 12 digits.");
        $("#uploadDoc_Aadhaar").hide();
    }
    else {
        errorNumber_Aadhaar.innerHTML = "Invalid Aadhaar Number";
        $("#uploadDoc_Aadhaar").hide();
    }
}
// Timer Countdown
var adhaarOTPinterval;

function aadhaarOTPcountdown() {
    $("#resend_btn_div_Aadhaar").hide();
    clearInterval(adhaarOTPinterval);
    adhaarOTPinterval = setInterval(function () {
        var timer = $('.js-timeout_Aadhaar').html();
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
        $('.js-timeout_Aadhaar').html(minutes + ':' + seconds);
        if (minutes == 0 && seconds == 0) {
            $("#resend_btn_div_Aadhaar").show();
            $("#timerdiv_Aadhaar").hide();
            clearInterval(adhaarOTPinterval);
        }
    }, 1000);
}

$('#js-resetTimer_Aadhaar').click(function (adhaarOTPinterval) {
    ajaxCallVerifyAadhaar(Aadhaar_Number);
    $('.js-timeout_Aadhaar').text("1:00");
    clearInterval(adhaarOTPinterval);
    aadhaarOTPcountdown();
    $("#timerdiv_Aadhaar").show();
});

var response_adhaarDetail = null;
// var adhaar_otp = $("#Aadhaar_otp").value;
var adhaar_otp = document.getElementById('adhaar_otp').value;
console.log("OTP", adhaar_otp);
function ajaxCallVerifyAadhaar(AadhaarNum) {
    $.ajax({
        // Our sample url to make request
        url: `${API_URL_9000}payOut/verifyAadhar`,
        // Type of Request
        type: "POST",
        data: { "aadharNumber": AadhaarNum },
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            response_adhaarDetail = response;
            console.log("Aadhaar response_adhaarDetail : ", response_adhaarDetail);
            console.log("Aadhaar OTP verify status : ", response.data.status);
            if (response.data.status == 'SUCCESS') {
                $("#successNumber_Aadhaar").html(response.data.message);
                console.log("Aadhaar OTP message : ", response.data.message);

                $("#adhaar_OTP_div").show();
                
                $('.js-timeout_Aadhaar').text("1:00");
                aadhaarOTPcountdown();
            }
            else {
                $("#adhaar_OTP_div").hide();
                $("#adhaar_otp").html("");
            }
        },
        error: function (error) {
            console.log(error);
            $("#errorNumber_Aadhaar").show();
            $("#errorNumber_Aadhaar").html(error.responseJSON.message);
            $("#adhaar_OTP_div").hide();
        }
    });
}
function ajaxCallVerifyAadhaarOTP() {
    let ref_id = response_adhaarDetail.data.ref_id;
    console.log("reference id", ref_id);
    if (document.getElementById("adhaar_otp").value.length === 6) {
        console.log("adhaar_otp.length === 6");
        $.ajax({
            // Our sample url to make request
            url: `${API_URL_9000}payOut/verifyAadharOtp`,
            // Type of Request
            type: "POST",
            data: {
                "otp": document.getElementById("adhaar_otp").value,
                "ref_id": ref_id
            },
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (response) {
                if (response.data.status == 'VALID') {
                    $('#otpsuccess_Aadhaar').html("Aadhaar Number Verified Succesfully...");
                    $("#uploadDoc_Aadhaar").show();
                    $("#adhaar_OTP_div").hide();
                }
            },
            error: function (error) {
                $("#otpError_Aadhaar").html(error.responseJSON.message);
            }
        });
    }
    else {
        $("#otpError_Aadhaar").html("Aadhaar number must be 6 digits long.");
    }
}
function ajaxCallUploadAadhaar() {
    var formDataAadhaar = new FormData();
    formDataAadhaar.append('docType', 'AADHAR');
    formDataAadhaar.append('docNumber', Aadhaar_Number);
    formDataAadhaar.append('documentFront', imgPathFront_Aadhaar);
    formDataAadhaar.append('documentBack', imgPathBack_Aadhaar);
    $.ajax({
        // Our sample url to make request
        url: `${API_URL_9000}driver/upload`,
        // Type of Request
        type: "POST",
        data: formDataAadhaar,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            if (response) {
                var AadhaarVerifySuccess = response.data.message;
                $("#successNumber_Aadhaar").html(AadhaarVerifySuccess);
                ajaxCallDocVerify();
            }
        },
        error: function (error) {
            $("#errorApi_Aadhaar").html(error.responseJSON.message);
        }
    });
}

/* :: RC Card :: */
// Image Upload Click Event :: RC Card upload

imgInputFront_RC.addEventListener('change', function (f) {
    console.log('imgInputFront_RC.addEventListener');
    if (f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/png'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpg')
    {
        uploader(f.currentTarget.files[f.currentTarget.files.length - 1], 'previewFront_RC');
        imgPathFront_RC = f.currentTarget.files[f.currentTarget.files.length - 1];
        console.log('imgPathFront_RC : ' + imgPathFront_RC);
        document.getElementById('errorFront_RC').style.display = 'none';
    } else {
        document.getElementById('errorFront_RC').style.display = 'block';
        $('#previewFront_RC').attr('src', 'images/front.png');
    }
})

imgInputBack_RC.addEventListener('change', function (f) {
    if (f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/png'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpg')
    {
        uploader(f.currentTarget.files[f.currentTarget.files.length - 1], 'previewBack_RC');
        imgPathBack_RC = f.currentTarget.files[f.currentTarget.files.length - 1];
        document.getElementById('errorBack_RC').style.display = 'none';
    } else {
        document.getElementById('errorBack_RC').style.display = 'block';
        $('#previewBack_RC').attr('src', 'images/back.png');
    }
})

var vehicleNumber = '';
var vehicleState = '';
var vehicleOwnership = '';
var vehicleColor = '';
var colorCode = '';
var vehicleModel = '';
var RC_form = document.getElementById('RCForm');
var colorTxt = '';
var colorData = null;
function validate_RC()
{
    // Reset error messages
    $(".errorText").text("");
    
    // Validate Vehicle Number
    vehicleNumber = $("#vehicle_number").val();
    if (vehicleNumber === "") {
        $("#errorNumber_RC").text("Please enter the vehicle number");
        $("#uploadDoc_RC").hide(); // Hide the uploadDoc_RC div
        return false;
    }
    else if(vehicleNumber.length >= 12 || vehicleNumber.length <= 8){
        $("#errorNumber_RC").text("Vehicle number must be a 12 digit");
    }
    
    // Validate Vehicle State
    vehicleState = $("#vehicle_state").val();
    if (vehicleState === "") {
        $("#errorvehicleState").text("Please enter the vehicle State");
        $("#uploadDoc_RC").hide(); // Hide the uploadDoc_RC div
        return false;
    }
    
    // Validate Vehicle Ownership
    vehicleOwnership = $('#vehicle_owner').val();
    if (vehicleOwnership === '') {
        $("#errorSelectOwnership").text("Please Select the vehicle ownership");
        $("#uploadDoc_RC").hide(); // Hide the uploadDoc_RC div
        return false;
    }
    
    // Validate Vehicle Color
    vehicleColor = $('#vehicle_color').val();
    if (vehicleColor === '') {
        $("#errorSelectColor").text("Please Select the vehicle color");
        $("#uploadDoc_RC").hide(); // Hide the uploadDoc_RC div
        return false;
    }
    else if (vehicleColor !== '') {
        $('#colorPallete').show();
        for(let i = 0 ; i <= colorData.length ; i++)
        {
            if( vehicleColor === colorData[i]?.color )
            {
                colorCode = colorData[i]?.colorCode ;
                document.getElementById('showColor').style.background = colorCode;
                console.log("vehicleColor", vehicleColor);
                console.log("colorCode", colorCode);
            }
        }
    }
    
    // Validate Vehicle Model Name
    vehicleModel = $("#vehicle_model_name").val()
    if (vehicleModel === "") {
        $("#errorVehicleModel").text("Please Select the vehicle ownership");
        $("#uploadDoc_RC").hide(); // Hide the uploadDoc_RC div
        return false;
    }
    
    $("#uploadDoc_RC").show(); // Show the uploadDoc_RC div
    return true;
}

// Form change event handlers
$("#vehicle_number, #vehicle_state, #vehicle_owner, #vehicle_color, #vehicle_model_name").on("change", function(){
    validate_RC();
});

function ajaxCallVehicleColorSelection() {
    $.ajax({
        url: `${API_URL_9000}splash/splashScreen`,
        method: "POST",
        data: { module: 'RC Colors' },
        headers: {
            'app_token': 'bKbumwUX1vs8FLr8',
            'version': 'V1'
        },
        success: function(response) {
            if(response){
                colorData = response.data;
                console.log("color data", colorData)
                var vehicleColor_li = `<option value="{__}">{__}</option>`;
                let list = '<option value="">Select Option</option>';
                for(let i=0 ; i< colorData.length ; i++){
                    list += vehicleColor_li.replaceAll('{__}',colorData[i].color);
                }
                document.getElementById('vehicle_color').innerHTML = list;
            }
        },
        error: function() {

        }
    });
}

function ajaxCallUploadRC() {
    // Perform submit action or additional validation if needed
    console.log("Selected vehicle Ownership : ", vehicleOwnership);
    console.log('vehicleColor', vehicleColor);

    // Example AJAX call
    var formDataRC = new FormData();
    formDataRC.append('docType', 'RC'),
    formDataRC.append('docNumber', vehicleNumber),
    formDataRC.append('status', 'pending'),
    formDataRC.append('state', vehicleState),
    formDataRC.append('ownerShip', vehicleOwnership),
    formDataRC.append('vehicleColor', vehicleColor),
    formDataRC.append('ColorCode', colorCode),
    formDataRC.append('vehicleModel', vehicleModel),
    formDataRC.append('documentFront', imgPathFront_RC),
    formDataRC.append('documentBack', imgPathBack_RC)
    $.ajax({
        // Our sample url to make request
        url: `${API_URL_9000}driver/upload`,
        // Type of Request
        type: "POST",
        data: formDataRC,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            ajaxCallDocVerify();
        },
        error: function (error) {
            $("#errorApi_RC").html(JSON.stringify(error.responseJSON.message));
        }
    });
}

/* :: User profile Script :: */
// let profilePicLabel = document.getElementById('profilePicLabel');
let form = document.getElementById('profileForm');
var firstNameInput = null;
var lastNameInput = null;
var addressInput = null;
var pinCodeInput = null;
var emailInput = null;
var cityInput = null;
var stateInput = null;
var dobInput = null;
var bloodGroupInput = null;
var genderInputs = document.getElementsByName('gender');
var genderCheckedValue = null;
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var isChecked = false;
function validateUserProfile(inputFieldId) {
    // Reset error messages
    let errorElement = document.getElementById(`${inputFieldId}Error`);
    console.log("errorElement : ", errorElement);
    console.log("inputFieldId : ", inputFieldId);
    if (errorElement) {
      errorElement.innerHTML = '';
    }
    // stateInput = document.getElementById(inputFieldId).value;
    
    let currentDate = new Date();
    // Validate based on input field ID
    switch (inputFieldId)
    {
    case 'firstName':
        console.log("inputFieldId : ", inputFieldId);
        firstNameInput = document.getElementById(inputFieldId).value;
    break;
    case 'lastName':
        console.log("inputFieldId : ", inputFieldId);
        lastNameInput = document.getElementById(inputFieldId).value;        
        if (firstNameInput == null) {
            document.getElementById("firstNameError").innerHTML = 'First name is required';
        }
    break;
    case 'userEmail':
        console.log("inputFieldId : ", inputFieldId);
        emailInput = document.getElementById(inputFieldId).value;
        if (firstNameInput == null) {
            document.getElementById("firstNameError").innerHTML = 'First name is required';
        }
        if (lastNameInput == null) {
            document.getElementById("lastNameError").innerHTML = 'Last name is required';
        }
    break;
    case 'address':
        console.log("inputFieldId : ", inputFieldId);
        addressInput = document.getElementById(inputFieldId).value;
        if (firstNameInput == null) {
            document.getElementById("firstNameError").innerHTML = 'First name is required';
        }
        if (lastNameInput == null) {
            document.getElementById("lastNameError").innerHTML = 'Last name is required';
        }
        if (!emailRegex.test(emailInput)) {
            document.getElementById("userEmailError").innerHTML = 'Invalid email address';
        }
    break;
    case 'pinCode':
        console.log("inputFieldId : ", inputFieldId);
        pinCodeInput = document.getElementById(inputFieldId).value;
        console.log("User Pincode: ", pinCodeInput);
        if (firstNameInput == null) {
            document.getElementById("firstNameError").innerHTML = 'First name is required';
        }
        if (lastNameInput == null) {
            document.getElementById("lastNameError").innerHTML = 'Last name is required';
        }
        if (!emailRegex.test(emailInput)) {
            document.getElementById("userEmailError").innerHTML = 'Invalid email address';
        }
        if (addressInput == null) {
            document.getElementById("addressError").innerHTML = 'Address is required';
        }
        if (pinCodeInput.length !== 6) {
            document.getElementById("pinCodeError").innerHTML = 'Pin code must be a 6-digit number';
        } else {
            ajaxCallPincode();
        }
    break;
    case 'userCity':
        console.log("inputFieldId : ", inputFieldId);
        cityInput = document.getElementById("userCity").value;
        if (firstNameInput == null) {
            document.getElementById("firstNameError").innerHTML = 'First name is required';
        }
        if (lastNameInput == null) {
            document.getElementById("lastNameError").innerHTML = 'Last name is required';
        }
        if (!emailRegex.test(emailInput)) {
            document.getElementById("userEmailError").innerHTML = 'Invalid email address';
        }
        if (addressInput == null) {
            document.getElementById("addressError").innerHTML = 'Address is required';
        }
        if (pinCodeInput.length !== 6) {
            document.getElementById("pinCodeError").innerHTML = 'Pin code must be a 6-digit number';
        } else {
            ajaxCallPincode();
        }
        if (cityInput == null) {
            document.getElementById("userCityError").innerHTML = 'City is required';
        }
    break;
    case 'state':
        cityInput = document.getElementById("userCity").value;
        stateInput = document.getElementById("state").value;
        console.log("inputFieldId : ", inputFieldId);
        if (firstNameInput == null) {
            document.getElementById("firstNameError").innerHTML = 'First name is required';
        }
        if (lastNameInput == null) {
            document.getElementById("lastNameError").innerHTML = 'Last name is required';
        }
        if (!emailRegex.test(emailInput)) {
            document.getElementById("userEmailError").innerHTML = 'Invalid email address';
        }
        if (addressInput == null) {
            document.getElementById("addressError").innerHTML = 'Address is required';
        }
        if (pinCodeInput.length !== 6) {
            document.getElementById("pinCodeError").innerHTML = 'Pin code must be a 6-digit number';
        } else {
            ajaxCallPincode();
        }
        if (cityInput == null) {
            document.getElementById("userCityError").innerHTML = 'City is required';
        }
        if (stateInput == null) {
            document.getElementById("stateError").innerHTML = 'State is required';
        }
    break;
    case 'bloodGroup':
        console.log("inputFieldId : ", inputFieldId);
        cityInput = document.getElementById("userCity").value;
        stateInput = document.getElementById("state").value;
        bloodGroupInput = document.getElementById(inputFieldId).value;
        if (firstNameInput == null) {
            document.getElementById("firstNameError").innerHTML = 'First name is required';
        }
        if (lastNameInput == null) {
            document.getElementById("lastNameError").innerHTML = 'Last name is required';
        }
        if (!emailRegex.test(emailInput)) {
            document.getElementById("userEmailError").innerHTML = 'Invalid email address';
        }
        if (addressInput == null) {
            document.getElementById("addressError").innerHTML = 'Address is required';
        }
        if (pinCodeInput.length !== 6) {
            document.getElementById("pinCodeError").innerHTML = 'Pin code must be a 6-digit number';
        } else {
            ajaxCallPincode();
        }
        if (cityInput == null) {
            document.getElementById("userCityError").innerHTML = 'City is required';
        }
        if (stateInput == null) {
            document.getElementById("stateError").innerHTML = 'State is required';
        }
    break;
    case 'dob':
        console.log("inputFieldId : ", inputFieldId);
        cityInput = document.getElementById("userCity").value;
        stateInput = document.getElementById("state").value;
        dobInput = document.getElementById(inputFieldId).value;
        var splitedDate = new Date(dobInput).toISOString().split('T')[0];
        var day = splitedDate.split('-')[2]
        var month = splitedDate.split('-')[1]
        var year = splitedDate.split('-')[0]
        dobInput = day + '-' + month + '-' + year;
        console.log("selectedDate",dobInput)
        if (firstNameInput == null) {
            document.getElementById("firstNameError").innerHTML = 'First name is required';
        }
        if (lastNameInput == null) {
            document.getElementById("lastNameError").innerHTML = 'Last name is required';
        }
        if (!emailRegex.test(emailInput)) {
            document.getElementById("userEmailError").innerHTML = 'Invalid email address';
        }
        if (addressInput == null) {
            document.getElementById("addressError").innerHTML = 'Address is required';
        }
        if (pinCodeInput.length !== 6) {
            document.getElementById("pinCodeError").innerHTML = 'Pin code must be a 6-digit number';
        } else {
            ajaxCallPincode();
        }
        if (cityInput == null) {
            document.getElementById("userCityError").innerHTML = 'City is required';
        }
        if (stateInput == null) {
            document.getElementById("stateError").innerHTML = 'State is required';
        }
        if (bloodGroupInput === '') {
            document.getElementById("bloodGroupError").innerHTML = 'Blood group is required';
        }
    break;
    case 'gender':
        console.log("inputFieldId : ", inputFieldId);
        cityInput = document.getElementById("userCity").value;
        stateInput = document.getElementById("state").value;
        console.log("genderInputs", genderInputs);
        console.log("genderInputs.length", genderInputs.length);

        if (firstNameInput == null) {
            document.getElementById("firstNameError").innerHTML = 'First name is required';
        }
        if (lastNameInput == null) {
            document.getElementById("lastNameError").innerHTML = 'Last name is required';
        }
        if (!emailRegex.test(emailInput)) {
            document.getElementById("userEmailError").innerHTML = 'Invalid email address';
        }
        if (addressInput == null) {
            document.getElementById("addressError").innerHTML = 'Address is required';
        }
        if (pinCodeInput.length !== 6) {
            document.getElementById("pinCodeError").innerHTML = 'Pin code must be a 6-digit number';
        } else {
            ajaxCallPincode();
        }
        if (cityInput == null) {
            document.getElementById("userCityError").innerHTML = 'City is required';
        }
        if (stateInput == null) {
            document.getElementById("stateError").innerHTML = 'State is required';
        }
        if (bloodGroupInput === '') {
            document.getElementById("bloodGroupError").innerHTML = 'Blood group is required';
        }
        if (selectedDate > currentDate || selectedDate === '' || selectedDate === null) {
            document.getElementById("dobError").innerHTML = 'Date of birth is rquired';
        }
        break;
        // case 'profile':
        //     profilePicInput = document.getElementById(inputFieldId);
        //     if (!profilePicInput.files[0]) {
        //         document.getElementById('profilePicError').innerHTML = 'Profile picture is required';
        //     } else {
        //         // Display selected profile picture
        //         const fileReader = new FileReader();
        //         fileReader.onload = function(e) {
        //             profilePicPreview.src = e.target.result;
        //         };
        //         fileReader.readAsDataURL(profilePicInput.files[0]);
        //     }
        // break;
    default:
    break;
    }
}

// Show selected file name in the file input field
// let profilePicInput = document.getElementById('profilePic');
// profilePicInput.addEventListener('change', function() {
//     let file = profilePicInput.files[0];
//     if (file) {
//         // profilePicLabel.querySelector('span').textContent = file.name;
//     } else {
//         profilePicLabel.querySelector('span').textContent = 'Choose File';
//     }
// });

// Add event listeners for input fields
let inputFields = form.querySelectorAll('input, select');
console.log("All input fileds", inputFields);
for (let i = 0; i < inputFields.length; i++)
{
    let inputField = inputFields[i];
    inputField.addEventListener('change', function () {
        validateUserProfile(inputField.id);
    });
}

function ajaxCallPincode() {
    console.log("User Pincode : ", pinCodeInput);
    $.ajax({
        url: `${API_URL_4000}courier-metro/getCityStateByPincode/${pinCodeInput}`,
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (data, status, xhttp) {
            if (data) {
                console.log("User Pincode : ", pinCodeInput);
                console.log("DATA : " + data);
                var dataCity = data.city;
                console.log("dataCity : ", dataCity);
                var dataState = data.state;
                console.log("dataState : ", dataState);
                
                $('#userCity').val(dataCity);
                $('#state').val(dataState);
            }
        },
        error: function (error) {
            $("#genderError").html(error.responseJSON.message);
        }
    });
}
function ajaxCallUpdateProfile() {
    for (let i = 0; i < genderInputs.length; i++) {
        console.log("genderInputs", genderInputs);
        console.log("INSIDE FOR");
        if (genderInputs[i].checked) {
            console.log("INSIDE genderInputs[i].checked");
            isChecked = true;
            genderCheckedValue = genderInputs[i].value;
            console.log("genderCheckedValue", genderCheckedValue);
        }
        else if (!isChecked) {
            $("#genderError").html('Gender is required');
        }
    }
        
    $.ajax({
        url: `${API_URL_9000}driver/update-profile`,
        type: "POST",
        data: {
            "FirstName": firstNameInput,
            "LastName": lastNameInput,
            "email": emailInput,
            "gender": genderCheckedValue,
            "bloodGroup": bloodGroupInput,
            "dateOfBirth": dobInput,
            "pincode": pinCodeInput,
            "state": stateInput,
            "city": cityInput,
            "address": addressInput
        },
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (data, status, xhttp){
            console.log("gender", genderCheckedValue);
            console.log("dateofBirth", dobInput);
            ajaxCallDocVerify();
        },
        error: function (error) {
            console.log("ERROR");
            $("#genderError").html(error.responseJSON.message);
        }
    });
}

/* :: Quiz :: */
var lessonData;
var lessonNumber;
function ajaxCallGetAllLessons() {
    $.ajax({
        url: `${API_URL_9000}quiz/all-lessons`,
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response, status, xhttp) {
            data = JSON.stringify(response.data);
            // console.log("Data : ", data);

            lessonData = JSON.parse(data);
            console.log("All Lesson Data : ", lessonData);

            var totalLesson = lessonData.length;
            console.log("TotalLesson : ", totalLesson)
            
            $('#total_lesson').html(totalLesson);

            var totalDuration = 0;
            for (let i = 0; i < lessonData.length; i++) {
                var durationInSeconds = parseInt(lessonData[i].duration);
              totalDuration += durationInSeconds;
            }
            
            var totalDurationInMinutes = totalDuration / 60;
            $('#total_lesson_duration').html(totalDurationInMinutes);
            
            var leslist = '';
            var lessonList = `<div class="lesson-li">
                                <div class="llist">
                                    <h5 id="srNo">{__srNo__}</h5>
                                    <div class="lesson-title-duration">
                                        <div class="">
                                            <p id="lesson_title">{__lesson_title__}</p>
                                            <small>Duration: <span id="lesson_duration">{__time__}</span> min</small>
                                        </div>
                                        <div class="video-btn" data-toggle="modal" data-src="{__video_url__}" data-target="#myModal">
                                            <img src="images/mp4.png" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div id="quizDiv" style="display: none;" onclick="ajaxCallLoadQuiz({lessonNumber});">
                                    <div class="d-flex justify-content-start align-items-center">
                                        <img src="images/quiz.png" alt="">
                                        <small>Quiz</small>
                                    </div>
                                </div>
                            </div>`;

            for(let i = 0 ; i < lessonData.length; i++) {
                lessonList;
                if(lessonData[i].isQuiz){
                    leslist += lessonList.replace("{__srNo__}",lessonData[i]?.lessonNumber)
                    ?.replace("{__lesson_title__}",lessonData[i]?.videoName)
                    ?.replace("{__time__}",(lessonData[i]?.duration/60).toFixed(0))
                    ?.replace("{__video_url__}",lessonData[i]?.videoUrl)
                    ?.replace("display: none;","display: block;")
                    ?.replace("{lessonNumber}",lessonData[i]?.lessonNumber);
                }
                else{
                    leslist += lessonList.replace("{__srNo__}",lessonData[i]?.lessonNumber)
                    ?.replace("{__lesson_title__}",lessonData[i]?.videoName)
                    ?.replace("{__time__}",(lessonData[i]?.duration/60).toFixed(0))
                    ?.replace("{__video_url__}",lessonData[i]?.videoUrl)
                    ?.replace("display: none;","display: none;")
                    ?.replace("{lessonNumber}",lessonData[i]?.lessonNumber);
                }
                console.log("lessonNumber - ", lessonData[i]?.lessonNumber);
                console.log("videoName - ", lessonData[i]?.videoName);
                console.log("duration - ", lessonData[i]?.duration);
                console.log("videoUrl - ", lessonData[i]?.videoUrl);
            }
            document.getElementById('lesson').innerHTML = leslist;

            var $videoSrc;
            $('.video-btn').click(function () {
                $videoSrc = $(this).data("src");
            });
            // when the modal is opened autoplay it
            $('#myModal').on('shown.bs.modal', function (e) { // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
                $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
            })
            // stop playing the youtube video when I close the modal
            $('#myModal').on('hide.bs.modal', function (e) { // a poor man's stop video
                $("#video").attr('src', $videoSrc);
            })

            var iframe = document.getElementById('video');
            $('.video-btn').click(function () {
                // Wait for the iframe to load
                iframe.onload(function() {
                    console.log("INSIDE iframe.onload");
                    var iframeContentWindow = iframe.contentWindow;

                    // Check if the iframe is loaded and its content is accessible
                    if (iframeContentWindow && iframeContentWindow.document) {
                        // Access the video element inside the iframe's content
                        var videoElement = iframeContentWindow.document.querySelector('video');

                        if (videoElement) {
                        // Listen for the 'ended' event on the video
                                videoElement.addEventListener('ended', function() {
                                    // Video has ended, perform the redirect action
                                    redirectToDiv();
                                });
                        }
                        else {
                            console.log('No video element found inside the iframe.');
                        }
                    }
                    else {
                        console.log('Failed to access iframe content.');
                    }
                });
            });
              
            function redirectToDiv() {
                // Hide the iframe
                iframe = document.getElementById('video');
                var closeBtn = document.getElementById('close');
                iframe.style.display = 'none';

                // Show the redirect div
                // var redirectDiv = document.getElementById('redirectDiv');
                // redirectDiv.style.display = 'block';
            }
        },
        error: function (error) {
            // $("#genderError").html(error.responseJSON.message);
        }
    });
}

var $progressValue = 0;
var resultList = [];
const quizdata = [{
    question: "Characterized by skill at understanding and profiting by circumstances",
    options: ["Prescient", "Analyst", "Diminution", "Shrewd"],
    answer: "Shrewd",
    category: 1
},
{
    question: "To refuse to acknowledge as one's own or as connected with oneself",
    options: ["Prevalent", "Disown", "Squalid", "Employee"],
    answer: "Disown",
    category: 2
},
{
    question: "Not having the abilities desired or necessary for any purpose",
    options: ["Incompetent", "Impoverish", "Coxswain", "Devious"],
    answer: "Incompetent",
    category: 3
},
{
    question: "Lizard that changes color in different situations",
    options: ["Scruple", "Depredation", "Chameleon", "Whimsical"],
    answer: "Chameleon",
    category: 1
},
{
    question: "Having the title of an office without the obligations",
    options: ["Reciprocal", "Unsullied", "Titular", "Inflated"],
    answer: "Titular",
    category: 2
},
{
    question: "An expression of disapproval or blame personally addressed to one censured",
    options: ["Pitiful", "Reproof", "Mutation", "Raillery"],
    answer: "Reproof",
    category: 3
},
{
    question: "To deliver an elaborate or formal public speech.",
    options: ["Orate", "Magician", "Access", "Guzzle"],
    answer: "Orate",
    category: 2
},
{
    question: "A wharf or artificial landing-place on the shore of a harbor or projecting into it",
    options: ["Intolerable", "Quay", "Fez", "Insatiable"],
    answer: "Quay",
    category: 3
},
{
    question: "Friendly counsel given by way of warning and implying caution or reproof",
    options: ["Credence", "Colloquy", "Abyss", "Monition"],
    answer: "Monition",
    category: 1
},
{
    question: "To make a beginning in some occupation or scheme",
    options: ["Muster", "Embark", "Ocular", "Apprehensible"],
    answer: "Ocular",
    category: 2
},
{
    question: "Able to reinforce sound by sympathetic vibrations",
    options: ["Resonance", "Clandestine", "Diffusion", "Quietus"],
    answer: "Resonance",
    category: 3
},
{
    question: "To send off or consign, as to an obscure position or remote destination",
    options: ["Monolith", "Endurable", "Efficient", "Relegate"],
    answer: "Relegate",
    category: 1
}
];

function ajaxCallLoadQuiz(lessonNumber) {
    toggleVisibility('quiz');
    console.log("lessonNumber", lessonNumber);
    $.ajax({
        // Our sample url to make request
        url: `${API_URL_9000}quiz/ques`,
        // Type of Request
        type: "POST",
        data: {
            "lessonNumber": lessonNumber
        },
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            // quizdata = response.data;
            console.log("quizdata : ", quizdata);
            
        },
        error: function (error) {
            console.log(error);
        }
    });
}



/*** Return question ***/
function generateQuestions() {
    var questions = quizdata;
    return questions;
}

/*** Return list of options ***/
function returnOptionList(opts, i) {
    var optionHtml = '<li class="myoptions">' +
        '<input value="' + opts + '" name="optRdBtn" type="radio" id="rd_' + i + '">' +
        '<label for="rd_' + i + '">' + opts + '</label>' +
        '<div class="bullet">' +
        '<div class="line zero"></div>' +
        '<div class="line one"></div>' +
        '<div class="line two"></div>' +
        '<div class="line three"></div>' +
        '<div class="line four"></div>' +
        '<div class="line five"></div>' +
        '<div class="line six"></div>' +
        '<div class="line seven"></div>' +
        '</div>' +
        '</li>';
    return optionHtml;
}

/** Render Options **/
function renderOptions(optionList) {
    var ulContainer = $('<ul>').attr('id', 'optionList');
    for (var i = 0, len = optionList.length; i < len; i++) {
        var optionContainer = returnOptionList(optionList[i], i);
        ulContainer.append(optionContainer);
    }
    $(".answerOptions").html('').append(ulContainer);
}

/** Render question **/
function renderQuestion(question) {
    $(".question").html("<h1>" + question + "</h1>");
}

/** Render quiz :: Question and option **/
function renderQuiz(questions, index) {
    var currentQuest = questions[index];
    renderQuestion(currentQuest.question);
    renderOptions(currentQuest.options);
    console.log("Question");
    console.log(questions[index]);
}

/** Return correct answer of a question ***/
// function getCorrectAnswer(questions, index) {
//     return questions[index].answer;
// }

// /** pushanswers in array **/
// function correctAnswerArray(resultByCat) {
//     var arrayForChart = [];
//     for (var i = 0; i < resultByCat.length; i++) {
//         arrayForChart.push(resultByCat[i].correctanswer);
//     }
//     return arrayForChart;
// }
// /** Generate array for percentage calculation **/
// function genResultArray(results, wrong) {
//     var resultByCat = resultByCategory(results);
//     var arrayForChart = correctAnswerArray(resultByCat);
//     arrayForChart.push(wrong);
//     return arrayForChart
// }

// /** percentage Calculation **/
// function percentCalculation(array, total) {
//     var percent = array.map(function (d, i) {
//         return (100 * d / total).toFixed(2);
//     });
//     return percent;
// }

/*** Get percentage for chart **/
// function getPercentage(resultByCat, wrong) {
//     var totalNumber = resultList.length;
//     var wrongAnwer = wrong;
//     var arrayForChart = genResultArray(resultByCat, wrong);
//     return percentCalculation(arrayForChart, totalNumber);
// }

/** count right and wrong answer number **/
// function countAnswers(results) {

//     var countCorrect = 0, countWrong = 0;

//     for (var i = 0; i < results.length; i++) {
//         if (results[i].iscorrect == true)
//             countCorrect++;
//         else countWrong++;
//     }

//     return [countCorrect, countWrong];
// }

/**** Categorize result *****/
// function resultByCategory(results) {

//     var categoryCount = [];
//     var ctArray = results.reduce(function (res, value) {
//         if (!res[value.category]) {
//             res[value.category] = {
//                 category: value.category,
//                 correctanswer: 0
//             };
//             categoryCount.push(res[value.category])
//         }
//         var val = (value.iscorrect == true) ? 1 : 0;
//         res[value.category].correctanswer += val;
//         return res;
//     }, {});

//     categoryCount.sort(function (a, b) {
//         return a.category - b.category;
//     });

//     return categoryCount;
// }

/** Total score pie chart**/
// function totalPieChart(_upto, _cir_progress_id, _correct, _incorrect) {

//     $("#" + _cir_progress_id).find("._text_incor").html("Incorrect : " + _incorrect);
//     $("#" + _cir_progress_id).find("._text_cor").html("Correct : " + _correct);

//     var unchnagedPer = _upto;

//     _upto = (_upto > 100) ? 100 : ((_upto < 0) ? 0 : _upto);

//     var _progress = 0;

//     var _cir_progress = $("#" + _cir_progress_id).find("._cir_P_y");
//     var _text_percentage = $("#" + _cir_progress_id).find("._cir_Per");

//     var _input_percentage;
//     var _percentage;

//     var _sleep = setInterval(_animateCircle, 25);

//     function _animateCircle() {
//         //2*pi*r == 753.6 +xxx=764
//         _input_percentage = (_upto / 100) * 764;
//         _percentage = (_progress / 100) * 764;

//         _text_percentage.html(_progress + '%');

//         if (_percentage >= _input_percentage) {
//             _text_percentage.html('<tspan x="50%" dy="0em">' + unchnagedPer + '% </tspan><tspan  x="50%" dy="1.9em">Your Score</tspan>');
//             clearInterval(_sleep);
//         } else {

//             _progress++;

//             _cir_progress.attr("stroke-dasharray", _percentage + ',764');
//         }
//     }
// }

// function renderBriefChart(correct, total, incorrect) {
//     var percent = (100 * correct / total);
//     if (Math.round(percent) !== percent) {
//         percent = percent.toFixed(2);
//     }

//     totalPieChart(percent, '_cir_progress', correct, incorrect)

// }

/*** render chart for result **/
// function renderChart(data) {
//     var ctx = document.getElementById("myChart");
//     var myChart = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             labels: ["Verbal communication",
//                 "Non-verbal communication",
//                 "Written communication",
//                 "Incorrect"
//             ],
//             datasets: [
//                 {

//                     data: data,
//                     backgroundColor: ['#e6ded4',
//                         '#968089',
//                         '#e3c3d4',
//                         '#ab4e6b'
//                     ],
//                     borderColor: ['rgba(239, 239, 81, 1)',
//                         '#8e3407',
//                         'rgba((239, 239, 81, 1)',
//                         '#000000'
//                     ],
//                     borderWidth: 1
//                 }
//             ]
//         },
//         options: {
//             pieceLabel: {
//                 render: 'percentage',
//                 fontColor: 'black',
//                 precision: 2
//             }
//         }

//     });
// }

/** List question and your answer and correct answer  

*****/
// function getAllAnswer(results) {
//     var innerhtml = "";
//     for (var i = 0; i < results.length; i++) {
//         var _class = ((results[i].iscorrect) ? "item-correct" : "item-incorrect");
//         var _classH = ((results[i].iscorrect) ? "h-correct" : "h-incorrect");
//         var _html = '<div class="_resultboard ' + _class + '">' +
//             '<div class="_header">' + results[i].question + '</div>' +
//             '<div class="_yourans ' + _classH + '">' + results[i].clicked + '</div>';
//         var html = "";
//         if (!results[i].iscorrect)
//             html = '<div class="_correct">' + results[i].answer + '</div>';
//         _html = (_html + html) + '</div>';
//         innerhtml += _html;
//     }

//     $(".allAnswerBox").html('').append(innerhtml);
// }
/** render  Brief Result **/
// function renderResult(resultList) {

//     var results = resultList;
//     console.log(results);
//     var countCorrect = countAnswers(results)[0],
//         countWrong = countAnswers(results)[1];

//     renderBriefChart(countCorrect, resultList.length, countWrong);
// }

// function renderChartResult() {
//     var results = resultList;
//     var countCorrect = countAnswers(results)[0],
//         countWrong = countAnswers(results)[1];
//     var dataForChart = genResultArray(resultList, countWrong);
//     renderChart(dataForChart);
// }

function ajaxCallLoadUpdateUserLesson(lessonNumber) {
    
    // toggleVisibility('quiz');

    console.log("lessonNumber", lessonNumber);
    $.ajax({
        // Our sample url to make request
        url: `${API_URL_9000}quiz/updateUserLesson/${lessonNumber}`,
        // Type of Request
        type: "POST",
        data: {
            "lessonNumber": lessonNumber
        },
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            // response_adhaarDetail = response;
            // console.log("Aadhaar response_adhaarDetail : ", response_adhaarDetail);
            // console.log("Aadhaar OTP verify status : ", response.data.status);
            // if (response.data.status == 'SUCCESS') {
            //     $("#successNumber_Aadhaar").html(response.data.message);
            //     console.log("Aadhaar OTP message : ", response.data.message);

            //     $("#adhaar_OTP_div").show();
                
            //     $('.js-timeout_Aadhaar').text("1:00");
            //     aadhaarOTPcountdown();
            // }
            // else {
            //     $("#adhaar_OTP_div").hide();
            //     $("#adhaar_otp").html("");
            // }
        },
        error: function (error) {
            // console.log(error);
            // $("#errorNumber_Aadhaar").show();
            // $("#errorNumber_Aadhaar").html(error.responseJSON.message);
            // $("#adhaar_OTP_div").hide();
        }
    });
}
/** Insert progress bar in html **/
function getProgressindicator(length) {
    var progressbarhtml = " ";
    for (var i = 0; i < length; i++) {
        progressbarhtml += '<div class="my-progress-indicator progress_' + (i + 1) + ' ' + ((i == 0) ? "active" : "") + '"></div>';
    }
    $(progressbarhtml).insertAfter(".my-progress-bar");
}

/*** change progress bar when next button is clicked ***/
function changeProgressValue() {
    $progressValue += 9;
    if ($progressValue >= 100) {

    } else {
        if ($progressValue == 99) $progressValue = 100;
        $('.my-progress')
            .find('.my-progress-indicator.active')
            .next('.my-progress-indicator')
            .addClass('active');
        $('progress').val($progressValue);
    }
    $('.js-my-progress-completion').html($('progress').val() + '% complete');

}
function addClickedAnswerToResult(questions, presentIndex, clicked) {
    var correct = getCorrectAnswer(questions, presentIndex);
    var result = {
        index: presentIndex,
        question: questions[presentIndex].question,
        clicked: clicked,
        iscorrect: (clicked == correct) ? true : false,
        answer: correct,
        category: questions[presentIndex].category
    }
    resultList.push(result);

    console.log("result");
    console.log(result);
}

$(document).ready(function () {

    var presentIndex = 0;
    var clicked = 0;

    var questions = generateQuestions();
    renderQuiz(questions, presentIndex);
    getProgressindicator(questions.length);

    $(".answerOptions ").on('click', '.myoptions>input', function (e) {
        clicked = $(this).val();

        if (questions.length == (presentIndex + 1)) {
            $("#submit").removeClass('hidden');
            $("#next").addClass("hidden");
        }
        else {
            $("#next").removeClass("hidden");
        }
    });

    $("#next").on('click', function (e) {
        e.preventDefault();
        addClickedAnswerToResult(questions, presentIndex, clicked);

        $(this).addClass("hidden");

        presentIndex++;
        renderQuiz(questions, presentIndex);
        changeProgressValue();
    });

    $("#submit").on('click', function (e) {
        addClickedAnswerToResult(questions, presentIndex, clicked);
        $('.multipleChoiceQues').hide();
        // $(".resultArea").show();
        renderResult(resultList);

    });

    // $(".resultArea").on('click', '.viewchart', function () {
    //     $(".resultPage2").show();
    //     $(".resultPage1").hide();
    //     $(".resultPage3").hide();
    //     renderChartResult();
    // });

    // $(".resultArea").on('click', '.backBtn', function () {
    //     $(".resultPage1").show();
    //     $(".resultPage2").hide();
    //     $(".resultPage3").hide();
    //     renderResult(resultList);
    // });

    // $(".resultArea").on('click', '.viewanswer', function () {
    //     $(".resultPage3").show();
    //     $(".resultPage2").hide();
    //     $(".resultPage1").hide();
    //     getAllAnswer(resultList);
    // });

    // $(".resultArea").on('click', '.replay', function () {
    //     window.location.reload(true);
    // });

});





/* :: Payment Mode :: */

// Show the first tab by default
$('.tabs-stage div').hide();
$('.tabs-stage div:first').show();
$('.tabs-nav li:first').addClass('tab-active');

// Change tab class and display content
$('.tabs-nav a').on('click', function (event) {
    event.preventDefault();
    $('.tabs-nav li').removeClass('tab-active');
    $(this).parent().addClass('tab-active');
    $('.tabs-stage div').hide();
    $($(this).attr('href')).show();
});