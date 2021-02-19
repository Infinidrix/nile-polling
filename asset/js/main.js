import { init } from "./db/db.js";

document.addEventListener("DOMContentLoaded", () => {
    checkUserLogin();
    init();
});


export function checkUserLogin(){
    let user = localStorage.getItem("user")
    if (user == null){
        window.location.href = "index.html"
    }else {
        window.user = JSON.parse(user)
    }
}