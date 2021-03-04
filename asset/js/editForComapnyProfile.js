import { addUser, getSurveysForUser, init, testDB, user_login, getSurveysOfCompany } from './db/db.js';

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
    await updateSurveyCount()

    async function saveCompany(e) {
        //   burra function
        let user = await addUser({
            email: gmail.value,
            password: pass,
            type: "company",
            tags: [catagory.value]
        })
        console.log("here")
    }




})

async function updateSurveyCount(){
    let userSurveys = await getSurveysOfCompany(user.id);
    let pollCount = userSurveys.filter((survey) => survey.type == "poll").length;
    document.querySelector("#poll-count").textContent = pollCount;
    document.querySelector("#survey-count").textContent = userSurveys.length - pollCount;
}