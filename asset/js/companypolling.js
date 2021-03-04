// =============== imports =================
import {addSurvey, getSurveysOfCompany} from './db/db.js'


//html variables

let saveButton = document.querySelector("#save_poll")
let pollingIdea = document.querySelector("#polling_idea_answer")

saveButton.addEventListener('click', savePoll)

function savePoll(){
    let survey = {
        "company_id" : window.user.id,
        "title" : pollingIdea.value,
        "date" : new Date(),
        "respondents" : [0],
        "type" : "poll",
        "tags" : user.tags
    }
    try{
        addSurvey(survey)
            .then((result)=>{
                console.log(result)
                history.back()
            }, (result)=>{
                console.log("error" + result)
            });
    }catch(e){
        console.log("Check this error: " + e)
    }
}

async function updateSurveyCount(){
    let userSurveys = await getSurveysOfCompany(user.id);
    let pollCount = userSurveys.filter((survey) => survey.type == "poll").length;
    document.querySelector("#poll-count").textContent = pollCount;
    document.querySelector("#survey-count").textContent = userSurveys.length - pollCount;
}