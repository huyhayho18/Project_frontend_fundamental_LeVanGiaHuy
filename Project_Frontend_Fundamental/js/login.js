let email = document.getElementById('email');
let password = document.getElementById('password');
let loginBtnAcc = document.getElementById("card");
let checkbox = document.getElementById("checkbox")

loginBtnAcc.addEventListener('submit',validateLogin);

function validateLogin(e) {
    e.preventDefault();
    loginBtnAcc.addEventListener('input',unShow);
    let check = true;
    document.querySelectorAll(".error-msg").forEach(err => err.classList.remove("show"));
    document.querySelectorAll("input").forEach(err => err.classList.remove("invalid"));
    if (email.value.trim() === "") {
        showError(email, 'emailErr');
        check = false;
    }
    if (password.value.trim() === "") {
        showError(password, 'passwordErr');
        check = false;
    }

    // lấy dữ liệu tuef local
    let stored = localStorage.getItem("myUser");
    // chuyển dữ liệu thành OJ
    let users = JSON.parse(stored);
    let checkUser = users.find(u => u.email === email.value.trim())
    if (!checkUser) {
        showError(email, 'emailErr');
        check = false;
    }
    if (checkUser.password !== password.value.trim()) {
        showError(password, 'passwordErr');
        check = false;
    }
    if (check) {
        showToast("Thành công", "Đăng nhập thành công! Đang chuyển hướng...", "success");
        setTimeout(() => {
        window.location.href = "../pages/dashboard.html";
        }, 1000);
        localStorage.setItem('login','true');
    }
    return check;
}

function unShow() {
    document.querySelectorAll(".error-msg").forEach(err => err.classList.remove("show"));
    document.querySelectorAll("input").forEach(err => err.classList.remove("invalid"));
    if (email.value.trim() === "") {
        showError(email, 'emailErr');
    }
    if (password.value.trim() === "") {
        showError(password, 'passwordErr');
    }

    // lấy dữ liệu tuef local
    let stored = localStorage.getItem("myUser");
    // chuyển dữ liệu thành OJ
    let users = JSON.parse(stored);
    let checkUser = users.find(u => u.email === email.value.trim())
    if (!checkUser) {
        showError(email, 'emailErr', 'Email của bạn chưa được đăng ký');
    }
    if (checkUser.password !== password.value.trim()) {
        showError(password, 'passwordErr', 'Sai mật khẩu');
    }

}

function showError(input, id) {
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