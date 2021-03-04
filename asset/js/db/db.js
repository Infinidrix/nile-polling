
let db;
/**
 * Initiaized the DB
 */
export async function init(){
  db = new Dexie("Survey And Polling");
  // creates the DB stores
  db.version(1).stores({
      // autoincrementing ID, unique email, password, email and password indexed together for login, types and an array of tags
      users: "++id,[&email+password],type,*tags", 
      // user_id and survey_id as a compound primary key, and an array of answers
      survey_results: "&[user_id+survey_id],*answers,date",
      // autoincrementing ID, company_id, type, date, title, an array of tags, an array of questions, and the list of users that responded to it
      surveys: "++id,company_id,type,date,title,*tags,*questions,*respondents"
  });

  // if the db is empty it will populate with dummy data
  db.on("populate", populateDB);

  try {
    await db.open()
    console.debug("DB Opened succesfully");   
  } catch (e) {
    console.error("Open failed: " + e);
    throw e;
  }
}

/**
 * Adds a user to the DB
 * @param {Object} user - the user object in format: {email: "", password: "", type: "user" or "company", tags: [], properties: {}}
 * 
 * @returns {Promise<Object>} the saved user object
 * 
 * @throws An error in case of a duplicate email
 */
export async function addUser(user){
  try {
    let result = await db.users.add(user);
    return await db.users.get(result)
  } catch (e){
    // checks if the error is because of the email
    if (e.name === "ConstraintError"){
      console.error("You're using a duplicate email");
      return null;
    } else {
      console.error("Adding User failed: " + e);
      throw e
    }
  }
}

/**
 * Checks if the email and password combination exists in the DB
 * @param {String} email 
 * @param {String} password 
 * 
 * @returns {Promise<Object | null>} null if user doesn't exist otherwise the saved user object
 */
export async function user_login(email, password){
  let result = await db.users
    .where({email, password}).first();
  
  console.debug(result ? "User Logged in" : "Login Failed");
  return result || null;
}

export async function getAllCompany(){
  let allUsers = await db.users.toArray()
  let companies = []
  allUsers.forEach((usr)=>{
    if (usr.type === 'company'){
      companies.push(usr)
    }
    console.log(usr.type === 'company')
  })
  return companies;
}

export async function getCompany(company_id){
  return await db.users.get(company_id)
}
/**
 * 
 * @param {String} query - search query
 * 
 * @returns {Promise<Array<Object>>} - array of survey object that start with the query string 
 */
export async function searchSurveys(query){
  return await db.surveys.where('title')
    .startsWithIgnoreCase(query)
    .toArray()
}
// test for the above function
// setTimeout(() => searchSurveys("Increase").then(console.log), 2000)

/**
 * 
 * @param {String} query - search query
 * @param {Number} company_id - the ID of the company
 * 
 * @returns {Promise<Array<Object>>} - array of survey object that start with the query string that belongs to the company
 */
export async function searchSurveysOfCompany(query, company_id){
  return await db.surveys.where('title')
    .startsWithIgnoreCase(query)
    .filter((survey) => survey.company_id === company_id)
    .toArray()
}
// test for the above function
// setTimeout(() => searchSurveysOfCompany("Increase", 6).then(console.log), 2000)

/**
 * 
 * @param {String} query - search query
 * @param {Number} user_id - the ID of the user
 * 
 * @returns {Promise<Array<Object>>} - array of survey object that start with the query string that the user hasn't responded to
 */
export async function searchSurveysForUser(query, user_id){
  return await db.surveys.where('title')
    .startsWithIgnoreCase(query)
    .filter((survey) => !survey.respondents.includes(user_id))
    .toArray()
}
// test for above function
// setTimeout(() => searchSurveysForUser("Increase", 2).then(console.log), 2000)

/**
 * List surveys that have a certain tag
 * 
 * @param {String} tag  - The tag that you want to filter surveys by
 * 
 * @returns {Promise<Array<Object>>} - Array of surveys created by companies that have the requested tag
 */
export async function filterSurveysByTag(tag){
  var companiesWithTag = (await db.users.where("tags")
    .equals(tag)
    .distinct()
    .filter((user) => user.type === "company")
    .toArray())
    .map((user) => user.id);

    return await db.surveys.where("company_id")
    .anyOf(companiesWithTag)
    .distinct()
    .toArray();
}
// Test for the above function
// setTimeout(() => filterSurveysByTag("gaming").then(console.log), 2000)

/**
 * Saves survey results, creating them if they don't exist
 * or updating them if there was a previous response
 * 
 * @param {Number} user_id - The user ID
 * @param {Number} survey_id - The survey ID
 * @param {Array<String|Number>} answers - An array containing the user response
 * 
 * @returns {Promise<Object>} The saved survey results object
 */
export async function addSurveyResults(user_id, survey_id, answers){
  let obj = {user_id, survey_id, answers, date: new Date()};
  try {
    // add the survey results
    let result = await db.survey_results.add(obj);
    let survey = await db.surveys.get(survey_id);
    survey.respondents.push(user_id);
    await db.surveys.update(survey_id, survey);
    console.log(await db.surveys.get(survey_id));
    return await db.survey_results.get(result);
  } catch (e){
    // if the error is because of a duplicate primary key then it will update it
    if (e.name === "ConstraintError"){
      let result = await db.survey_results.update({user_id, survey_id}, obj);
      return await db.survey_results.get({user_id, survey_id});
    } else {
      console.warn("Adding Survey failed: " + e);
      throw e
    }
  }
}


/** Adds a survey object to the db,
 * @param {Object} survey - the survey to be saved. In format: {company_id:0, type:"", questions:[], date: new Date(), respondents: []}
 * @returns {Promise<Object>} The saved suvey
*/
export async function addSurvey(survey){
  try {
    let result = await db.surveys.add(survey);
    return await db.surveys.get(result)
  } catch (e){
    console.error("Adding Survey failed: " + e);
    throw e
  }
}
/**
 * Gets surveys that the user hasn't responded to yet - to be used for the user homepage
 * @param {Number} user_id - The user ID 
 * 
 * @returns {Promise<Array<Object>>} List of survey objects
 */
export async function getSurveysForUser(user_id){
    return await db.surveys.where("respondents")
      .notEqual(user_id)
      .distinct()
      .filter(function (survey) {
        return !survey.respondents.includes(user_id);
      })
      .reverse()
      .sortBy("date");
}

/**
 * Gets surveys that the user has responded - to be used for the user profile page if necessary
 * @param {Number} user_id - The user ID 
 * 
 * @returns {Promise<Array<Object>>} List of survey objects
 */
export async function getSurveysOfUser(user_id){
  return await db.surveys.where("respondents")
    .equals(user_id)
    .distinct()
    .reverse()
    .sortBy("date");
}

/**
 * Gets surveys that the company has created
 * @param {Int} company_id - The ID of the company
 * 
 * @returns {Promise<Array<Object>>} list of survey objects
 */
export async function getSurveysOfCompany(company_id){
  return await db.surveys.where("company_id")
    .equals(company_id)
    .distinct()
    .reverse()
    .sortBy("date");
}

export async function getResultsForSurvey(survey_id){
  return await db.survey_results.where('[user_id+survey_id]').between(
    [Dexie.minKey, survey_id],
    [Dexie.maxKey, survey_id])
    .filter(result => result.survey_id == survey_id)
    .toArray();
}

export async function getAgreeForSurvey(survey_id){
  return await db.survey_results.where('[user_id+survey_id]').between(
    [Dexie.minKey, survey_id],
    [Dexie.maxKey, survey_id])
    .filter(result => result.answers[0] == "Agree" && result.survey_id == survey_id)
    .toArray();
}
/**
 * 
 * @param {Number} survey_id 
 * 
 * @returns {Promise<Object>} the survey object with that ID
 */
export async function getSurvey(survey_id){
  return await db.surveys.get(survey_id)
}

/**
 * A function to test the DB
 */
export async function testDB(){
  await init();
  try {
    console.debug(await addUser({
      email: "se.boos.solomon@gmail.com",
      password: "amazingPassword",
      type: "user",
      tags: ["education", "economics"]
    }));
    console.debug(await addSurveyResults(1, 2, ["hey", 2, "pewpew"]));
  } catch (e) { 
    console.log("User already added\n" + e); 
  }
  await user_login("se.biruk.solomon@gmail.com", "amazingPassword");
}

function hashCode(str) { // function to hash the users password
  let hash = 0, i, chr;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

async function populateDB(){
  await addUser({email: "se.biruk.solomon@gmail.com", password:hashCode("LifeIsShort"), type:"user", tags: ["education", "economics"]});
  await addUser({email: "se.hanan.miftah@gmail.com", password:hashCode("SuperSecurePassword"), type:"user", tags: ["education", "health"]});
  await addUser({email: "se.natneam.mesele@gmail.com", password:hashCode("DuplicatePassword"), type:"user", tags: ["education", "phliosophy"]});
  await addUser({email: "se.abdulfeta.dedgba@gmail.com", password:hashCode("DuplicatePassword"), type:"user", tags: ["education", "gaming", "business"]});
  await addUser({name: "Company 1", email: "marketer@company.org", password:hashCode("BusinessCasual"), type:"company", tags: ["gaming", "economics"]});
  await addUser({name: "Company 2",email: "ngo@charity.com", password:hashCode("HelpEveryone"), type:"company", tags: ["education", "health"]});
  await addSurvey({company_id: 5, type:"poll", date: new Date(2020, 12, 3), title:"Do you think that games are good for the economy", respondents: [0]});
  await addSurvey({company_id: 6, type:"poll", date: new Date(2020, 12, 4), title:"Would you consider participating in a fundraiser for building better school facilites for underprevilaged kids", respondents: [0]});
  await addSurvey({company_id: 5, type:"poll", date: new Date(2020, 12, 5), title:"Would you be interested in working in a game development company if training is provided", respondents: [0]});
  await addSurvey({company_id: 6, type:"poll", date: new Date(2020, 12, 6), title:"Increase government budget for public hospitals!!", respondents: [0]});
  await addSurvey({company_id: 5, type:"survey", date: new Date(2020, 12, 6, 4), 
    title:"Would you play games developed by Ethiopians", 
    description: "How do you feel about playing games by Ethiopians for Ethiopians. We're talking about fighting through Adwa and playing yegena chewata",
    questions:[
      {type:"option", questions: "Have you tried Ethiopian games before", options:["Yes", "No"]},
      {type:"text", questions: "What do you feel about the quality of games that Ethiopian publishers can provide", options:[]},
    ],
    respondents: [0]
  });
  await addSurvey({company_id: 6, type:"survey", date: new Date(2020, 12, 6, 4), 
    title:"What's the health coverage like in Ethiopia", 
    description: "We want to know about any difficulties or good results you've had from public hospitals in Ethiopia",
    questions:[
      {type:"option", questions: "Have you ever been to a public hospital in Ethiopia", options:["Yes", "No"]},
      {type:"text", questions: "How was the quality of the doctors", options:[]},
      {type:"text", questions: "How was the quality of other staff", options:[]},
      {type:"text", questions: "How was the quality of the equipment", options:[]},
      {type:"text", questions: "How was the overall experience", options:[]},
    ],
    respondents: [0]
  });  
  await addSurveyResults(4, 1, ["Agree"]);
  await addSurveyResults(1, 1, ["Disagree"]);
  await addSurveyResults(4, 5, [0, "I don't feel like it's in a good place now but there's a lot of room to improve and I'd be glad to play and test them out."]);
}