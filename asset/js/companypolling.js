// =============== imports =================
import {addSurvey} from './db/db.js'


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