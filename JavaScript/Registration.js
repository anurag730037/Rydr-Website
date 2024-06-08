document.addEventListener('DOMContentLoaded', function() {
    // Profile section validation
    var nextButton = document.getElementById('profile-next');
    var profileForm = document.getElementById('profile-form');
    var profileFields = profileForm.querySelectorAll('input, textarea, select');

    // Calculate the maximum allowable date (18 years ago from today)
    var today = new Date();
    var maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    var maxDateString = maxDate.toISOString().split('T')[0];
    document.getElementById('dob').setAttribute('max', maxDateString);

    function validateProfileFields() {
        var allFieldsFilled = true;
        profileFields.forEach(function(field) {
            if ((field.type !== 'radio' && field.value.trim() === '') || 
                (field.type === 'radio' && !profileForm.querySelector('input[name="gender"]:checked'))) {
                allFieldsFilled = false;
                field.classList.add('empty_error');
            } else {
                field.classList.remove('empty_error');
            }
        });
        return allFieldsFilled;
    }

    nextButton.addEventListener('click', function() {
        if (validateProfileFields()) {
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

        if(panNumber === ''){
            panNumberField.classList.add('empty_error');
        }
        else{
            panNumberField.classList.remove('empty_error');
        document.getElementById('collapseFour').classList.remove('show');
        document.getElementById('collapseFive').classList.add('show');
        }
    });

    // Aadhar card section and Submit Section
    document.getElementById("reg-submit").addEventListener('click', function () {
        var aadharNumberField = document.getElementById('aadhaar_number');
        var aadharNumber = aadharNumberField.value.trim();

        if (aadharNumber === '' || aadharNumber.length !== 16) {
            aadharNumberField.classList.add('empty_error');
        }
        else{
        aadharNumberField.classList.remove('empty_error');
        document.getElementById('collapseFour').classList.remove('show');
        document.getElementById('collapseFive').classList.add('show');
        }
    });
});
