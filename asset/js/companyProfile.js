import { addUser, init, testDB, user_login, getSurveysOfCompany } from './db/db.js';

document.addEventListener("DBInitalized", async() => {

    // const edit = document.querySelector("#edit")
    const gmail = document.querySelector("#gmail")
    const catagory = document.querySelector("#catagory")
    const comName = document.querySelector("#comName")

    comName.innerHTML = "Company 1"
    gmail.innerHTML = user.email
    catagory.innerHTML = user.tags[0]

    await updateSurveyCount();
    // console.log(user.email)
})

async function updateSurveyCount(){
    let userSurveys = await getSurveysOfCompany(user.id);
    let pollCount = userSurveys.filter((survey) => survey.type == "poll").length;
    document.querySelector("#poll-count").textContent = pollCount;
    document.querySelector("#survey-count").textContent = userSurveys.length - pollCount;
}