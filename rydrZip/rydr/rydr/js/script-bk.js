var divs = ["driver_mobile_number", "driver_get_otp", "success", "choose_city", "choose_vehicle",
    "verify_documents", "PAN", "Aadhaar", "DrivingLicenseVerify", "VehicleRC", "CaptainTraining",
    "Profile", "training_success", "AddBankDetails"];
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
        } else {
            div.style.display = "none";   // hide
        }
    }
}
/* :: Check weather city is already mentioned or not :: */
var cityData = "";
function checkCity() {
    console.log('cityData ' + cityData); // uncomment
    var response = JSON.parse(cityData); // uncomment
    console.log('RESPONSE ' + response); // uncomment
    var userCity = response.data.user.cityName; // uncomment
    console.log("userCity : " + userCity); // uncomment
    // var userCity = "Delhi NCR" // comment
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
    let i;
    var text = `<option value="select">Select City</option>`;
    console.log(res);
    console.log(res.data);
    for (i = 0; i < res.data.length; i++) {
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
                console.log("verify doc response data" + responseVerifyDoc);
                var responseData = JSON.parse(responseVerifyDoc);
                console.log("responseData : " + responseData);
                var documentList = responseData.data;

                console.log("DocName: " + documentList);
                toggleVisibility('verify_documents');
                var document_LI = `<li class="d-flex justify-content-between align-items-center" onclick="toggleVisibility('{DIV}');">
                                        <div class="w-100">
                                            <p>DOC_NAME</p>
                                            <small style="display:none" id="verify_txt">Under Verification...</small>
                                        </div>
                                        <img src="IMAGE" alt="">
                                    </li>`;
                let list = "";
                for (let i = 0; i < documentList.length; i++) {
                    console.log(documentList[i]);
                    document_LI;
                    console.log("documentList[i].docName : " + documentList[i].docName);
                    console.log("documentList[i].navigaton : " + documentList[i].navigation);
                    if (documentList[i].status == "complete" || documentList[i].status == "verified") {
                        list += document_LI.replace('DOC_NAME', documentList[i].docName).replace('IMAGE', 'images/complete.png').replace('{DIV}', documentList[i].navigation);
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
let imgInputFront_DL = document.getElementById('imgUploadFront_DL');
let imgInputBack_DL = document.getElementById('imgUploadBack_DL');
var imgPathFront_DL = null;
var imgPathBack_DL = null;
function getDLuploadedFrontImage(input) {
    let reader = new FileReader();
    reader.onload = function (e) {
        $('#previewFront_DL').attr('src', e.target.result);
    }
    reader.readAsDataURL(input);
}
imgInputFront_DL.addEventListener('change', function (e) {
    if (e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/png'
        || e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/jpg') {
        getDLuploadedFrontImage(e.currentTarget.files[e.currentTarget.files.length - 1]);
        imgPathFront_DL = e.currentTarget.files[e.currentTarget.files.length - 1];
        document.getElementById('errorFront_DL').style.display = 'none';
    } else {
        document.getElementById('errorFront_DL').style.display = 'block';
        $('#previewFront_DL').attr('src', 'images/front.png');
    }
})

function getDLuploadedBackImage(input) {
    let reader = new FileReader();
    reader.onload = function (e) {
        $('#previewBack_DL').attr('src', e.target.result);
    }
    reader.readAsDataURL(input);
}
imgInputBack_DL.addEventListener('change', function (e) {
    if (e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/png'
        || e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || e.currentTarget.files[e.currentTarget.files.length - 1]?.type == 'image/jpg') {
        getDLuploadedBackImage(e.currentTarget.files[e.currentTarget.files.length - 1]);
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
            toggleVisibility('verify_documents');
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
let imgInputFront_PAN = document.getElementById('imgUploadFront_PAN');
let imgInputBack_PAN = document.getElementById('imgUploadBack_PAN');
var imgPathFront_PAN = null;
var imgPathBack_PAN = null;
function getPANuploadedFrontImage(input) {
    let reader = new FileReader();
    reader.onload = function (f) {
        $('#previewFront_PAN').attr('src', f.target.result);

    }
    reader.readAsDataURL(input);
}

imgInputFront_PAN.addEventListener('change', function (f) {
    console.log('imgInputFront_PAN.addEventListener');
    if (f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/png'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpg') {
        getPANuploadedFrontImage(f.currentTarget.files[f.currentTarget.files.length - 1]);
        imgPathFront_PAN = f.currentTarget.files[f.currentTarget.files.length - 1];
        console.log('imgPathFront_PAN : ' + imgPathFront_PAN);
        document.getElementById('errorFront_PAN').style.display = 'none';
    } else {
        document.getElementById('errorFront_PAN').style.display = 'block';
        $('#previewFront_PAN').attr('src', 'images/front.png');
    }
})
function getPANuploadedBackImage(input) {
    let reader = new FileReader();
    reader.onload = function (f) {
        $('#previewBack_PAN').attr('src', f.target.result);
    }
    reader.readAsDataURL(input);
}
imgInputBack_PAN.addEventListener('change', function (f) {
    if (f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/png'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpeg'
        || f.currentTarget.files[f.currentTarget.files.length - 1]?.type == 'image/jpg') {
        getPANuploadedBackImage(f.currentTarget.files[f.currentTarget.files.length - 1]);
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
    $("#errorNumber_PAN").focus();
    let regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    var y = regex.test(PAN_Number);
    if (y) {
        console.log("PAN_Number === true");
        $("#errorNumber_PAN").html("");
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
                $("#successNumber_PAN").html(JSON.stringify(responseData_P.data.message));
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
            toggleVisibility('verify_documents');
        },
        error: function (error) {
            $("#errorApi_PAN").html(JSON.stringify(error.responseJSON.message));
        }
    });
}






/* :: User profile Script :: */

/* UPLOAD USER PROFILE PIC */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function () {
    readURL(this);
});

/* :: Quiz :: */

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
function getCorrectAnswer(questions, index) {
    return questions[index].answer;
}

/** pushanswers in array **/
function correctAnswerArray(resultByCat) {
    var arrayForChart = [];
    for (var i = 0; i < resultByCat.length; i++) {
        arrayForChart.push(resultByCat[i].correctanswer);
    }
    return arrayForChart;
}
/** Generate array for percentage calculation **/
function genResultArray(results, wrong) {
    var resultByCat = resultByCategory(results);
    var arrayForChart = correctAnswerArray(resultByCat);
    arrayForChart.push(wrong);
    return arrayForChart
}

/** percentage Calculation **/
function percentCalculation(array, total) {
    var percent = array.map(function (d, i) {
        return (100 * d / total).toFixed(2);
    });
    return percent;
}

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


