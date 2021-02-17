
let db;
/**
 * Initiaized the DB
 */
export async function init(){
  db = new Dexie("Survey And Polling");
  console.log("GOT HERE");
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
    console.log(await getSurveysOfUser(4))
  } catch (e) {
    console.error("Open failed: " + e);
    throw e;
  }
}

/**
 * Adds a user to the DB
 * @param {Object} user - the user object in format: {email: "", password: "", type: "user" or "company", tags: []}
 * 
 * @returns {Object} the saved user object
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
      throw new Error("You're using a duplicate email");
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
 * @returns {Object | null} null if user doesn't exist otherwise the saved user object
 */
export async function user_login(email, password){
  let result = await db.users
    .where({email, password}).first();
  
  console.debug(result ? "User Logged in" : "Login Failed");
  return result;
}

/**
 * Saves survey results, creating them if they don't exist
 * or updating them if there was a previous response
 * 
 * @param {Number} user_id - The user ID
 * @param {Number} survey_id - The survey ID
 * @param {Array<String|Number>} answers - An array containing the user response
 * 
 * @returns {Object} The saved survey results object
 */
export async function addSurveyResults(user_id, survey_id, answers){
  let obj = {user_id, survey_id, answers, date: new Date()};
  try {
    // add the survey results
    let result = await db.survey_results.add(obj);
    return await db.survey_results.get(result);
  } catch (e){
    // if the error is because of a duplicate primary key then it will update it
    if (e.name === "ConstraintError"){
      let result = await db.survey_results.update({user_id, survey_id}, obj);
      return await db.survey_results.get({user_id, survey_id});
    } else {
      console.error("Adding Survey failed: " + e);
      throw e
    }
  }
}


/** Adds a survey object to the db,
 * @param {Object} survey - the survey to be saved. In format: {company_id:0, type:"", questions:[], date: new Date(), respondents: []}
 * @returns {Object} The saved suvey
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
 * @returns {Array<Object>} List of survey objects
 */
export async function getSurveysForUser(user_id){
    return await db.surveys.where("respondents")
      .notEqual(user_id)
      .distinct()
      .reverse()
      .sortBy("date")
}

/**
 * Gets surveys that the user has responded - to be used for the user profile page if necessary
 * @param {Number} user_id - The user ID 
 * 
 * @returns {Array<Object>} List of survey objects
 */
export async function getSurveysOfUser(user_id){
  return await db.surveys.where("respondents")
    .equals(user_id)
    .distinct()
    .reverse()
    .sortBy("date")
}

/**
 * Gets surveys that the company has created
 * @param {Int} company_id - The ID of the company
 * 
 * @returns {Array<Object>} list of survey objects
 */
export async function getSurverysOfCompany(company_id){
  return await db.surveys.where("company_id")
    .equals(company_id)
    .distinct()
    .reverse()
    .sortBy("date")
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

function populateDB(){
  addUser({email: "se.biruk.solomon@gmail.com", password:"LifeIsShort", type:"user", tags: ["education", "economics"]});
  addUser({email: "se.hanan.miftah@gmail.com", password:"SuperSecurePassword", type:"user", tags: ["education", "health"]});
  addUser({email: "se.natneam.mesele@gmail.com", password:"DuplicatePassword", type:"user", tags: ["education", "phliosophy"]});
  addUser({email: "se.abdulfeta.dedgba@gmail.com", password:"DuplicatePassword", type:"user", tags: ["education", "gaming", "business"]});
  addUser({email: "marketer@company.org", password:"BusinessCasual", type:"company", tags: ["gaming", "economics"]});
  addUser({email: "ngo@charity.com", password:"HelpEveryone", type:"company", tags: ["education", "health"]});
  addSurvey({company_id: 5, type:"poll", date: new Date(2020, 12, 3), title:"Do you think that games are good for the economy", respondents: [0, 1, 4]});
  addSurvey({company_id: 6, type:"poll", date: new Date(2020, 12, 4), title:"Would you consider participating in a fundraiser for building better school facilites for underprevilaged kids", respondents: [0]});
  addSurvey({company_id: 5, type:"poll", date: new Date(2020, 12, 5), title:"Would you be interested in working in a game development company if training is provided", respondents: [0]});
  addSurvey({company_id: 6, type:"poll", date: new Date(2020, 12, 6), title:"Increase government budget for public hospitals!!", respondents: [0]});
  addSurvey({company_id: 5, type:"survey", date: new Date(2020, 12, 6, 4), 
    title:"Would you play games developed by Ethiopians", 
    description: "How do you feel about playing games by Ethiopians for Ethiopians. We're talking about fighting through Adwa and playing yegena chewata",
    questions:[
      {type:"option", questions: "Have you tried Ethiopian games before", options:["Yes", "No"]},
      {type:"text", questions: "What do you feel about the quality of games that Ethiopian publishers can provide", options:[]},
    ],
    respondents: [4]
  });
  addSurvey({company_id: 6, type:"survey", date: new Date(2020, 12, 6, 4), 
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
  addSurveyResults(4, 1, ["Agree"]);
  addSurveyResults(1, 1, ["Disagree"]);
  addSurveyResults(4, 5, [0, "I don't feel like it's in a good place now but there's a lot of room to improve and I'd be glad to play and test them out."]);
}