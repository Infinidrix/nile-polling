import { addSurveyResults, getSurvey } from "./db/db.js"
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
            let textarea = instance.querySelector("textarea")
            instance.querySelector("h4").textContent = questionTitle;

            questionList.appendChild(instance);
            answers.push({type: "text", loc: textarea});
        }
    });

    console.log(answers)


    document.querySelector("#submit-button").onclick = async () => {
        let answerValues = []
        for (const answer of answers){
            if (answer.type === "option"){
                let selectedOption = answer.loc.querySelector("input[name=flexRadioDefault]:checked")
                if (!selectedOption){
                    // add better highlighting of error
                    answer.loc.style.border = "2px solid red"
                    return null
                }
                let answerNode = selectedOption.parentElement
                // get the index of the answer
                let answerValue = [].indexOf.call(answerNode.parentElement.children, answerNode)
                answerValues.push(answerValue - 1)
            } else if (answer.type === "text"){
                answerValues.push(answer.loc.value)
            } else {
                console.log("Unknown answer type found " + answer.type)
            }
        }
        await addSurveyResults(user.id, survey.id, answerValues)
        history.back()
    }
})