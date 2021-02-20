import { getSurveysOfCompany, getAgreeForSurvey } from "./db/db.js"
document.addEventListener("DBInitalized", async () => {
    let surveyList = await getSurveysOfCompany(user.id);

    const pollFragment = document.querySelector("#poll-card")
    const surveyFragment = document.querySelector("#survey-card")
    surveyList.forEach(async (survey) => {
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
        }   
        document.getElementById('survey-content').appendChild(instance);
    });
})

async function calculatePercent(survey){
    return (await getAgreeForSurvey(survey.id)).length / survey.respondents.length;
}