import { getSurvey } from "./db/db.js"
const urlParams = new URLSearchParams(window.location.search);
const survey_id = Number(urlParams.get('id'));

document.addEventListener("DBInitalized", async () => {
    let survey = await getSurvey(survey_id);
    if (!survey){
        console.warn("survey id not found " + survey_id);
    }

    let title = survey.title;
    let description = survey.description;
    document.querySelector("#survey-title").textContent = title;
    document.querySelector("#survey-description").textContent = description;


    let answers = [];
    const optionFragment = document.querySelector("#option-card");
    const textFragment = document.querySelector("#text-card");
    const questionList = document.querySelector("#question-list");
    survey.questions.forEach(question => {
        if (question.type === "option"){
            let instance = document.importNode(optionFragment.content, true);
            let questionTitle = question.questions;
            instance.querySelector("h4").textContent = questionTitle;
            let choiceFragment = instance.querySelector("#option-item");
            let optionsList = instance.querySelector("#options-list");
            question.options.forEach(option => {
                let choiceInstance = document.importNode(choiceFragment.content, true);
                choiceInstance.querySelector("#option-text").textContent = option;
                optionsList.appendChild(choiceInstance);
            })
            questionList.appendChild(instance);
            answers.push({type: "option", loc: optionsList});
        } else if (question.type === "text"){
            let instance = document.importNode(textFragment.content, true);
            let questionTitle = question.questions;
            instance.querySelector("h4").textContent = questionTitle;
            questionList.appendChild(instance);
            answers.push({type: "text", loc: instance.querySelector("textarea")});
        }
    });
})