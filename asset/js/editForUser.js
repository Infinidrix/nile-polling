import { addUser, init, testDB, user_login } from './db/db.js';

document.addEventListener("DBInitalized", async() => {

    // const edit = document.querySelector("#edit")
    const gmail = document.querySelector("#gmail")
    const fName = document.querySelector("#fName")
    const lName = document.querySelector("#lName")
    const female = document.querySelector("#female")
    const male = document.querySelector("#male")
    const date = document.querySelector("#date")
    const svae = document.querySelector("#svae")
        // comName.value = "Company 1"
        // gmail.value = user.email
        // catagory.value = user.tags[0]
        // console.log(user.email)

    // user_login
    console.log(user.email)
    gmail.value = user.email
    date.value = user.tags[0]
    fName.value = "Abdi"
    lName.value = "De"
    save.addEventListener("click", saveUser)
    chckingGender()

    await updateSurveyCount();

    function saveUser(e) {
        //   burra function
        let user = await addUser({
            email: email,
            password: pass,
            type: "user",
            tags: [date.value, genderReveal(), fName.value, lName.value]
        })
    }

    function genderReveal() {

        if (female.checked) {
            return "female"
        } else if (male.checked) {
            return "male"
        }
    }

    function chckingGender(gender) {
        if (user.tags[1] === "male") {
            male.checked = true

        }
        if (user.tags[1] === "female") {
            male.checked = true

        }

    }

    async function updateSurveyCount(){
        let userSurveys = await getSurveysOfUser(user.id);
        let pollCount = userSurveys.filter((survey) => survey.type == "poll").length;
        document.querySelector("#poll-count").textContent = pollCount;
        document.querySelector("#survey-count").textContent = userSurveys.length - pollCount;
    }

})