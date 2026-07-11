/*
Jasmine v1.0
admin.js
Controller Build 1.0
*/


console.log("Jasmine Admin Loaded");


let executives = [];
let trips = [];
let activeTrip = null;



/*
NAVIGATION
*/


const navButtons =
document.querySelectorAll(".nav-button");


const sections =
document.querySelectorAll(".page-section");



navButtons.forEach(button=>{


button.onclick=function(){


const target =
this.dataset.page;


navButtons.forEach(btn=>{

btn.classList.remove("active");

});


this.classList.add("active");



sections.forEach(section=>{

section.classList.add("hidden");

});



const page =
document.getElementById(target);



if(page){

page.classList.remove("hidden");

}


};


});








/*
INITIALISE
*/


function startJasmine(){


executives =
[...Jasmine.getExecutives()];


loadExecutives();


loadTripDropdowns();


}



function waitForJasmine(){


if(

window.Jasmine &&

Jasmine.data &&

Jasmine.data.executives &&

Jasmine.data.executives.length > 0

){


startJasmine();


}

else{


setTimeout(
waitForJasmine,
300
);


}


}









/*
EXECUTIVES
*/


function loadExecutives(){


renderExecutives();


updateExecutiveCount();


populateExecutiveDropdown();


}





function renderExecutives(){


const list =
document.getElementById(
"executive-list"
);



if(!list){
return;
}



list.innerHTML =
executives.map(executive=>`


<div class="executive-card">

<h3>
${executive.name}
</h3>

<p>
${executive.title}
</p>

<p>
${executive.company}
</p>

</div>


`).join("");



}





function updateExecutiveCount(){


const count =
document.getElementById(
"executive-count"
);



if(count){

count.innerText =
executives.length;

}


}





function populateExecutiveDropdown(){


const select =
document.getElementById(
"trip-executive"
);



if(!select){

return;

}



select.innerHTML =
"<option>Select Executive</option>";



executives.forEach(executive=>{


select.innerHTML +=

`
<option value="${executive.id}">
${executive.name}
</option>
`;


});


}









/*
ADD EXECUTIVE
*/


const newExecutive =
document.getElementById(
"new-executive"
);



const executiveForm =
document.getElementById(
"executive-form"
);



if(newExecutive){


newExecutive.onclick=function(){


executiveForm.classList.toggle(
"hidden"
);


};


}







const saveExecutive =
document.getElementById(
"save-executive"
);



if(saveExecutive){


saveExecutive.onclick=function(){


const executive={


id:
"exec"+
String(
executives.length+1
).padStart(3,"0"),


name:
document.getElementById(
"executive-name"
).value,


title:
document.getElementById(
"executive-title"
).value,


company:
document.getElementById(
"executive-company"
).value,


email:
document.getElementById(
"executive-email"
).value,


phone:
document.getElementById(
"executive-phone"
).value,


status:"Active"


};


executives.push(executive);


loadExecutives();


executiveForm.classList.add(
"hidden"
);


};


}









/*
TRIP DROPDOWNS
*/


function loadTripDropdowns(){


const country =
document.getElementById(
"trip-country"
);



const airline =
document.getElementById(
"trip-airline"
);



if(country){


country.innerHTML =
"<option>Select Country</option>";



Jasmine.getCountries()
.forEach(item=>{


country.innerHTML +=

`
<option>
${item.name}
</option>
`;

});


}





if(airline){


airline.innerHTML =
"<option>Select Airline</option>";



Jasmine.getAirlines()
.forEach(item=>{


airline.innerHTML +=

`
<option>
${item}
</option>
`;

});


}


}





const countrySelect =
document.getElementById(
"trip-country"
);



if(countrySelect){


countrySelect.onchange=function(){


const city =
document.getElementById(
"trip-city"
);



city.innerHTML =
"<option>Select City</option>";



Jasmine.getCities(
this.value
)
.forEach(item=>{


city.innerHTML +=

`
<option>
${item}
</option>
`;

});


};


}









/*
TRIPS
*/


const newTrip =
document.getElementById(
"new-trip"
);


const tripForm =
document.getElementById(
"trip-form"
);



if(newTrip){


newTrip.onclick=function(){


tripForm.classList.toggle(
"hidden"
);


};


}








const saveTrip =
document.getElementById(
"save-trip"
);



if(saveTrip){


saveTrip.onclick=function(){



const trip={


id:
"trip"+
String(
trips.length+1
).padStart(3,"0"),


executive:
document.getElementById(
"trip-executive"
).value,


country:
document.getElementById(
"trip-country"
).value,


city:
document.getElementById(
"trip-city"
).value,


airline:
document.getElementById(
"trip-airline"
).value,


departure:
document.getElementById(
"trip-departure"
).value,


return:
document.getElementById(
"trip-return"
).value,


purpose:
document.getElementById(
"trip-purpose"
).value,


flight:null,


hotel:null,


documents:[]


};



trips.push(trip);


renderTrips();


tripForm.classList.add(
"hidden"
);



};


}








function renderTrips(){


const list =
document.getElementById(
"trip-list"
);



if(!list){

return;

}



list.innerHTML =
trips.map(trip=>`


<div class="executive-card"
data-trip="${trip.id}">


<h3>
${trip.city}, ${trip.country}
</h3>


<p>
${trip.airline}
</p>


</div>


`).join("");




document.querySelectorAll("[data-trip]")
.forEach(card=>{


card.onclick=function(){


activeTrip =
trips.find(
item =>
item.id === this.dataset.trip
);



openTripWorkspace(activeTrip);


};


});


}







function openTripWorkspace(trip){


activeTrip = trip;



document
.getElementById(
"trip-workspace"
)
.classList.remove(
"hidden"
);



document.getElementById(
"trip-summary"
).innerHTML = `


<h3>
${trip.city}, ${trip.country}
</h3>


<p>
Executive:
${trip.executive}
</p>


<p>
Purpose:
${trip.purpose}
</p>


`;



renderFlight();

renderHotel();

renderDocuments();

renderReadiness();


}









/*
READINESS
*/


function renderReadiness(){


const box =
document.getElementById(
"readiness-summary"
);



if(!box || !activeTrip){

return;

}



let score = 0;

let items = [];




if(activeTrip.flight){

score += 25;

items.push(
"✔ Flight details added"
);

}

else{

items.push(
"⚠ Flight missing"
);

}




if(activeTrip.hotel){

score += 25;

items.push(
"✔ Hotel details added"
);

}

else{

items.push(
"⚠ Hotel missing"
);

}





if(
activeTrip.documents &&
activeTrip.documents.length > 0
){

score += 50;

items.push(
"✔ Documents uploaded"
);

}

else{

items.push(
"⚠ Documents missing"
);

}





box.innerHTML = `


<div class="executive-card">


<h3>
${score}% Ready
</h3>


${items.map(item=>`

<p>
${item}
</p>

`).join("")}


</div>


`;



}









/*
RENDER HELPERS
*/


function renderFlight(){


const box =
document.getElementById(
"flight-summary"
);



if(!box || !activeTrip){

return;

}



box.innerHTML =
activeTrip.flight ?

`
<div class="executive-card">

<h3>
${activeTrip.flight.airline}
${activeTrip.flight.number}
</h3>

<p>
${activeTrip.flight.departureAirport}
→
${activeTrip.flight.arrivalAirport}
</p>

</div>
`

:

"<p>No flight added yet.</p>";



}




function renderHotel(){


const box =
document.getElementById(
"hotel-summary"
);



if(!box || !activeTrip){

return;

}



box.innerHTML =
activeTrip.hotel ?

`
<div class="executive-card">

<h3>
${activeTrip.hotel.name}
</h3>

<p>
${activeTrip.hotel.city}
</p>

</div>
`

:

"<p>No hotel added yet.</p>";



}




function renderDocuments(){


const box =
document.getElementById(
"document-summary"
);



if(!box || !activeTrip){

return;

}



box.innerHTML =
activeTrip.documents.length ?

activeTrip.documents.map(doc=>`

<div class="executive-card">

<h3>
${doc.name}
</h3>

<p>
${doc.status}
</p>

</div>

`).join("")

:

"<p>No documents added yet.</p>";



}








/*
FLIGHT SAVE
*/


document
.getElementById(
"save-flight"
)
?.addEventListener(
"click",
()=>{


if(!activeTrip)return;



activeTrip.flight={

airline:
document.getElementById("flight-airline").value,

number:
document.getElementById("flight-number").value,

departureAirport:
document.getElementById("flight-departure-airport").value,

arrivalAirport:
document.getElementById("flight-arrival-airport").value,

booking:
document.getElementById("flight-booking").value

};



renderFlight();

renderReadiness();


});









/*
HOTEL SAVE
*/


document
.getElementById(
"save-hotel"
)
?.addEventListener(
"click",
()=>{


if(!activeTrip)return;



activeTrip.hotel={


name:
document.getElementById("hotel-name").value,


city:
document.getElementById("hotel-city").value,


booking:
document.getElementById("hotel-booking").value


};



renderHotel();

renderReadiness();


});









/*
DOCUMENT SAVE
*/


document
.getElementById(
"save-document"
)
?.addEventListener(
"click",
()=>{


if(!activeTrip)return;



activeTrip.documents.push({


type:
document.getElementById("document-type").value,


name:
document.getElementById("document-name").value,


link:
document.getElementById("document-link").value,


status:
document.getElementById("document-status").value


});



renderDocuments();

renderReadiness();


});









waitForJasmine();
