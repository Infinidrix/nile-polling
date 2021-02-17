import { init, testDB, user_login } from './db/db.js';

document.addEventListener("DOMContentLoaded", testDB); // testDB only for testing purposes and init for other reasons
init();
const userNameInput = document.querySelector("#user")
const passInput = document.querySelector("#pass")
const showErr = document.querySelector("#showError")
const spinnerLogin = document.querySelector(".spinner-border")
const loginBtn = document.querySelector(".login")
let userName

loginBtn.addEventListener("click", login)

async function login() {
    userName = userNameInput.value
    let pass = passInput.value
    console.log("jiij");
    let user = user_login(userName, pass).then((result) => result).then(console.log);
    console.log(user);
    if (user) {
        spinnerLogin.style.display = "block"
    } else {
        passInput.style.border = "solid 1px"

        userNameInput.style.border = "solid 1px"
        passInput.style.borderColor = "red"
        userNameInput.style.borderColor = "red"
        showErr.style.opacity = "1"

        setTimeout(() => {
            passInput.style.border = "none"

            userNameInput.style.border = "none"
            passInput.style.borderColor = "red"
            userNameInput.style.borderColor = "red"
            showErr.style.opacity = "0"

        }, 3000)


    }
}

function buraFun(u, p) {
    return false

}
login()