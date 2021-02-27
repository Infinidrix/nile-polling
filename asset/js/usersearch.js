import {searchSurveys} from './db/db.js'
import {displaySurveys} from './userpage.js'


async function search(inp) {
    inp.addEventListener("input", async function(e) {
        let val = this.value;
        let arr = await searchSurveys(val);
        // empty the display list
        document.getElementById('survey-content').innerHTML = ""
        /*for each item in the array...*/
        for (let i = 0; i < arr.length; i++) {
          displaySurveys(arr[i]);
        }
    });
  }
search(document.getElementById("search-focus"));
// console.log(document.querySelector("#search-focus"));