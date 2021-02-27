import {searchSurveys, user_login} from './db/db.js'
import {displaySurveys} from './companypage.js'

async function search(inp) {
    inp.addEventListener("input", async function(e) {
        console.log("fhsjk")
        let val = this.value;
        let arr = await searchSurveys(val);
        // empty the display list
        document.getElementById('survey-content').innerHTML = ""
        /*for each item in the array...*/
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].company_id === user.id){
                displaySurveys(arr[i]);
            }
            // displaySurveys(arr[i]);
        }
    });
}

search(document.getElementById("search-focus"));