

let submitBtn = document.getElementById("submit");
submitBtn.addEventListener('click', handleButtonClick);
let backbtn = document.getElementById("backButton");
backbtn.addEventListener('click', handleGoBack);

function handleGoBack() {
    window.location.pathname = "/";
}


function handleButtonClick() {
    console.log("Submit button clicked.");

    // gather username and password information  
    console.log(document.getElementById("team").value);
    console.log(document.getElementById("stat").value);

    let aTeam = document.getElementById("team").value;
    let aStat = document.getElementById("stat").value;
    let newValue = document.getElementById("newStat").value;
    switch(aStat) {
        case "wins": 
        newValue = parseInt(newValue);
        break;
        case "losses":
        newValue = parseInt(newValue);
        break;
        case "Ties":
        newValue = parseInt(newValue);
        break;
        default:
        newValue = parseFloat(newValue);
        break;
    }
    if (aStat === "pypg") {
        aStat = "passypg";
    } else if (aStat === "rypg") {
        aStat = "rushypg";
    }

    let requestJson = JSON.stringify({teamName: aTeam, stat: aStat, newVal: newValue});

    // post http request to server for login 
    const http = new XMLHttpRequest();
    const url = 'http://localhost:8000/editdb';
    http.open("POST", url);
    // set the content-type in header to json so that server would know the format
    http.setRequestHeader("Content-Type", "application/json"); 
    http.addEventListener('load', handleHttpResponse);
    // send data to server 
    http.send(requestJson);
}

function handleHttpResponse(event) {
    // get responseText
    console.log("In handleHttpResponse()");
    let data = event.target.responseText;
    let dataJson = JSON.parse(data);
    console.log(data);
    if (dataJson.success) {
        console.log("Edit successful");
        // if the user is verified, redirect to the pokemon page 
        window.location.pathname = "/";
    }
    else {
        alert("Edit unsuccessful, Please try again!");
    }
}