document.addEventListener('DOMContentLoaded', function () {
    // --- Profile Section Validation ---
    const profileNextButton = document.getElementById('profile-next');
    const profileForm = document.getElementById('profile-form');
    const profileFields = profileForm.querySelectorAll('input, textarea, select');

    // Calculate the maximum allowed date (18 years ago from today)
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    document.getElementById('dob').setAttribute('max', maxDate.toISOString().split('T')[0]);

    function validateFields(fields, form) {
        let allFieldsFilled = true;
        let firstEmptyField = null;

        fields.forEach(function (field) {
            if (
                (field.type !== 'radio' && field.value.trim() === '') ||
                (field.type === 'radio' && !form.querySelector('input[name="gender"]:checked'))
            ) {
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

    // --- Accordion Icon Update Function ---
    function updateAccordionIcon(accordionId, isValid) {
        const accordionButton = document.querySelector(`#${accordionId} .accordion-button`);
        const iconContainer = document.querySelector(`#${accordionId} .icon-container`);
        if (isValid) {
            accordionButton.classList.remove('error');
            accordionButton.classList.add('success');
            iconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
        } else {
            accordionButton.classList.remove('success');
            accordionButton.classList.add('error');
            iconContainer.innerHTML = '<i class="fas fa-times-circle"></i>';
        }
    }

    // --- Profile Next Button Click Event ---
    profileNextButton.addEventListener('click', function () {
        if (validateFields(profileFields, profileForm)) {
            updateAccordionIcon('headingOne', true); // Success icon
            document.getElementById('collapseOne').classList.remove('show');
            document.getElementById('collapseTwo').classList.add('show');
        } else {
            updateAccordionIcon('headingOne', false); // Error icon
        }
    });

    // --- Driving License Section ---
    document.getElementById('driving-license-next').addEventListener('click', function () {
        const dlNumberField = document.getElementById('dl_number');
        const dlNumber = dlNumberField.value.trim();

        if (dlNumber === '') {
            dlNumberField.classList.add('empty_error');
            dlNumberField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            updateAccordionIcon('headingTwo', false); // Error icon
        } else {
            dlNumberField.classList.remove('empty_error');
            updateAccordionIcon('headingTwo', true); // Success icon
            document.getElementById('collapseTwo').classList.remove('show');
            document.getElementById('collapseThree').classList.add('show');
        }
    });

    // --- Vehicle RC Section (Assuming no validation needed)---
    document.getElementById('vehicle-rc-next').addEventListener('click', function () {
        updateAccordionIcon('headingThree', true); // Success icon
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
            updateAccordionIcon('headingFour', false); // Error icon
        } else {
            panNumberField.classList.remove('empty_error');
            updateAccordionIcon('headingFour', true); // Success icon
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
            updateAccordionIcon('headingFive', false); // Error icon
        } else {
            aadharNumberField.classList.remove('empty_error');
            updateAccordionIcon('headingFive', true); // Success icon
            document.getElementById('collapseFive').classList.remove('show');
        }
    });

    // Submit button click event
    document.getElementById("registration-submit").addEventListener('click', function (event) {
        event.preventDefault();
        var allFieldsFilled = true;
        var fieldsToCheck = document.querySelectorAll('#profile-form input, #profile-form textarea, #profile-form select, #driving-license-form input, #pan-card-form input, #aadhaar-card-form input');

        // Track validation status for each section
        var sectionsValid = {
            headingOne: true,
            headingTwo: true,
            headingThree: true,
            headingFour: true,
            headingFive: true
        };

        fieldsToCheck.forEach(function (field) {
            if ((field.type !== 'radio' && field.value.trim() === '') ||
                (field.type === 'radio' && !document.querySelector('input[name="gender"]:checked'))) {
                allFieldsFilled = false;
                field.classList.add('empty_error');

                // Highlight the accordion with a red Color
                var accordion = field.closest('.accordion-item');
                if (accordion) {
                    var accordionId = accordion.querySelector('.accordion-header').id;
                    sectionsValid[accordionId] = false;

                    var accordionButton = accordion.querySelector('.accordion-button');
                    if (accordionButton) {
                        accordionButton.classList.add('error');
                    }
                }
            } else {
                field.classList.remove('empty_error');
                // Remove the red color from the accordion
                var accordion = field.closest('.accordion-item');
                if (accordion) {
                    var accordionId = accordion.querySelector('.accordion-header').id;
                    if (sectionsValid[accordionId] !== false) {
                        sectionsValid[accordionId] = true;
                    }

                    var accordionButton = accordion.querySelector('.accordion-button');
                    if (accordionButton) {
                        accordionButton.classList.remove('error');
                    }
                }
            }
        });

        // Update accordion icons based on section validation
        for (var section in sectionsValid) {
            updateAccordionIcon(section, sectionsValid[section]);
        }

        if (!allFieldsFilled) {
            var firstEmptyField = document.querySelector('.empty_error');
            if (firstEmptyField) {
                firstEmptyField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
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
            formData.append('data', JSON.stringify(combinedData));

            fetch('https://httpbin.org/post', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    console.log(data.form.data)
                    alert('Form submitted successfully!');

                    // Reset all forms after successful submission
                    document.getElementById('profile-form').reset();
                    document.getElementById('driving-license-form').reset();
                    document.getElementById('vehicle-rc-form').reset();
                    document.getElementById('pan-card-form').reset();
                    document.getElementById('aadhaar-card-form').reset();

                    // Remove all error classes and icons
                    document.querySelectorAll('.accordion-button').forEach(function (button) {
                        button.classList.remove('error', 'success');
                    });

                    document.querySelectorAll('.icon-container').forEach(function (iconContainer) {
                        iconContainer.innerHTML = '';    // Clear the icon HTML
                    });


                    // Hide all accordions and show the first one
                    document.getElementById('collapseOne').classList.remove('show');
                    document.getElementById('collapseTwo').classList.remove('show');
                    document.getElementById('collapseThree').classList.remove('show');
                    document.getElementById('collapseFour').classList.remove('show');
                    document.getElementById('collapseFive').classList.remove('show');
                    // Reset accordion icons and heading colors
                    // updateAccordionIcon('headingOne', false);
                    // updateAccordionIcon('headingTwo', false);
                    // updateAccordionIcon('headingThree', false);
                    // updateAccordionIcon('headingFour', false);
                    // updateAccordionIcon('headingFive', false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    });
});
