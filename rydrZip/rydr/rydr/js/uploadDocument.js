// Image Upload Click Event :: Driving License upload

let img = null;
let imgUrl = null;
let imgInputFront_DL = document.getElementById('imgUploadFront_DL');
let imgInputBack_DL = document.getElementById('imgUploadBack_DL');
let nameShowFront = document.getElementById('imgLabelFront_DL');
let nameShowBack = document.getElementById('imgLabelBack_DL');
let preview = document.getElementById('preview');


function ReadUrlFront(input) {
    let reader = new FileReader();
    reader.onload = function (e) {
        imgUrl = e.target.result;
        $('#previewFront_DL').attr('src', e.target.result);
    }
    reader.readAsDataURL(input)
}

function ReadUrlBack(input) {
    let reader = new FileReader();
    reader.onload = function (e) {
        imgUrl = e.target.result;
        $('#previewBack_DL').attr('src', e.target.result);
    }
    reader.readAsDataURL(input)
}

imgInputFront_DL.addEventListener('change', function (e) {
    if (e.currentTarget.files[0].type == 'image/png' || e.currentTarget.files[0].type == 'image/jpeg' || e.currentTarget.files[0].type == 'image/jpg') {
        ReadUrlFront(e.currentTarget.files[0]);
        img = e.currentTarget.files[0].name;
        nameShowFront.innerText = img;
    } else {
        nameShowFront.innerText = 'please, provide image file';
        nameShowFront.style.color = '#E91F63';
    }
})

imgInputBack_DL.addEventListener('change', function (e) {
    if (e.currentTarget.files[0].type == 'image/png' || e.currentTarget.files[0].type == 'image/jpeg' || e.currentTarget.files[0].type == 'image/jpg') {
        ReadUrlBack(e.currentTarget.files[0]);
        img = e.currentTarget.files[0].name;
        nameShow.innerText = img;
    } else {
        nameShow.innerText = 'please, provide image file';
        nameShowBack.style.color = '#E91F63';
    }
})