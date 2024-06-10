document.addEventListener('DOMContentLoaded', function() {
    // Profile section validation
    var profileNextButton = document.getElementById('profile-next');
    var profileForm = document.getElementById('profile-form');
    var profileFields = profileForm.querySelectorAll('input, textarea, select');

    // Calculate the maximum allowable date (18 years ago from today)
    var today = new Date();
    var maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    var maxDateString = maxDate.toISOString().split('T')[0];
    document.getElementById('dob').setAttribute('max', maxDateString);

    function validateFields(fields, form) {
        var allFieldsFilled = true;
        var firstEmptyField = null;

        fields.forEach(function(field) {
            if ((field.type !== 'radio' && field.value.trim() === '') || 
                (field.type === 'radio' && !form.querySelector('input[name="gender"]:checked'))) {
                allFieldsFilled = false;
                field.classList.add('empty_error');
                if (!firstEmptyField) {
                    firstEmptyField = field;
                }
            } else {
                field.classList.remove('empty_error');
            }
        });

        if (!allFieldsFilled && firstEmptyField) {
            firstEmptyField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return allFieldsFilled;
    }

    profileNextButton.addEventListener('click', function() {
        if (validateFields(profileFields, profileForm)) {

            // Moving to Next Accordian
            document.getElementById('collapseOne').classList.remove('show');
            document.getElementById('collapseTwo').classList.add('show');
        }
    });

    // Driving License section
    document.getElementById('driving-license-next').addEventListener('click', function () {
        var dlNumberField = document.getElementById('dl_number');
        var dlNumber = dlNumberField.value.trim();

        if (dlNumber === '') {
            dlNumberField.classList.add('empty_error');
            dlNumberField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            dlNumberField.classList.remove('empty_error');
            document.getElementById('collapseTwo').classList.remove('show');
            document.getElementById('collapseThree').classList.add('show');
        }
    });

    // Vehicle RC section
    document.getElementById('vehicle-rc-next').addEventListener('click', function () {
        document.getElementById('collapseThree').classList.remove('show');
        document.getElementById('collapseFour').classList.add('show');
    });


    // PAN card section
    document.getElementById("pan-card-next").addEventListener('click', function () {
        var panNumberField = document.getElementById('pan_number');
        var panNumber = panNumberField.value.trim();

        if (panNumber === '') {
            panNumberField.classList.add('empty_error');
            panNumberField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            panNumberField.classList.remove('empty_error');
            document.getElementById('collapseFour').classList.remove('show');
            document.getElementById('collapseFive').classList.add('show');
        }
    });

    // Aadhar card section
    document.getElementById("aadhar-next").addEventListener('click', function () {
        var aadharNumberField = document.getElementById('aadhaar_number');
        var aadharNumber = aadharNumberField.value.trim();

        if (aadharNumber === '' || aadharNumber.length !== 12) {
            aadharNumberField.classList.add('empty_error');
            aadharNumberField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            aadharNumberField.classList.remove('empty_error');
            document.getElementById('collapseFive').classList.remove('show');
        }
    });

    // Submit button click event
    document.getElementById("registration-submit").addEventListener('click', function () {
        // event.preventDefault();

        var allFieldsFilled = true;
        var fieldsToCheck = document.querySelectorAll('#profile-form input, #profile-form textarea, #profile-form select, #driving-license-form input, #pan-card-form input, #aadhaar-card-form input');
        
        fieldsToCheck.forEach(function(field) {
            if ((field.type !== 'radio' && field.value.trim() === '') || 
                (field.type === 'radio' && !document.querySelector('input[name="gender"]:checked'))) {
                allFieldsFilled = false;
                field.classList.add('empty_error');
                // Highlight the accordion with a red border
                var accordion = field.closest('.accordion-item');
                if (accordion) {
                    accordion.classList.add('error');
                    var accordionButton = accordion.querySelector('.accordion-button');
                    if (accordionButton) {
                        accordionButton.classList.add('error');
                    }
                }
            }else {
                field.classList.remove('empty_error');
                // Remove the red border from the accordion
                var accordion = field.closest('.accordion-item');
                if (accordion) {
                    accordion.classList.remove('error');
                    var accordionButton = accordion.querySelector('.accordion-button');
                    if (accordionButton) {
                        accordionButton.classList.remove('error');
                    }
                }
            }
        });

        if(!allFieldsFilled){
            var firstEmptyField = document.querySelector('.empty_error');
            if (firstEmptyField) {
                firstEmptyField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        else{
            // Gathering Data From All Forms

            var profileForm = new FormData(document.getElementById('profile-form'));
            var drivingLicenseForm = new FormData(document.getElementById('driving-license-form'));
            var vehicleRcForm = new FormData(document.getElementById('vehicle-rc-form'));
            var panCardForm = new FormData(document.getElementById('pan-card-form'));
            var aadhaarCardForm = new FormData(document.getElementById('aadhaar-card-form'));

              // Combine all data into a single object
              var combinedData = {};

            profileForm.forEach((value, key) => {
                combinedData[key] = value;
            });
            drivingLicenseForm.forEach((value, key) => {
                combinedData[key] = value;
            });
            vehicleRcForm.forEach((value, key) => {
                combinedData[key] = value;
            });
            panCardForm.forEach((value, key) => {
                combinedData[key] = value;
            });
            aadhaarCardForm.forEach((value, key) => {
                combinedData[key] = value;
            });

            // FormData object for file uploads

            var formData = new FormData();

            formData.append('profile_image', document.getElementById('profile_image').files[0]);

            formData.append('data' , JSON.stringify(combinedData))

            fetch('https://httpbin.org/post' ,{
                method:'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Form submitted successfully!');
                // Reset all forms after successful submission
                document.getElementById('profile-form').reset();
                document.getElementById('driving-license-form').reset();
                document.getElementById('vehicle-rc-form').reset();
                document.getElementById('pan-card-form').reset();
                document.getElementById('aadhaar-card-form').reset();
                // Hide all accordions and show the first one
                document.getElementById('collapseOne').classList.remove('show');
                document.getElementById('collapseTwo').classList.remove('show');
                document.getElementById('collapseThree').classList.remove('show');
                document.getElementById('collapseFour').classList.remove('show');
                document.getElementById('collapseFive').classList.remove('show');
            })
            .catch((error) => {
                console.error('Error:', error)
            })
        }
    });
});
