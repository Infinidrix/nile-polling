import { addUser, init, testDB, user_login, updateUser } from './db/db.js';

document.addEventListener("DBInitalized", async() => {

    // const edit = document.querySelector("#edit")
    const gmail = document.querySelector("#gmail")
    const catagory = document.querySelector("#catagory")
    const comName = document.querySelector("#comName")
    const svaeComapny = document.querySelector("#svaeComapny")
    comName.value = user.name
    gmail.value = user.email
    catagory.value = user.tags[0]
    var pass = user.password

    // user_login
    svaeComapny.addEventListener("click", saveCompany)

    async function saveCompany(e) {
        user.name = comName.value
        user.catagory = catagory.value
        user.email = gmail.value

        location.href = "company_profile.html"
    }

})