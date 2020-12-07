const {Client} = require('pg');
const express = require('express');
const ejs = require('ejs');
const path = require('path')

/************************************************************************************************
 ********* Configuring the server
 ***********************************************************************************************/
// initialize the webserver  
const app = express();
// set the html engine, so that the app could serve html files 
app.engine('html', ejs.renderFile);
//tell the app which folder to use to get the html files
app.set ('views', path.join(__dirname, '../frontend/'));
// tell the app which folder to use to look for js and css files
app.use(express.static(path.join(__dirname, '../frontend/')));
// tell the app to use json middleware 
app.use(express.json());
// start the server on port 8000
app.listen(8000);
// use this boolen flag to track if a user is logged in. (In real word, session should be used. Here it's just for simplicity)
let userIsLoggedIn = false;
// database client 
const client = new Client({
    user: "caps", // use your own database username
    host: "localhost",
    password: "fnatic", // use your own database password
    database: "stats",
    port: 5432 // the default port postgres server runs at is 5432
})
client.connect(); // connect to the postgres server
console.log("database ostencibly connected");

/************************************************************************************************
 ********* setup the request path
 ***********************************************************************************************/
// in the default root path, the app would serve the login page 
app.get('/', handleGetRoot);

// in /pokemon path, the app will serve the pokemon html page
// you could build your own path
//app.get('/pokemon', handleGetPokemons);
app.get('/edit', handleEditPage);

// handle user post data to the login path
app.post('/login', handleLoginRequest);

app.post('/editdb', handleEditRequest);
// handle user request pokemon data 
app.get('/data', getData);

// handle new card creation 
//app.post('/newPokemonCard', createNewPokemonCard);


/************************************************************************************************
 ********* handler functions
 ***********************************************************************************************/
// handle get request to default root path 
function handleGetRoot(req, res) {
    console.log("Getting the default root path ...");
    // render the login page back to the browser to let user login 
    userIsLoggedIn = false;
    res.render("data.html"); 
}

async function handleEditRequest(req, res) {
    console.log(req.body);
    if (!userIsLoggedIn) {
        res.json({success: false});
        return;
    }
    let team = req.body.teamName;
    let stat = req.body.stat;
    let newValue = req.body.newVal;
    let query = "select * from footballstats where name = '" + team + "';";
    console.log(query)
    let result = await client.query(query);
    console.log(newValue);

    //console.log(result);
    // process the result and get back to the client accordingly 
    if (result == null || result == undefined || result.rows == undefined || result.rows.length  <= 0){
        res.json({success: false}); 
    }
    else {
        query = "update footballstats set " + stat + " = " + newValue  + " where name =  '" + team + "';";
        result = await client.query(query);
        res.json({success:true});
        console.log("Database successfuly updated!");
    }
}

function handleEditPage(req, res) {
    if (!userIsLoggedIn) {
        res.render('data.html');
    } else {
        res.render('edit.html');
    }
}

// handle post request to the /login path 
async function handleLoginRequest(req, res) {
    //console.log(req.body);
    // construct the query 
    let email = req.body.email;
    let password = req.body.password;
    let query = "select * from users where email ='" + email + "' and password = '" + password + "';";
    console.log("Query: " + query);

    // query the database and wait for the result
    let result = await client.query(query);

    //console.log(result);
    // process the result and get back to the client accordingly 
    if (result == null || result == undefined || result.rows == undefined || result.rows.length  <= 0) {
        res.json({success: false}); 
    }
    else {
        console.log("Successfuly logged in!");
        userIsLoggedIn = true;
        res.json({success:true});
        //res.render("edit.html")
    }

}

// handle request asking for data 
 async function getData(req, res) {
     // construct the query 
    console.log(req.body);
    let query = "select * from footballstats;";
    console.log(query)

     // query the database and wait for the result

     let result = await client.query(query);

    // process the result and get back to the client accordingly 
    //console.log(result);
    if (result == null || result == undefined || result.rows == undefined || result.rows.length  <= 0) {
        res.json({success: false}); 
    }
    else {
        res.json({success:true, data:result.rows});
    }
    //res.send(result.rows);
 }

