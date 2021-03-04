import { addUser, init, testDB, user_login } from './db/db.js';
// import { hashCode, passwordStrength } from './app.js';

document.addEventListener("DBInitalized", async() => {

    // const edit = document.querySelector("#edit")
    const oldPass = document.querySelector("#oldPassword")

    const newPassword = document.querySelector("#newPassword")

    const conPass = document.querySelector("#conPass")
    const change = document.querySelector("#change")


    // user_login
    change.addEventListener("click", changeP)

    newPassword.addEventListener("keyup", passwordStrength)

    // function passwordStrength(e) {
    //     let password = e.target.value;
    //     let label = e.target.nextElementSibling;
    //     let strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    //     let mediumRegex = new RegExp("^(?=.{6,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    //     let enoughRegex = new RegExp("(?=.{4,}).*", "g");
    //     if (password.length == 0) {
    //         label.innerHTML = '<span style="font-size:14px">Type Password</span>'
    //     } else if (false == enoughRegex.test(password)) {
    //         label.innerHTML = '<span style="font-size:14px">More Characters</span>';
    //     } else if (strongRegex.test(password)) {
    //         label.innerHTML = '<span style="color:green;font-size:14px">Strong!</span>';
    //     } else if (mediumRegex.test(password)) {
    //         label.innerHTML = '<span style="color:orange;font-size:14px">Medium!</span>';
    //     } else {
    //         label.innerHTML = '<span style="color:red;font-size:14px">Weak!</span>';
    //     }
    // }

    async function changeP(e) {
        //   burra function
        if (hashCode(oldPass.value) === user.password) {
            alert(newPassword.value === conPass.value)
        } else {
            alert(hashCode(oldPass))
            alert(user.password)

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


})