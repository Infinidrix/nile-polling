import { checkUserLogin } from "./main.js"
import { getSurveysForUser, getCompany } from "./db/db.js"

let user;
document.addEventListener("DOMContentLoaded", async () => {
    user = checkUserLogin();

    let surveyList = await getSurveysForUser(user.id);

    const pollFragment = document.querySelector("#poll-card")
    const surveyFragment = document.querySelector("#survey-card")
    surveyList.forEach(async (survey) => {
        const company = await getCompany(survey.company_id);
        const respondents = survey.respondents.length
        const respondent_message = (respondents == 0) ? "No users have responded" : (respondents == 1) ? "1 user has responded" : `${respondents} users have responded`;
        const date_message = `${Math.round((new Date().getTime() - survey.date.getTime()) / (1000 * 3600 * 24))} days ago`
        let instance;
        if (survey.type == "poll"){
            instance = document.importNode(pollFragment.content, true);
            // Add relevant content to the template
            instance.querySelector('#company-name').textContent = company.email;
            instance.querySelector('#poll-date').textContent = date_message;
            instance.querySelector('#poll-question').textContent = survey.title;
            instance.querySelector('#number-of-votes').textContent = respondent_message;
            // Append the instance ot the DOM
            document.getElementById('survey-content').appendChild(instance);
        }      
    });

})