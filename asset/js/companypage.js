import { getSurveysOfCompany, getAgreeForSurvey, closeSurveyByID, deleteSurveyByID, openSurveyByID } from "./db/db.js"
document.addEventListener("DBInitalized", async () => {
    let surveyList = await getSurveysOfCompany(user.id);

    const pollFragment = document.querySelector("#poll-card")
    const surveyFragment = document.querySelector("#survey-card")
    surveyList.forEach(displaySurveys);
})

async function calculatePercent(survey){
    return (await getAgreeForSurvey(survey.id)).length / survey.respondents.length;
}

export async function displaySurveys(survey){
    const pollFragment = document.querySelector("#poll-card")
    const surveyFragment = document.querySelector("#survey-card")
    const company = user;
    const respondents = survey.respondents.length
    const respondent_message = (respondents == 0) ? "No users have responded" : (respondents == 1) ? "1 user has responded" : `${respondents} users have responded`;
    const date_message = `${Math.round((new Date().getTime() - survey.date.getTime()) / (1000 * 3600 * 24))} days ago`
    let instance;
    instance = document.importNode((survey.type === "poll") ? pollFragment.content : surveyFragment.content, true);
    // Add relevant content to the template
    instance.querySelector('#company-name').textContent = company.email;
    instance.querySelector('#poll-date').textContent = date_message;
    instance.querySelector('#poll-question').textContent = survey.title;
    if (survey.type === "poll"){
        const agreePercent = await calculatePercent(survey); 
        instance.querySelector('#number-of-votes').textContent = respondent_message;
        instance.querySelector("#agree-number").textContent = `${Math.round(agreePercent * 100)}% Agree`
        instance.querySelector("#disagree-number").textContent = `${Math.round((1 - agreePercent) * 100)}% Disagree`
    } else {
        instance.querySelector("#surveyC").href = "survey_dashboard.html?id=" + survey.id;
    }
    let closeBtn = instance.querySelector("#close-btn")
    if (survey.closed){
        closeBtn.textContent = "Open";
    }
    closeBtn.onclick = async() => chooseAction(closeBtn, survey.id)
    instance.querySelector("#delete-btn").onclick = async () => await deleteSurvey(survey.id);
    document.getElementById('survey-content').appendChild(instance);
}

async function chooseAction(btn, id){
    if (btn.textContent == "Open"){
        btn.textContent = "Close";
        await closeSurvey(id)
    } else {
        btn.textContent = "Open";
        await openSurvey(id)
    }

}

async function closeSurvey(id){
    console.log("This is the close button for id " + id);

    console.log(await closeSurveyByID(id));
    
}
async function openSurvey(id){
    console.log("This is the open button for id " + id);

    console.log(await openSurveyByID(id));
    
}
async function deleteSurvey(id){
    console.log("This is the delete button for id " + id);


    return await deleteSurveyByID(id);
}