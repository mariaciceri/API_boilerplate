const API_URL_KEY = "https://ci-jshint.herokuapp.com/api?api_key=xH3eBlg_4F5mX6KwJNEIiIvK3kU";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const API_KEY = "xH3eBlg_4F5mX6KwJNEIiIvK3kU";
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));


$("#status").click(function(e) {
    getStatus(e)
});
$("#submit").click(function(e) {
    postForm(e)
})

function processOptions(form) {

    let optArray = [];

    for(let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }

    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

function displayExceptions(data) {

    let results = `<div>The API returned status code ${data.status_code}</div>
    <div>Error number: <strong>${data.error_no}</strong></div>
    <div>Error text: <strong>${data.error}</strong></div>`;

    $("#resultsModalTitle").text("An Exception Occurred");
    $("#results-content").html(results);

    resultsModal.show();
}

async function postForm(e) {

    const form = processOptions(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form
                        });
                               
    const data = await response.json();
                    
    if(response.ok) {
        displayErrors(data);
    }
    else {
        console.log(data.error);
        displayExceptions(data);
        throw new Error(data.error); 
    }

}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no-error">No errors reported!</div>`;
    }
    else {
        results = `<div>Total Errors: ${data.total_errors}</div>`;
        data.error_list.forEach(error => {
            results += `<div>At line ${error.line}, column ${error.col}, ${error.error}</div>
            `;
        });
    }

    $("#resultsModalTitle").text(heading);
    $("#results-content").html(results);

    resultsModal.show();
}

async function getStatus(e) {
    const response = await fetch(API_URL_KEY);

    const data = await response.json();

    if(response.ok) {
        displayStatus(data.expiry)
    }
    else {
        console.log(data.error);
        displayExceptions(data);
        throw new Error(data.error); 
    }
}

function displayStatus(data) {

    $("#resultsModalTitle").text("API Key Status");
    $("#results-content").html(`Your API key is valid until <strong>${data}</strong>`);

    resultsModal.show();
}