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