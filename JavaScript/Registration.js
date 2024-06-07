
document.getElementById('profile-next').addEventListener('click', function () {
    document.getElementById('collapseOne').classList.remove('show');
    document.getElementById('collapseTwo').classList.add('show');
});

document.getElementById('driving-license-next').addEventListener('click', function () {
   // Check if DL number is provided
   var dlNumberField = document.getElementById('dl_number')
    var dlNumber = document.getElementById('dl_number').value;
    if (dlNumber.trim() === '') {
        dlNumberField.classList.add('empty_error');

        return;
    }

     // If DL number is valid, redirect to the next accordion
    document.getElementById('collapseTwo').classList.remove('show');
    document.getElementById('collapseThree').classList.add('show');
});

document.getElementById('vehicle-rc-next').addEventListener('click', function () {
    document.getElementById('collapseThree').classList.remove('show');
    document.getElementById('collapseFour').classList.add('show');
});

document.getElementById("pan-card-next").addEventListener('click' , function () {
    document.getElementById('collapseFour').classList.remove('show');
    document.getElementById('collapseFive').classList.add('show');

});
