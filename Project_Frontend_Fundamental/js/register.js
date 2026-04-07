let users = JSON.parse(localStorage.getItem("myUser")) || [];

let lastName = document.getElementById("lastName");
let firstName = document.getElementById("firstName");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm");
let createBtnAcc = document.getElementById("registerForm");
let checkBox = document.getElementById("checkBox");


createBtnAcc.addEventListener('submit',addUsers);

function unShow () {
    document.querySelectorAll(".error-msg").forEach(err => err.classList.remove("show"));
    document.querySelectorAll("input").forEach(err => err.classList.remove("invalid"));

    let stored = localStorage.getItem("myUser");
    let users = JSON.parse(stored);
    let checkUser = users.find(u => u.email === email.value.trim())

    if (checkUser) {
        showError(email, 'emailErr');
    }

    if (lastName.value.trim() === "") {
        showError(lastName, 'lastNameErr');
    }
    if (firstName.value.trim() === "") {
        showError(firstName, 'firstNameErr');
    }
    if (email.value.trim() === "") {
        showError(email, 'emailErr');
    } 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, "emailErr");
    }
    if (password.value.trim() === "") {
        showError(password, 'passwordErr');
    }
    if (password.value.length < 8) {
        showError(password, 'passwordErr');
    }
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'confirmErr');
    }
    if (confirmPassword.value.trim() === "") {
        showError(confirmPassword, 'confirmErr');
    }
    if (!checkBox.checked) {
        showError(checkBox, 'checkBoxErr');
    }
}

function addUsers (e) {
    e.preventDefault();
    if (!validate()){
        return;
    }
    let newId = users.length === 0 ? 1 : users[users.length - 1].id + 1;
    let newUsers = {
        id: newId,
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value
    }
    users.push(newUsers);
    localStorage.setItem("myUser",JSON.stringify(users));
    firstName.value ="";
    lastName.value ="";
    email.value ="";
    password.value ="";
}

function validate() {
    createBtnAcc.addEventListener('input',unShow);
    let check = true;
    document.querySelectorAll(".error-msg").forEach(err => err.classList.remove("show"));
    document.querySelectorAll("input").forEach(err => err.classList.remove("invalid"));


    // lấy dữ liệu tuef local;
    // chuyển dữ liệu thành OJ
    let users = JSON.parse(localStorage.getItem("myUser")) || [];
    let checkUser = users.find(u => u.email === email.value.trim())

    if (checkUser) {
        showError(email, 'emailErr' , 'Email bị trùng vui lòng nhập lại');
        check = false;
    }

    if (lastName.value.trim() === "") {
        showError(lastName, 'lastNameErr');
        check = false;
    }
    if (firstName.value.trim() === "") {
        showError(firstName, 'firstNameErr');
        check = false;
    }
    if (email.value.trim() === "") {
        showError(email, 'emailErr');
        check = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, "emailErr" , 'Email phải nhập đúng dịnh dạng');
        check = false;
    }
    if (password.value.trim() === "") {
        showError(password, 'passwordErr');
        check = false;
    }
    if (password.value.length < 8) {
        showError(password, 'passwordErr', 'Mật khẩu phải có tối thiểu 8 ký tự');
        check = false;
    }
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'confirmErr', 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập');
        check = false;
    }
    if (confirmPassword.value.trim() === "") {
        showError(confirmPassword, 'confirmErr');
        check = false;
    }
    if (!checkBox.checked) {
        showError(checkBox, 'checkBoxErr');
        check = false;
    }
    if (check) {
        showToast("Thành công", "Đăng ký thành công! Đang chuyển hướng...", "success");
        setTimeout(() => { window.location.href = "../pages/login.html"; }, 1000);
    }
    return check;
}


function showError (input , id  , message ) {
    input.classList.add('invalid');
    let idErr = document.getElementById(id);
    if (message) {
        idErr.innerHTML = message;
    }
    idErr.classList.add('show');
}

function showToast(title, message, type = "success") {
    const toast = document.getElementById("toast");
    const icon = toast.querySelector(".toast-icon");

    document.getElementById("toast-title").textContent = title;
    document.getElementById("toast-message").textContent = message;

    icon.className = "toast-icon";
    icon.textContent = "✔";

    toast.classList.add("show");
}
