import { addUser, init, testDB, user_login } from './db/db.js';

document.addEventListener("DBInitalized", async() => {

    // const edit = document.querySelector("#edit")
    const gmail = document.querySelector("#gmail")
    const catagory = document.querySelector("#catagory")
    const comName = document.querySelector("#comName")

    comName.innerHTML = "Company 1"
    gmail.innerHTML = user.email
    catagory.innerHTML = user.tags[0]


    // console.log(user.email)
})