/**
 * This js is mainly used to handle events in login.html, which include communicating to the server with http request 
 */

// handle login button click
let loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener('click', handleButtonClick);

function handleButtonClick() {
    console.log("Login button clicked.");

    // gather username and password information  
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let requestJson = JSON.stringify({email: email, password: password});

    // post http request to server for login 
    const http = new XMLHttpRequest();
    const url = 'http://localhost:8000/login';
    http.open("POST", url);
    // set the content-type in header to json so that server would know the format
    http.setRequestHeader("Content-Type", "application/json"); 
    http.addEventListener('load', handleLoginResponse);
    // send data to server 
    http.send(requestJson);
}

// handle the response from http request 

function handleLoginResponse(event) {
    // get responseText
    console.log("In handleLoginResponse()");
    let data = event.target.responseText;
    let dataJson = JSON.parse(data);
    console.log(data);
    if (dataJson.success) {
        console.log("You are login!");
        // if the user is verified, redirect to the pokemon page 
        window.location.pathname = "/edit.html";
    }
    else {
        alert("Email or password is not correct. Please try again!");
    }
}