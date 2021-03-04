import {getAllCompany, getSurveysForUser, getSurveysOfCompany} from './db/db.js'
import {displaySurveys} from './userpage.js'

document.addEventListener("DBInitalized",()=>{
    loadCompanySidebar();
})


async function loadCompanySidebar(){
    let companies = await getAllCompany();
    let companiesAsideBar = document.getElementById("companies-aside-bar");
    companies.forEach((company)=>{
        companiesAsideBar.insertAdjacentHTML('beforeend', `
    <div class="py-2" id="company_at_aside_${company.id}">
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
document.getElementById(`company_at_aside_${company.id}`).addEventListener('click', async ()=>{
    let companyDetail = `
    <div class="row">
    <div class="col-md12">

        <div class="card py-4 body-part postCard polling mb-3">
            <div class="container-fluid py-3 ">
                <div class="row text-center mb-3 pb-3 ">
                    <div class=" col-md-12  mx-auto d-flex justify-content-center ">
                        <img class="profile_user  me-2 text-center  " style="flex: right;" src="asset/image/company.png " alt="profile image ">
                    </div>
                </div>

                <div class="row  mb-3 mt-4 ">
                    <div class="col-md-4">
                        <h5>
                            CompanyName:
                        </h5>
                    </div>
                    <div class="col-md-8">
                        <h5 id="company_detail-company_name">
                            AAiT
                        </h5>
                    </div>
                </div>

                <div class="row my-3">
                    <div class="col-md-4">
                        <h5>
                            Gmail:
                        </h5>
                    </div>
                    <div class="col-md-8">
                        <h5 id="company_detail-company_email">
                            admin@aait.com
                        </h5>
                    </div>

                </div>
                <div class="row my-3">
                    <div class="col-md-4">
                        <h5>
                            Category:
                        </h5>
                    </div>
                    <div class="col-md-8">
                        <h5 id="company_detail-company_tag">
                            Education
                        </h5>
                    </div>

                </div>
            </div>
        </div>

    </div>
</div>
    `
    document.getElementById('survey-content').innerHTML = companyDetail;
    document.getElementById('company_detail-company_name').innerHTML = company.name
    document.getElementById('company_detail-company_email').innerHTML = company.email
    document.getElementById('company_detail-company_tag').innerHTML = company.tags[0]
    await drawSurveysOfCompaniesForUser(company.id)
})
    })
}

async function drawSurveysOfCompaniesForUser(company_id){
    let surveyList = await getSurveysOfCompany(company_id);
    console.log(surveyList)
    surveyList.forEach(displaySurveys);
}