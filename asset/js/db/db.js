
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
      survey_results: "&[user_id+survey_id],*answers",
      // autoincrementing ID, company_id, type, and an array of questions
      surveys: "++id,company_id,type,*questions"
  });

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
 * @param {String} survey_id - The survey ID
 * @param {Array} answers - An array containing the user response
 * 
 * @returns {Object} The saved survey results object
 */
export async function addSurveyResults(user_id, survey_id, answers){
  let obj = {user_id, survey_id, answers}
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
 * @param {Object} survey - the survey to be saved. In format: {company_id:0, type:"", questions:[]}
 * @returns {Object} The saved suvey
*/
export async function addSurvey(survey){
  try {
    let result = await db.surveys.add(survey);
    return await db.surverys.get(result)
  } catch (e){
    console.error("Adding Survey failed: " + e);
    throw e
  }
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

