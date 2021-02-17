import { init } from "./db/db.js";

let user;
document.addEventListener("DOMContentLoaded", () => {
    checkUserLogin();
    init();
});


export function checkUserLogin(){
    user = localStorage.getItem("user")
    if (user == null){
        window.location.href = "index.html"
    }else {
        user = JSON.parse(user)
    }
    return user;
}