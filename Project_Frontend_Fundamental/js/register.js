let users = JSON.parse(localStorage.getItem("myUser")) || [];;

let lastName = document.getElementById("lastName");
let firstName = document.getElementById("firstName");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm");
let createBtnAcc = document.getElementById("registerForm");
let checkBox = document.getElementById("checkBox");



createBtnAcc.addEventListener('submit',addUsers);

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
    let check = true;
    document.querySelectorAll(".error-msg").forEach(err => err.classList.remove("show"));
    document.querySelectorAll("input").forEach(err => err.classList.remove("invalid"));

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
    } 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, "emailErr");
        check = false;
    }
    if (password.value.trim() === "") {
        showError(password, 'passwordErr');
        check = false;
    }
    if (password.value.length < 8) {
        showError(password, 'passwordErr');
        check = false;
    }
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'confirmErr');
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
        setTimeout(() => {
        window.location.href = "../pages/login.html";
        }, 1000);
    }
    return check;
}


function showError (input , id ) {
    input.classList.add('invalid');
    let idErr = document.getElementById(id);
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