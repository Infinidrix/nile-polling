import { getSurvey, getResultsForSurvey } from "./db/db.js"

const urlParams = new URLSearchParams(window.location.search);
const survey_id = Number(urlParams.get('id'));

document.addEventListener("DBInitalized", async () => {
    
    let survey = await getSurvey(survey_id);
    document.querySelector("#survey-title").innerText = survey.title;

    let results = await getResultsForSurvey(survey_id);
    let resultList = document.querySelector("#results");
    survey.questions.forEach((question, index) => {
        let type = question.type;
        if (type == "option"){
            let options = document.querySelector("#options-card")
            let instance = document.importNode(options.content, true);
            instance.querySelector("#question-title").textContent = `${index + 1}. ${question.questions}`;
            let optionsDict = new Map();
            question.options.forEach((_, optionIndex) => {
                optionsDict.set(optionIndex, 0);
            });
            let totalCount = 0;
            results.forEach(result => {
                optionsDict.set(result.answers[index], optionsDict.get(result.answers[index]) + 1);
                totalCount++;
            });
            let optionsList = instance.querySelector("#options-list")
            let optionsFragment = instance.querySelector("#options-item")
            for (let [option, votes] of optionsDict){
                let optionInstance = document.importNode(optionsFragment.content, true);
                optionInstance.querySelector("#option-value").textContent = question.options[option];
                optionInstance.querySelector("#percent").textContent = Math.round((votes / totalCount) * 100);
                optionsList.appendChild(optionInstance);  
            }
            resultList.appendChild(instance)           
            

        } else {
            let textFragment = document.querySelector("#text-card");
            let instance = document.importNode(textFragment.content, true);

            instance.querySelector("#question-title").innerText = `${index + 1}. ${question.questions}`

            let answerList = instance.querySelector("#answers-list");

            let answerFragment = instance.querySelector("#text-answer");

            results.forEach(result => {
                let answerInstance = document.importNode(answerFragment.content, true);
                answerInstance.querySelector("#answer").innerText = result.answers[index];
                answerList.appendChild(answerInstance);
            });
            resultList.appendChild(instance)
            
        }
    });



    document.querySelectorAll('.pie').forEach(function(pie) {
        var p = parseFloat(pie.textContent);
        var NS = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(NS, "svg");
        var circle = document.createElementNS(NS, "circle");
        circle.setAttribute("r", 16);
        circle.setAttribute("cx", 16);
        circle.setAttribute("cy", 16);
        circle.setAttribute("stroke-dasharray", p + " 100");
        svg.setAttribute("viewBox", "0 0 32 32");
        svg.appendChild(circle);
        pie.textContent = pie.textContent + "% ";
        pie.appendChild(svg);
    });
})