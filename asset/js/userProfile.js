import { getSurveysOfUser } from "./db/db.js";

document.addEventListener("DBInitalized", async() => {

    // const edit = document.querySelector("#edit")
    const gmail = document.querySelector("#gmail")
    const fName = document.querySelector("#fName")
    const lName = document.querySelector("#lName")
    const gender = document.querySelector("#gender")
    const date = document.querySelector("#date")
        // comName.value = "Company 1"
        // gmail.value = user.email
        // catagory.value = user.tags[0]
        // console.log(user.email)

    // user_login
    gmail.innerHTML = user.email
    date.innerHTML = user.tags[0]
    fName.innerHTML = "Abdi"
    lName.innerHTML = "De"
    gender.innerHTML = user.tags[1]
        // chckingGender()

    function genderReveal() {

        if (female.checked) {
            return "female"
        } else if (male.checked) {
            return "male"
        }
    }

    function chckingGender() {
        if (user.tags[1] === "male") {
            male.checked = true

        }
        if (user.tags[1] === "female") {
            male.checked = true

        }

    }

    await updateSurveyCount();

    async function updateSurveyCount(){
        let userSurveys = await getSurveysOfUser(user.id);
        let pollCount = userSurveys.filter((survey) => survey.type == "poll").length;
        document.querySelector("#poll-count").textContent = pollCount;
        document.querySelector("#survey-count").textContent = userSurveys.length - pollCount;
    }


})