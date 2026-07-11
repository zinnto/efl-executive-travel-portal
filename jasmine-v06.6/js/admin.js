console.log("Jasmine Admin App Loaded");



let existingExecutives = [];

let scheduleItems = [];





/*
SIDEBAR NAVIGATION
*/


const menuButtons =
document.querySelectorAll(".menu-btn");



const panels = {

"Dashboard":"dashboard-panel",

"Executives":"executives-panel",

"Trips":"trips-panel",

"Documents":"documents-panel",

"Settings":"settings-panel"

};




menuButtons.forEach(button => {


button.addEventListener("click",function(){



menuButtons.forEach(btn => {

btn.classList.remove("active");

});



this.classList.add("active");



Object.values(panels).forEach(panel => {


const element =
document.getElementById(panel);


if(element){

element.style.display="none";

}


});



const selected =

document.getElementById(

panels[this.innerText]

);



if(selected){

selected.style.display="block";

}



});



});









/*
LOAD EXECUTIVES
*/


const executiveList =
document.getElementById("executive-list");



const executiveDropdown =
document.getElementById("trip-executive");




function loadExecutives(){



fetch("data/executives.json")


.then(response => {


if(!response.ok){

throw new Error(

"Executive data not found"

);

}


return response.json();


})


.then(data => {


existingExecutives =

data.executives || [];



displayExecutives();



populateExecutiveDropdown();



})


.catch(error => {



if(executiveList){

executiveList.innerHTML =

`<p>${error.message}</p>`;

}



});



}









function displayExecutives(){


if(!executiveList){

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


</div>


`).join("");



}








function populateExecutiveDropdown(){


if(!executiveDropdown){

return;

}



existingExecutives.forEach(executive => {



const option =
document.createElement("option");



option.value =
executive.id;



option.textContent =
executive.name;



executiveDropdown.appendChild(option);



});



}








loadExecutives();









/*
SCHEDULE BUILDER
*/


const addScheduleButton =
document.getElementById("add-schedule");



const schedulePreview =
document.getElementById("schedule-preview");





if(addScheduleButton){



addScheduleButton.addEventListener(

"click",

function(){



const item = {


date:

document.getElementById("schedule-date").value,


time:

document.getElementById("schedule-time").value,


event:

document.getElementById("schedule-event").value,


location:

document.getElementById("schedule-location").value


};





if(!item.date || !item.event){


alert(

"Please enter date and event."

);


return;


}




scheduleItems.push(item);



displaySchedule();



}

);



}









function displaySchedule(){



if(!schedulePreview){

return;

}




schedulePreview.innerHTML =



scheduleItems.map(item => `


<div class="dashboard-card">


<strong>

${item.date}

</strong>


<br>

${item.time}


<br>

${item.event}


<br>

${item.location}


</div>


`).join("");



}









/*
TRIP GENERATOR
*/


const generateTripButton =

document.getElementById("generate-trip");





if(generateTripButton){



generateTripButton.addEventListener(

"click",

function(){



const tripID =

document.getElementById("trip-id").value.trim();





if(!tripID){


alert(

"Please enter Trip ID."

);


return;


}






const tripData = {



"executive": {


"id":

document.getElementById("trip-executive").value,


},




"trip": {


"id":

tripID,


"name":

document.getElementById("trip-name").value,


"destination":

document.getElementById("trip-destination").value,


"dates":

formatDates(),


"status":

document.getElementById("trip-status").value


},




"flight": {


"airline":

document.getElementById("flight-airline").value,


"flightNumber":

document.getElementById("flight-number").value,


"route":

document.getElementById("flight-route").value,


"departure":

document.getElementById("flight-time").value


},




"hotel": {


"name":

document.getElementById("hotel-name").value,


"checkIn":

document.getElementById("hotel-checkin").value,


"checkOut":

document.getElementById("hotel-checkout").value


},




"schedule":

scheduleItems,



"documents":[],



"contacts":[],



"readiness":[


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

tripID+".json"

);



}

);



}









function formatDates(){


const departure =

document.getElementById("departure-date").value;



const returnDate =

document.getElementById("return-date").value;



if(!departure && !returnDate){

return "";

}



return departure +

" - " +

returnDate;



}









function downloadJSON(data,filename){



const blob = new Blob(

[

JSON.stringify(data,null,2)

],

{

type:"application/json"

}

);



const link = document.createElement("a");



link.href =

URL.createObjectURL(blob);



link.download = filename;



document.body.appendChild(link);



link.click();



document.body.removeChild(link);



URL.revokeObjectURL(link.href);



alert(

filename +

" generated successfully."

);



}
