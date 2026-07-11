/*
Jasmine v1.0
Admin Controller
*/


console.log("Jasmine Admin Controller Loaded");



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


button.addEventListener("click",function(){


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



});


});









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




if(executives.length===0){


list.innerHTML =
"<p>No executives found.</p>";


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


const dropdown =
document.getElementById(
"trip-executive"
);



if(!dropdown){

return;

}




dropdown.innerHTML =

`
<option>
Select Executive
</option>
`;





executives.forEach(executive=>{


const option =
document.createElement("option");


option.value =
executive.id;


option.textContent =
executive.name;



dropdown.appendChild(option);


});


}









/*
EXECUTIVE ADD
*/


const newExecutiveButton =
document.getElementById(
"new-executive"
);



const executiveForm =
document.getElementById(
"executive-form"
);




if(newExecutiveButton){


newExecutiveButton.onclick=function(){


executiveForm.classList.toggle(
"hidden"
);


};


}





const saveExecutiveButton =
document.getElementById(
"save-executive"
);




if(saveExecutiveButton){


saveExecutiveButton.onclick=function(){


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
TRIP MANAGER
*/


const newTripButton =
document.getElementById(
"new-trip"
);



const tripForm =
document.getElementById(
"trip-form"
);






if(newTripButton){


newTripButton.onclick=function(){


tripForm.classList.toggle(
"hidden"
);


};


}









function populateTripData(){


const countryDropdown =
document.getElementById(
"trip-country"
);



const airlineDropdown =
document.getElementById(
"trip-airline"
);





if(countryDropdown){



countryDropdown.innerHTML =

`
<option>
Select Country
</option>
`;



Jasmine.getCountries()
.forEach(country=>{


const option =
document.createElement("option");


option.value =
country.name;


option.textContent =
country.name;


countryDropdown.appendChild(option);



});



}







if(airlineDropdown){



airlineDropdown.innerHTML =

`
<option>
Select Airline
</option>
`;




Jasmine.getAirlines()
.forEach(airline=>{


const option =
document.createElement("option");


option.value =
airline;


option.textContent =
airline;


airlineDropdown.appendChild(option);



});



}



}









const countryDropdown =
document.getElementById(
"trip-country"
);





if(countryDropdown){



countryDropdown.addEventListener(
"change",
function(){



const cityDropdown =
document.getElementById(
"trip-city"
);



cityDropdown.innerHTML =

`
<option>
Select City
</option>
`;




Jasmine.getCities(
this.value
)
.forEach(city=>{


const option =
document.createElement("option");


option.value =
city;


option.textContent =
city;


cityDropdown.appendChild(option);


});



});


}









const saveTripButton =
document.getElementById(
"save-trip"
);






if(saveTripButton){


saveTripButton.onclick=function(){



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
Executive:
${trip.executive}
</p>


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



}









/*
START APPLICATION
*/


function waitForJasmine(){



if(

Jasmine &&

Jasmine.data &&

Jasmine.data.executives.length > 0

){


loadExecutives();

populateTripData();


}

else{

 function openTripWorkspace(trip){


const workspace =
document.getElementById(
"trip-workspace"
);



const summary =
document.getElementById(
"trip-summary"
);



if(!workspace || !summary){

return;

}



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
Travel Dates:
${trip.departure}
-
${trip.return}
</p>


<p>
Purpose:
${trip.purpose}
</p>


`;



} 

setTimeout(
waitForJasmine,
300
);


}


}





waitForJasmine();
