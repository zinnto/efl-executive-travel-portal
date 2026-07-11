const container =
document.getElementById("overview-container");



fetch("data/executives.json")

.then(response => {

    if (!response.ok) {

        throw new Error("Could not load executives");

    }

    return response.json();

})


.then(data => {


    loadExecutives(data.executives);


})


.catch(error => {


container.innerHTML = `

<div class="dashboard-card">

<h3>
Unable to load overview
</h3>

<p>
${error.message}
</p>

</div>

`;

});








function loadExecutives(executives){


const requests = executives.map(executive => {


return fetch(executive.file)

.then(response => response.json())

.then(profile => {


return {

    id: executive.id,

    profile: profile.profile,

    trips: profile.trips

};


});


});





Promise.all(requests)

.then(results => {


displayOverview(results);


});


}








function calculateReadiness(readiness){


if (!readiness || readiness.length === 0){

return 0;

}



const completed = readiness.filter(item =>

item.status === "Complete"

).length;



return Math.round(

(completed / readiness.length) * 100

);


}









function loadTrip(tripID){


return fetch(`data/trips/${tripID}.json`)

.then(response => {


if(!response.ok){

throw new Error("Trip data not found");

}


return response.json();


});


}









function displayOverview(executives){



const cards = executives.map(executive => {


const currentTrip =

executive.trips.current.length

?

executive.trips.current[0]

:

null;




if(!currentTrip){


return `


<div class="dashboard-card executive-card">


<h2>

${executive.profile.name}

</h2>


<p>

${executive.profile.title}

<br>

${executive.profile.company}

</p>


<p>

No Current Travel

</p>


<button onclick="openProfile('${executive.id}')">

Open Profile

</button>


</div>


`;


}





return loadTrip(currentTrip.id)

.then(trip => {



const readiness =

calculateReadiness(trip.readiness);



return `


<div class="dashboard-card executive-card">


<h2>

${executive.profile.name}

</h2>



<p>

${executive.profile.title}

<br>

${executive.profile.company}

</p>




<h3>

🌍 ${currentTrip.destination}

</h3>



<p>

<strong>

${currentTrip.name}

</strong>

<br>

${currentTrip.dates}

</p>




<p>

Travel Readiness

<br>

<strong>

${readiness}%

</strong>

</p>



<p>

${
readiness === 100

?

"✅ Ready"

:

"⏳ Pending Items"

}

</p>



<button onclick="openProfile('${executive.id}')">

Open Profile

</button>



</div>


`;



});


});




Promise.all(cards)

.then(results => {


container.innerHTML = results.join("");


});



}







function openProfile(id){


window.location.href =
`executive.html?id=${id}`;


}
