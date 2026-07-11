/*
Jasmine v1.0
admin.js
Controller Build 0.5
*/


console.log("Jasmine Admin Loaded");


let executives = [];
let trips = [];





/*
NAVIGATION
*/


const navButtons =
document.querySelectorAll(".nav-button");


const sections =
document.querySelectorAll(".page-section");



navButtons.forEach(button => {


button.onclick = function(){


const target =
this.dataset.page;



navButtons.forEach(btn => {

btn.classList.remove("active");

});


this.classList.add("active");



sections.forEach(section => {

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
INITIAL LOAD
*/


function initialiseJasmine(){


loadExecutives();


loadTripDropdowns();


}



function waitForJasmine(){


if(
window.Jasmine &&
Jasmine.data
){


initialiseJasmine();


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


executives =
[...Jasmine.getExecutives()];



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



if(executives.length === 0){


list.innerHTML =
"<p>No executives found.</p>";


return;

}




list.innerHTML = executives.map(executive => `


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


newExecutive.onclick = function(){


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


saveExecutive.onclick = function(){



const executive = {


id:
"exec" +
String(
executives.length + 1
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


status:
"Active"


};



if(!executive.name){

alert(
"Executive name required"
);

return;

}



executives.push(executive);



renderExecutives();


updateExecutiveCount();


populateExecutiveDropdown();


executiveForm.classList.add(
"hidden"
);


};


}









/*
TRIP DROPDOWNS
*/


function loadTripDropdowns(){


const countrySelect =
document.getElementById(
"trip-country"
);



const airlineSelect =
document.getElementById(
"trip-airline"
);





if(countrySelect){


countrySelect.innerHTML =
"<option>Select Country</option>";



Jasmine.getCountries()
.forEach(country=>{


countrySelect.innerHTML +=

`
<option>
${country.name}
</option>
`;


});


}







if(airlineSelect){


airlineSelect.innerHTML =
"<option>Select Airline</option>";



Jasmine.getAirlines()
.forEach(airline=>{


airlineSelect.innerHTML +=

`
<option>
${airline}
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


const citySelect =
document.getElementById(
"trip-city"
);



citySelect.innerHTML =
"<option>Select City</option>";



Jasmine.getCities(
this.value
)
.forEach(city=>{


citySelect.innerHTML +=

`
<option>
${city}
</option>
`;


});



};


}









/*
TRIP CREATION
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
"trip" +
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
).value


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



if(trips.length===0){

list.innerHTML =
"<p>No trips created yet.</p>";

return;

}




list.innerHTML =
trips.map(trip=>`

<div class="executive-card">

<h3>
${trip.city}, ${trip.country}
</h3>

<p>
${trip.airline}
</p>

<p>
${trip.departure} - ${trip.return}
</p>

</div>

`).join("");



}







waitForJasmine();
