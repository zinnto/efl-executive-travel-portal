/*
Jasmine v1.0
admin.js
Controller Build 0.8
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
START
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


hotel:null


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


<p>
${trip.departure}
-
${trip.return}
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


const workspace =
document.getElementById(
"trip-workspace"
);


const summary =
document.getElementById(
"trip-summary"
);



workspace.classList.remove(
"hidden"
);



summary.innerHTML = `


<h3>
${trip.city}, ${trip.country}
</h3>


<p>
Executive:
${trip.executive}
</p>


<p>
Airline:
${trip.airline}
</p>


<p>
Dates:
${trip.departure}
-
${trip.return}
</p>


<p>
Purpose:
${trip.purpose}
</p>


`;



renderFlight();

renderHotel();


}









/*
FLIGHTS
*/


const saveFlight =
document.getElementById(
"save-flight"
);



if(saveFlight){


saveFlight.onclick=function(){


if(!activeTrip){

alert(
"Please select a trip first."
);

return;

}



activeTrip.flight={


airline:
document.getElementById(
"flight-airline"
).value,


number:
document.getElementById(
"flight-number"
).value,


departureAirport:
document.getElementById(
"flight-departure-airport"
).value,


arrivalAirport:
document.getElementById(
"flight-arrival-airport"
).value,


departureTime:
document.getElementById(
"flight-departure-time"
).value,


arrivalTime:
document.getElementById(
"flight-arrival-time"
).value,


booking:
document.getElementById(
"flight-booking"
).value


};



renderFlight();


};


}





function renderFlight(){


const summary =
document.getElementById(
"flight-summary"
);



if(!summary || !activeTrip){
return;
}



if(!activeTrip.flight){

summary.innerHTML =
"<p>No flight added yet.</p>";

return;

}



const f =
activeTrip.flight;



summary.innerHTML = `


<div class="executive-card">


<h3>
${f.airline}
${f.number}
</h3>


<p>
${f.departureAirport}
→
${f.arrivalAirport}
</p>


<p>
Booking:
${f.booking}
</p>


</div>


`;


}









/*
HOTEL
*/


const saveHotel =
document.getElementById(
"save-hotel"
);



if(saveHotel){


saveHotel.onclick=function(){



if(!activeTrip){

alert(
"Please select a trip first."
);

return;

}



activeTrip.hotel={


name:
document.getElementById(
"hotel-name"
).value,


city:
document.getElementById(
"hotel-city"
).value,


checkin:
document.getElementById(
"hotel-checkin"
).value,


checkout:
document.getElementById(
"hotel-checkout"
).value,


booking:
document.getElementById(
"hotel-booking"
).value


};



renderHotel();


};


}







function renderHotel(){


const summary =
document.getElementById(
"hotel-summary"
);



if(!summary || !activeTrip){
return;
}



if(!activeTrip.hotel){


summary.innerHTML =
"<p>No hotel added yet.</p>";

return;


}



const h =
activeTrip.hotel;



summary.innerHTML = `


<div class="executive-card">


<h3>
${h.name}
</h3>


<p>
${h.city}
</p>


<p>
${h.checkin}
-
${h.checkout}
</p>


<p>
Booking:
${h.booking}
</p>


</div>


`;


}







waitForJasmine();
