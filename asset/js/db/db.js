
let db;
export async function init(){
  db = new Dexie("Survey And Polling");
  db.version(1).stores({
      users: "++id,[&email+password],type,*tags",
      survey_results: "&[user_id+survey_id],*answers",
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

export async function addUser(user){
  try {
    let result = await db.users.add(user);
    return await db.users.get(result)
  } catch (e){
    if (e.name === "ConstraintError"){
      console.error("You're using a duplicate email");
      throw new Error("You're using a duplicate email");
    } else {
      console.error("Adding User failed: " + e);
      throw e
    }
  }
}

export async function user_login(email, password){
  let result = await db.users
    .where({email, password}).first();
  
  console.debug(result ? "User Logged in" : "Login Failed");
  return result;
}

export async function addSurveyResults(user_id, survey_id, answers){
  let obj = {user_id, survey_id, answers}
  try {
    let result = await db.survey_results.add(obj);
    return await db.survey_results.get(result);
  } catch (e){
    if (e.name === "ConstraintError"){
      let result = await db.survey_results.update({user_id, survey_id}, obj);
      return await db.survey_results.get({user_id, survey_id});
    } else {
      console.error("Adding Survey failed: " + e);
      throw e
    }
  }
}


/** Adds a survey object to the db
 * @param survey - an object with format {company_id:0, type:"", questions:[]}
*/
export async function addSurvey(survey){
  try {
    let result = await db.surveys.add(survey);
    console.debug(result);
  } catch (e){
    console.error("Adding Survey failed: " + e);
    throw e
  }
}

export async function testDB(){
  await init();
  try {
    console.debug(await addUser({
      email: "se.boos.solomon@gmail.com",
      password: "amazingPassword",
      type: "user",
      tags: ["education", "economics"]
    }));
    console.log(await addSurveyResults(1, 2, ["hey", 2, "pewpew"]));
  } catch (e) { console.log("User already added\n" + e); }
  await user_login("se.biruk.solomon@gmail.com", "amazingPassword");
}

