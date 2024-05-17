
/* UPLOAD USER PROFILE PIC */
let form = document.getElementById('profileForm');
// let submitButton = document.getElementById('submitButton');
// let profilePicPreview = document.getElementById('profilePicPreview');
let profilePicLabel = document.getElementById('profilePicLabel');

var firstNameInput = null;
var lastNameInput = null;
var addressInput = null;
var pinCodeInput = null;
var emailInput = null;
var cityInput = null;
var stateInput = null;
var dobInput = null;
var bloodGroupInput = null;
var genderInputs = null;
var genderCheckedValue = null;
function validateUserProfile() {
    // Reset error messages
    let errorElements = document.getElementsByClassName('errorText');
    for (let i = 0; i < errorElements.length; i++) {
        errorElements[i].textContent = '';
    }

    // Validate first name
    firstNameInput = document.getElementById('firstName').value;
    if (firstNameInput.trim() === '') {
        document.getElementById('firstNameError').textContent = 'First name is required';
    }

    // Validate last name
    lastNameInput = document.getElementById('lastName').value;
    if (lastNameInput.trim() === '') {
        document.getElementById('lastNameError').textContent = 'Last name is required';
    }

    // Validate address
    addressInput = document.getElementById('address').value;
    if (addressInput.trim() === '') {
        document.getElementById('addressError').textContent = 'Address is required';
    }

    // Validate email
    emailInput = document.getElementById('userEmail').value;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
        document.getElementById('emailError').textContent = 'Invalid email address';
    }

    // Validate pin code

    pinCodeInput = document.getElementById('pinCode').value;
    console.log("User Pincode : ", pinCodeInput);
    if (pinCodeInput.length == 6) {
        ajaxCallPincode();
    }else{
        document.getElementById('pinCodeError').textContent = 'Pin code must be a 6-digit number';
    }

    // Validate city
    cityInput = document.getElementById('userCity').value;
    if (cityInput.trim() === '') {
        document.getElementById('cityError').textContent = 'City is required';
    }

    // Validate state
    stateInput = document.getElementById('state').value;
    if (stateInput.trim() === '') {
        document.getElementById('stateError').textContent = 'State is required';
    }

    // Validate date of birth
    dobInput = document.getElementById('dob').value;
    let currentDate  = new Date();
    let selectedDate = new Date(dobInput);
    if (selectedDate > currentDate || selectedDate == '' || selectedDate == null) {
        document.getElementById('dobError').textContent = 'Date of birth is rquired';
    }

    // Validate blood group
    bloodGroupInput = document.getElementById('bloodGroup').value;
    if (bloodGroupInput === '') {
        document.getElementById('bloodGroupError').textContent = 'Blood group is required';
    }

    // Validate gender
    genderInputs = document.querySelectorAll('input[name="gender"]');
    let isChecked = false;
    for (let i = 0; i < genderInputs.length; i++) {
        if (genderInputs[i].checked) {
            isChecked = true;
            genderCheckedValue = genderInputs[i].value;
            break;
        }
    }
    if (!isChecked) {
        document.getElementById('genderError').textContent = 'Gender is required';
    }

    // Validate profile picture
    // let profilePicInput = document.getElementById('profilePic');
    // if (!profilePicInput.files[0]) {
    //     document.getElementById('profilePicError').textContent = 'Profile picture is required';
    // } else {
    //     // Display selected profile picture
    //     const fileReader = new FileReader();
    //     fileReader.onload = function(e) {
    //         profilePicPreview.src = e.target.result;
    //     };
    //     fileReader.readAsDataURL(profilePicInput.files[0]);
    // }

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
for (let i = 0; i < inputFields.length; i++) {
    let inputField = inputFields[i];
    inputField.addEventListener('change', function() {
        // console.log("validateUserProfile();");
        validateUserProfile();
    });
}