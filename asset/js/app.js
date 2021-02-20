import { addUser, init, testDB, user_login } from './db/db.js';

document.addEventListener("DOMContentLoaded", async() => {

    await init();
    // for login part
    const userNameInput = document.querySelector("#user")
    const passInput = document.querySelector("#pass")
    const showErr = document.querySelector("#showError")
    const spinnerLogin = document.querySelector(".spinner-border")
    const loginBtn = document.querySelector(".login")

    // for sgn up  as person part
    const signupBtnPerson = document.querySelector("#signupBtnP")
    const date = document.querySelector("#date")
    const personConfirmPass = document.querySelector("#personConPass")
    const personPass = document.querySelector("#personPass")
    const personEmail = document.querySelector("#personGmail")
    const lName = document.querySelector("#lanme")
    const fName = document.querySelector("#fName")
    const female = document.querySelector("#female")
    const male = document.querySelector("#male")

    // for company
    const companyName = document.querySelector("#cName");
    const emailCompany = document.querySelector("#emailCom")
    const catgory = document.querySelector("#catgory")
    const companyPass = document.querySelector("#cPass")
    const signUpBntnComp = document.querySelector("#signUpBntnComp")
    const confirmPassCompany = document.querySelector("#conCamPass")


    loginBtn.addEventListener("click", login)
    signupBtnP.addEventListener("click", signUpPerson)
    signUpBntnComp.addEventListener("click", signUpPerson)
        // user_login("se.biruk.solomon@gmail.com", "LifeIsShort").then(console.log)
    async function login() {
        let userName = userNameInput.value
        let pass = passInput.value
        let user = await user_login(userName, pass)
        if (user) {
            spinnerLogin.style.display = "block"
            localStorage.setItem("user", JSON.stringify(user));
            if (user.type === "user"){
                location.href = "user_page.html";
            } else{
                location.href = "company_page.html";
            }
        } else {
            passInput.style.border = "solid 1px"
            userNameInput.style.border = "solid 1px"
            passInput.style.borderColor = "red"
            userNameInput.style.borderColor = "red"
            showErr.style.opacity = "1"
            setTimeout(() => {
                passInput.style.border = "none"
                userNameInput.style.border = "none"
                showErr.style.opacity = "0"
            }, 3000)
        }
    }

    async function signUpPerson(e) {

        if (e.target.id === "signupBtnP") {
            let firstName = fName.value;
            let lastName = lName.value;
            let bDate = date.value;
            let conPass = personConfirmPass.value;
            let pass = personPass.value;
            let email = personEmail.value;
            let gender = genderReveal();
            alert(gender)
            let user = await addUser({
                email: email,
                password: pass,
                type: "user",
                tags: [bDate, gender, firstName, lastName]
            })
            if (user) {
                localStorage.setItem("user", JSON.stringfy(user));
                location.href = "user.html";

            } else {
                alert("check again erorr")
            }
        } else {
            let confirmPassCompany = confirmPassCompany.value
            let companyPass = companyPass.value
            let catgory = catgory.value
            let emailCompany = emailCompany.value
            let companyName = companyName.value
            let user = await addUser({
                email: emailCompany,
                password: companyPass,
                type: "company",
                tags: [catgory]
            })
            if (user) {
                localStorage.setItem("user", JSON.stringfy(user));
                location.href = "user.html";
            } else {}
        }
    }

    function genderReveal() {

        if (female.checked) {
            return "feamle"
        } else if (male.checked) {
            return "male"
        }
    }
})