console.log("Jasmine Admin Loaded");


const executiveList = document.getElementById("executive-list");

const generateExecutiveButton = document.getElementById("generate-executive");

const editSection = document.getElementById("edit-section");

const updateExecutiveButton = document.getElementById("update-executive");

const generateTripButton = document.getElementById("generate-trip");


let existingExecutives = [];





/*
LOAD EXECUTIVES
*/


function loadExecutives(){


fetch("data/executives.json")

.then(response => {

    if(!response.ok){

        throw new Error("Unable to load executives.json");

    }

    return response.json();

})

.then(data => {

    existingExecutives = data.executives || [];

    displayExecutives();

})

.catch(error => {


    if(executiveList){

        executiveList.innerHTML = `

        <p>
        ${error.message}
        </p>

        `;

    }


});


}



loadExecutives();







/*
DISPLAY EXECUTIVES
*/


function displayExecutives(){


if(!executiveList){

    return;

}


if(existingExecutives.length === 0){


executiveList.innerHTML =
"<p>No executives found.</p>";


return;


}



executiveList.innerHTML =

existingExecutives.map(executive => `


<div class="dashboard-card">


<h3>
${executive.name}
</h3>


<p>
${executive.title}
</p>


<button onclick="editExecutive('${executive.id}')">

Edit

</button>


</div>


`).join("");



}









/*
CREATE EXECUTIVE
*/


if(generateExecutiveButton){


generateExecutiveButton.addEventListener("click", function(){


const id =
document.getElementById("executive-id").value.trim();


const name =
document.getElementById("executive-name").value.trim();


const title =
document.getElementById("executive-title").value.trim();


const company =
document.getElementById("executive-company").value.trim();



if(!id || !name || !title || !company){

alert("Please complete all executive fields.");

return;

}



const exists =
existingExecutives.some(item => item.id === id);



if(exists){

alert("Executive ID already exists.");

return;

}



const executiveData = {


"profile": {


"name": name,

"title": title,

"company": company

},


"trips": {


"current": [],

"upcoming": [],

"history": []

}


};



downloadJSON(

executiveData,

id + ".json"

);



});


}









/*
EDIT EXECUTIVE
*/


window.editExecutive = function(id){


const executive =

existingExecutives.find(item => item.id === id);



if(!executive){

return;

}



if(editSection){

editSection.style.display = "block";

}



document.getElementById("edit-id").value =
executive.id;


document.getElementById("edit-name").value =
executive.name;


document.getElementById("edit-title").value =
executive.title;


document.getElementById("edit-company").value =
"EFL Global";



editSection.scrollIntoView({

behavior:"smooth"

});



};









if(updateExecutiveButton){


updateExecutiveButton.addEventListener("click", function(){


const id =
document.getElementById("edit-id").value;


const data = {


"profile": {


"name":
document.getElementById("edit-name").value,


"title":
document.getElementById("edit-title").value,


"company":
document.getElementById("edit-company").value


},


"trips": {


"current": [],

"upcoming": [],

"history": []

}


};



downloadJSON(

data,

id + ".json"

);



});


}










/*
CREATE TRIP
*/


if(generateTripButton){


generateTripButton.addEventListener("click", function(){



const tripID =

document.getElementById("trip-id").value.trim();



if(!tripID){


alert("Please enter Trip ID.");

return;


}





const tripData = {


"executive": {


"id":

document.getElementById("trip-executive").value.trim()


},



"trip": {


"id": tripID,


"name":

document.getElementById("trip-name").value.trim(),


"destination":

document.getElementById("trip-destination").value.trim(),


"dates":

document.getElementById("trip-dates").value.trim(),


"status":

document.getElementById("trip-status").value.trim()


},



"flight": {


"airline":

document.getElementById("flight-airline").value.trim(),


"flightNumber":

document.getElementById("flight-number").value.trim(),


"route":

document.getElementById("flight-route").value.trim(),


"departure":

document.getElementById("flight-departure").value.trim()


},



"hotel": {


"name":

document.getElementById("hotel-name").value.trim(),


"checkIn":

document.getElementById("hotel-checkin").value.trim(),


"checkOut":

document.getElementById("hotel-checkout").value.trim()


},



"schedule": [],


"documents": [],


"contacts": [],



"readiness": [


{

"item":"Flight Ticket",

"status":"Pending"

},


{

"item":"Hotel",

"status":"Pending"

},


{

"item":"Documents",

"status":"Pending"

}


]


};




downloadJSON(

tripData,

tripID + ".json"

);



});


}









/*
DOWNLOAD JSON
*/


function downloadJSON(data, filename){



const blob = new Blob(

[

JSON.stringify(data,null,2)

],

{

type:"application/json"

}

);



const link = document.createElement("a");


link.href = URL.createObjectURL(blob);


link.download = filename;


document.body.appendChild(link);


link.click();


document.body.removeChild(link);



URL.revokeObjectURL(link.href);



alert(

filename + " generated successfully."

);



}
