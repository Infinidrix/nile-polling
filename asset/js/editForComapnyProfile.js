import { addUser, init, testDB, user_login } from './db/db.js';

document.addEventListener("DBInitalized", async() => {

    // const edit = document.querySelector("#edit")
    const gmail = document.querySelector("#gmail")
    const catagory = document.querySelector("#catagory")
    const comName = document.querySelector("#comName")
    const svaeComapny = document.querySelector("#svaeComapny")
    comName.value = "Company 1"
    gmail.value = user.email
    catagory.value = user.tags[0]
    console.log(user.email)
    var pass = user.password

    // user_login
    svaeComapny.addEventListener("click", saveCompany)

    async function saveCompany(e) {
        //   burra function
        // let user = await addUser({
        //     email: gmail.value,
        //     password: pass,
        //     type: "company",
        //     tags: [catagory.value]
        // })
        console.log("here")
        location.href = "company_profile.htmlhtml"
    }

})