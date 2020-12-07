// feel free to use the codes here

/************************************************************************************************
 ********* on page load, we request pokemon data stored in the database from the server
 ***********************************************************************************************/
 window.addEventListener("load", getData);
 //const teams = ["Bills", "Dolphins", "Jets", "Patriots"];

let loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener('click', handleButtonClick);
function handleButtonClick() {
    console.log("Login button clicked.");
    window.location.pathname = "/login.html";
}


// get the pokemon data and create cards 
 function getData() {
     console.log("Getting stats data ...");

     // sending request to server to get pokemon data from database 
     const http = new XMLHttpRequest();
     const url = "http://localhost:8000/data";
     
     http.open("GET", url);
     //http.setRequestHeader("Content-Type", "application/json");
     http.addEventListener('load', processData);
     //console.log(requestJson);
     http.send();
 }

// process the pokemon data we received from the server and create cards to display on the page
 function processData(event) {
     let response = event.target.responseText;
     let responseJson = JSON.parse(response);
     if (!responseJson.success) {
         alert("Unable to get the pokemon data from database. Please try again later.");
         return;  
    }


     let teamStats = responseJson.data;
     //console.log(teamStats);
     teamStats.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
    return 0;
})
     teamStats.map(displayTeamStats);
 }

 function displayTeamStats(team){
 	console.log(team.name);
    let record = "";
    if (team.ties !=0 ) {
        record = team.name + ": " + team.wins + "-" + team.losses; + "-" + team.ties;
    } else {
        record = team.name + ": " + team.wins + "-" + team.losses;
    }
 	
 	let ppg = team.name + ": " + team.ppg;
 	let pypg = team.name + ": " + team.passypg;
 	let rypg = team.name + ": " + team.rushypg;
 	//console.log(team.division);
 	//Record
 	let headder = document.getElementById("records");
 	headder = headder.getElementsByClassName(team.division)[0];
 	let element = document.createElement('p');
 	element.textContent = record;
 	headder.appendChild(element);
 	//PPG
 	headder = document.getElementById("ppg");
 	headder = headder.getElementsByClassName(team.division)[0];
 	element = document.createElement('p');
 	element.textContent = ppg;
 	headder.appendChild(element);
 	//pypg
	headder = document.getElementById("pypg");
 	headder = headder.getElementsByClassName(team.division)[0];
 	element = document.createElement('p');
 	element.textContent = pypg;
 	headder.appendChild(element);
 	//rypg
 	headder = document.getElementById("rypg");
 	headder = headder.getElementsByClassName(team.division)[0];
 	element = document.createElement('p');
 	element.textContent = rypg;
 	headder.appendChild(element);

 }
