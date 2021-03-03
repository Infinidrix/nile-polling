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
    let personPasswordStrength = document.querySelector("#personPasswordStrength")

    // for company
    const companyName = document.querySelector("#cName");
    const emailCompany = document.querySelector("#emailCom")
    const catgory = document.querySelector("#catgory")
    const companyPass = document.querySelector("#cPass")
    const signUpBntnComp = document.querySelector("#signUpBntnComp")
    const confirmPassCompany = document.querySelector("#conCamPass")
    let companyPasswordStrength = document.querySelector("#companyPasswordStrength")
    const other = document.querySelector("#other")


    loginBtn.addEventListener("click", login)
    signupBtnP.addEventListener("click", signUpPerson)
    signUpBntnComp.addEventListener("click", signUpPerson)
    personPass.addEventListener('keyup', passwordStrength)
    companyPass.addEventListener('keyup', passwordStrength)
        // user_login("se.biruk.solomon@gmail.com", "LifeIsShort").then(console.log)


    // for company edit page 






    other.addEventListener("click", catgor)



    async function login() {
        let userName = userNameInput.value
            // let pass = passInput.value
        let pass = hashCode(passInput.value)
        let user = await user_login(userName, pass)
        if (user) {
            spinnerLogin.style.display = "block"
            localStorage.setItem("user", JSON.stringify(user));
            if (user.type === "user") {
                location.href = "user_page.html";
            } else {
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
            // let conPass = personConfirmPass.value;
            let conPass = hashCode(personConfirmPass.value);
            // let pass = personPass.value;
            let pass = hashCode(personPass.value);
            let email = personEmail.value;
            let gender = genderReveal();
            // alert(gender)
            let user = await addUser({
                email: email,
                password: pass,
                type: "user",
                tags: [bDate, gender, firstName, lastName]
            })
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                location.href = "user_page.html";

            } else {
                alert("check again erorr")
            }
        } else {
            // let confirmPassCompany = confirmPassCompany.value
            let confirmPassCompany = hashCode(confirmPassCompany.value)
                // let companyPass = companyPass.value
            let companyPass = hashCode(companyPass.value)
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
                localStorage.setItem("user", JSON.stringify(user));
                location.href = "company_page.html";
            } else {}
        }
    }

    function genderReveal() {

        if (female.checked) {
            return "female"
        } else if (male.checked) {
            return "male"
        }
    }

    function hashCode(str) { // function to hash the users password
        let hash = 0,
            i, chr;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }


    function passwordStrength(e) {
        let password = e.target.value;
        let label = e.target.nextElementSibling;
        let strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        let mediumRegex = new RegExp("^(?=.{6,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        let enoughRegex = new RegExp("(?=.{4,}).*", "g");
        if (password.length == 0) {
            label.innerHTML = '<span style="font-size:14px">Type Password</span>'
        } else if (false == enoughRegex.test(password)) {
            label.innerHTML = '<span style="font-size:14px">More Characters</span>';
        } else if (strongRegex.test(password)) {
            label.innerHTML = '<span style="color:green;font-size:14px">Strong!</span>';
        } else if (mediumRegex.test(password)) {
            label.innerHTML = '<span style="color:orange;font-size:14px">Medium!</span>';
        } else {
            label.innerHTML = '<span style="color:red;font-size:14px">Weak!</span>';
        }
    }

    function catgor(e) {
        e.preventDefault()
        catgory.style.display = "block"
        catgory.focus()


    }

})