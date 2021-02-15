
let db;
export async function init(){
  //
  // Declare Database
  //
  db = new Dexie("Survey And Polling");
  db.version(1).stores({
      users: "++id,&email,password,type,*tags",
      survey_results: "++id,user_id,survey_id,*answers",
      surveys: "++id,company_id,type,*questions"
  });

  try {
    await db.open()
    console.debug("DB Opened succesfully");   
  } catch (e) {
    console.error("Open failed: " + e);
    throw error;
  }
}

export async function addUser(user){
  try {
    let result = await db.users.add(user);
    console.debug(result);
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
    .where({email, password}).first()
    //.and("password").equals(password);
  console.debug(result);
}

export async function testDB(){
  await init();
  // await addUser({
  //   email: "se.biruk.solomon@gmail.com",
  //   password: "amazingPassword",
  //   type: "user",
  //   tags: ["education", "economics"]
  // });
  await user_login("se.biruk.solomon@gmail.com", "amazingPassword");
}

