import {getAllCompany} from './db/db.js'

document.addEventListener("DBInitalized",()=>{
    loadCompanySidebar();
})


async function loadCompanySidebar(){
    let companies = await getAllCompany();
    let companiesAsideBar = document.getElementById("companies-aside-bar");
    companies.forEach((company)=>{
        console.log(company)
        companiesAsideBar.insertAdjacentHTML('beforeend', `
    <div class="py-2">
        <div class="row w-100 py-2 mx-0 px-0" style="border-top: solid rgba(95, 92, 92, 0.2) 1px; border-bottom: solid  rgba(95, 92, 92, 0.1) 1px ;border-radius:10%">
            <div class="col-md-4 mx-0 px0 ">
                <img class="dashProfile img-fluid mx-0 px-0 " src="asset/image/company.png " alt="profile image ">
            </div>
            <div class="col-md-8 ">
                <h4 class="h4 py-1 text-start dashName p-0 m-0 ms-2">${company.name}</h4>
                <h6 class="h6 text-start cont ">${company.email}</h6>
            </div>
        </div>
    </div>
`);
    })
    
    
    console.log("I'm here")
}