import {filterSurveysByTag, displaySurveys} from './db/db.js'
log = console.log
// UI variables

let gaming_tag  = document.getElementById("groups-you-are-interested-in-1")
let economics_tag  = document.getElementById("groups-you-are-interested-in-2")
let health_tag  = document.getElementById("groups-you-are-interested-in-3")
let education_tag  = document.getElementById("groups-you-are-interested-in-4")


gaming_tag.addEventListener('click', filterAndDisplay("gaming"));



async function filterAndDisplay(tag){
    let surveys = await filterSurveysByTag(tag);
    console.log(survey)
    document.getElementById('survey-content').innerHTML = ''
    surveys.forEach((survey)=>{
        displaySurveys(survey)
    }
    )
}
