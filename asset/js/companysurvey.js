// ================ variables ================
// constants
let questionCount = 0
let questions = []
let addSurveyButton = `
<div class="row pb-4">
    <div class="col-md-12 text-end" style="flex: right;">
        <i class=" fa fa-plus p-2 " id="add_survey_entry" aria-hidden="true " style="color: white; background-color:#2867B2;border-radius:50% "></i>
    </div>
</div>`

let multipleChoice = `
<div class="row py-3">
    <div class="col-md-6 py-2">
        <input class="form-control  id="option_1" form-control-lg my-1" type="text" placeholder="Option 1" aria-label=".form-control-lg example">
    </div>
    <div class="col-md-6 py-2">
        <input class="form-control  id="option_2" form-control-lg my-1" type="text" placeholder="Option 2" aria-label=".form-control-lg example">
    </div> 
    <div class="col-md-6 py-2">
        <input class="form-control  id="option_3" form-control-lg my-1" type="text" placeholder="Option 3" aria-label=".form-control-lg example">
    </div>
    <div class="col-md-6 py-2">
        <input class="form-control  id="option_4" form-control-lg my-1" type="text" placeholder="Option 4" aria-label=".form-control-lg example">
    </div> 
</div>`

let textReplay = `
<div class="row py-3">
    <div class="col-md-12">
        <input class="form-control  form-control-lg my-1" type="text" placeholder="Enter placeholder for the entry" aria-label=".form-control-lg example">
    </div>
</div>
`


//html elements
let titleAnswer = document.getElementById("title_answer");
let shortDescriptionAnswer = document.getElementById("short_description_answer");
let addSurveyEntry = document.getElementById("add_survey_entry");
let surveyWrapper = document.getElementById("survey_wrapper");
let saveSurveyButton = document.getElementById("save_survey");

// ================ event listeners ================
addSurveyEntry.addEventListener("click", addSurveyEntryFunc); 
surveyWrapper.addEventListener("click", selectAnsweringMethod);
saveSurveyButton.addEventListener("click", saveSurvey);



// ================ functions ================
function addSurveyEntryFunc(e) { // function to add new question entry
    questionCount += 1
    let questionEntry = `
    <div class="px-4 py-5 card body-part postCard polling mb-3" id = "question_${questionCount}">
        <div class="container-fluid " style="color: black;">
            <textarea type="text " class="form-control my-2 mx-2" rows="3" id="answer" placeholder="Question"></textarea>
            <div class="form-check">
                <div class="row py-3">
                    <div class="col-md-12 text-end" style="flex: right;">
                        <div class="dropdown ">
                            <button style="background-color: #2867B2;border:none" class="btn btn-lg  btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                            Responding Method
                            </button>
                            <ul class=" dropdown-menu dropdown-menu-dark " style="background-color: #ffffff; color:black" aria-labelledby=" dropdownMenuButton2 ">
                                <li><button class="dropdown-item active " style="background-color: #ffffff; color:black">Multiple Options</button></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><button class="dropdown-item " style="background-color: #ffffff; color:black">Text Reply</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    let sourceParent = e.target.parentNode.parentNode.parentNode
    e.target.parentNode.parentNode.remove();
    sourceParent.innerHTML += questionEntry + addSurveyButton;
    document.getElementById("add_survey_entry").addEventListener("click", addSurveyEntryFunc); 
    
}

function selectAnsweringMethod(e) { // function to select question responding type
    // console.log(e.target.innerHTML)
    if (e.target.innerHTML === `Multiple Options`){
        e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML = multipleChoice;
    }
    else if (e.target.innerHTML === `Text Reply`){
        e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML = textReplay;
    }
}

function saveSurvey(e) { // function to save survey format to the db
    let questions = []
    for (let i=1; i < questionCount+1; i++){
        let question = document.getElementById("question_" + i);
        if (question.children[0].children[1].children[0].children[0].children[0].innerHTML !== ""){
            alert("Error: You have to chose responding method")
        }else{
            let type = 1
            if (question.children[0].children[1].children[0].children.length === 4){
                type = 4
            }
            // console.log(question.children[0].children[1].children[0].children[i-1].children[0].value)
            let answeringMethodData = []
            for (let j = 0; j < type; j++){
                answeringMethodData.push(question.children[0].children[1].children[0].children[j].children[0].value)
            }

            let questionObj = {
                "question" : question.children[0].children[0].value,
                "type": type,
                "answerMethodData" : answeringMethodData
            }
            questions.push(questionObj)
        }
    }
    let survey = {
        "title" : document.getElementById("title_answer").value,
        "description" : document.getElementById("short_description_answer").value,
        "questions" : questions
    }

    console.log(survey)
}