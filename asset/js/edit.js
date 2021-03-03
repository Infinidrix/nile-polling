document.addEventListener("DBInitalized", async() => {

    // const edit = document.querySelector("#edit")
    const email = document.querySelector("#gmail")
    const catagory = document.querySelector("#catagory")
    const comName = document.querySelector("#comName")

    // user_login
    email.value = user_login.email
    catagory.value = user_login.tags[0]



})