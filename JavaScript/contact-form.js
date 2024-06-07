
var connectBtn = document.getElementById("contact-submit");
connectBtn.addEventListener('click', (event) => {
    event.preventDefault();

    var apiUrl = ''

    var name = document.getElementById('connect-name').value;
    var phone_no = document.getElementById('connect-phone').value;
    var email = document.getElementById('connect-email').value;
    var message = document.getElementById('connect-message').value;


    var formData = {
        name: name,
        contactnumber: phone_no,
        email: email,
        message: message
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network Response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Your message has been sent successfully !');
        })

        .catch(error => {
            alert('There was a problem with your submission: ' + error.message);
        })

})


