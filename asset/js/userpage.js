import { getSurveysForUser, getCompany, addSurveyResults, filterSurveysByTag } from "./db/db.js"

document.addEventListener("DBInitalized", async () => {
    let surveyList = await getSurveysForUser(user.id);
    surveyList.forEach(displaySurveys);
    let tagsList = document.querySelector("#tags-listed");
    Array.from(tagsList.children).forEach(async (link) => {
        link.addEventListener("click", async (e) => {
        document.getElementById('survey-content').innerHTML = "";
            e.preventDefault();
            let tag = e.target.textContent;
            let content = await filterSurveysByTag(tag.toLowerCase());
            content.forEach(displaySurveys);
        })
    })
})

async function respondToPoll(e){
    e.preventDefault()
    const target = this;
    console.log(this);
    let survey_id = parseInt(target.getAttribute("data-id"));
    let action = target.getAttribute("data-action");
    console.log([user.id, survey_id, [action]]);
    await addSurveyResults(user.id, survey_id, [action]);
}

export async function displaySurveys(survey){
    const pollFragment = document.querySelector("#poll-card")
    const surveyFragment = document.querySelector("#survey-card")
    const company = await getCompany(survey.company_id);
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
        instance.querySelector('#number-of-votes').textContent = respondent_message;
        const agreeButton = instance.querySelector('#agree-button')
        agreeButton.setAttribute("data-id", survey.id)
        agreeButton.setAttribute("data-action", "Agree")
        agreeButton.onclick = respondToPoll;

        const disagreeButton = instance.querySelector('#disagree-button')
        disagreeButton.setAttribute("data-id", survey.id)
        disagreeButton.setAttribute("data-action", "Disagree")
        disagreeButton.onclick = respondToPoll;
    } else if (survey.type === "survey"){
        instance.querySelector('a').href = `user_survey.html?id=${survey.id}`;
    }   
    document.getElementById('survey-content').appendChild(instance);
}