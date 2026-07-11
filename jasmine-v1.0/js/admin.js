console.log("Jasmine Admin App Loaded");


let existingExecutives = [];

let scheduleItems = [];

let documentItems = [];





/*
SIDEBAR NAVIGATION
*/


const menuButtons =
document.querySelectorAll(".menu-btn");



const panels = {


Dashboard:"dashboard-panel",

Executives:"executives-panel",

Trips:"trips-panel",

Documents:"documents-panel",

Settings:"settings-panel"


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
EXECUTIVES
*/


const executiveList =
document.getElementById("executive-list");


const executiveDropdown =
document.getElementById("trip-executive");




function loadExecutives(){


fetch("data/executives.json")


.then(response=>response.json())


.then(data=>{


existingExecutives =
data.executives || [];


displayExecutives();


populateExecutiveDropdown();


})


.catch(error=>{


if(executiveList){

executiveList.innerHTML =
error.message;

}


});


}








function displayExecutives(){


if(!executiveList){

return;

}


executiveList.innerHTML =


existingExecutives.map(item=>`


<div class="dashboard-card">

<h3>
${item.name}
</h3>

<p>
${item.title}
</p>

</div>


`).join("");



}







function populateExecutiveDropdown(){


if(!executiveDropdown){

return;

}


existingExecutives.forEach(item=>{


const option =
document.createElement("option");


option.value =
item.id;


option.textContent =
item.name;


executiveDropdown.appendChild(option);


});


}



loadExecutives();









/*
SCHEDULE
*/


const addScheduleButton =
document.getElementById("add-schedule");


const schedulePreview =
document.getElementById("schedule-preview");



if(addScheduleButton){


addScheduleButton.onclick=function(){


const item={


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

alert("Date and event required.");

return;

}


scheduleItems.push(item);


showSchedule();


};


}







function showSchedule(){


if(!schedulePreview){

return;

}



schedulePreview.innerHTML =


scheduleItems.map(item=>`


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
DOCUMENT MANAGER
*/


const addDocumentButton =

document.getElementById("add-document");



const documentPreview =

document.getElementById("document-preview");






if(addDocumentButton){


addDocumentButton.onclick=function(){



const documentItem = {



"type":

document.getElementById("document-type").value,



"name":

document.getElementById("document-name").value,



"status":

document.getElementById("document-status").value,



"url":

document.getElementById("document-url").value



};






if(!documentItem.name){


alert("Please enter document name.");


return;


}



documentItems.push(documentItem);



showDocuments();



};



}







function showDocuments(){


if(!documentPreview){

return;

}



documentPreview.innerHTML =



documentItems.map(doc=>`


<div class="dashboard-card">


<h3>
${doc.name}
</h3>


<p>
${doc.type}
</p>


<p>
Status:
${doc.status}
</p>


${
doc.url
?
`<a href="${doc.url}" target="_blank">
Open Document
</a>`
:
""
}


</div>


`).join("");



}









/*
TRIP GENERATION
*/


const generateTripButton =

document.getElementById("generate-trip");






if(generateTripButton){


generateTripButton.onclick=function(){



const tripID =

document.getElementById("trip-id").value.trim();



if(!tripID){

alert("Trip ID required.");

return;

}





const tripData={


executive:{


id:

document.getElementById("trip-executive").value


},



trip:{


id:tripID,


name:

document.getElementById("trip-name").value,


destination:

document.getElementById("trip-destination").value,


dates:

formatDates(),


status:

document.getElementById("trip-status").value


},



flight:{


airline:

document.getElementById("flight-airline").value,


flightNumber:

document.getElementById("flight-number").value,


route:

document.getElementById("flight-route").value,


departure:

document.getElementById("flight-time").value


},



hotel:{


name:

document.getElementById("hotel-name").value,


checkIn:

document.getElementById("hotel-checkin").value,


checkOut:

document.getElementById("hotel-checkout").value


},



schedule:

scheduleItems,



documents:

documentItems,



contacts:[],



readiness:[

{
item:"Flight Ticket",
status:"Pending"
},

{
item:"Hotel",
status:"Pending"
},

{
item:"Documents",
status:"Pending"
}

]


};





downloadJSON(

tripData,

tripID+".json"

);



};


}










function formatDates(){


return (

document.getElementById("departure-date").value

+

" - "

+

document.getElementById("return-date").value

);


}







function downloadJSON(data,filename){


const blob =
new Blob(

[JSON.stringify(data,null,2)],

{

type:"application/json"

}

);



const link =
document.createElement("a");


link.href =
URL.createObjectURL(blob);



link.download =
filename;



document.body.appendChild(link);


link.click();


document.body.removeChild(link);



}
