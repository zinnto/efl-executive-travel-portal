const params = new URLSearchParams(window.location.search);

const executiveID = params.get("id");

const container =
document.getElementById("executive-profile");



fetch("data/executives.json")

.then(response => response.json())


.then(data => {


    const executive = data.executives.find(
        item => item.id === executiveID
    );


    if (!executive) {
console.log("TRIP OBJECT:", trip);
console.log("TRIP ID:", trip.trip.id);
        container.innerHTML =
        "Executive not found";

        return;

    }


    return fetch(executive.file);


})


.then(response => response.json())


.then(profile => {



    const tripID =
    profile.currentTrip;



    return fetch(
        `data/trips/${tripID}.json`
    )


    .then(response => response.json())


    .then(trip => {


        displayProfile(profile, trip);


    });


})


.catch(error => {


console.error(error);


container.innerHTML = `

<div class="dashboard-card">

<h3>
Error Loading Profile
</h3>

<p>
${error.message}
</p>

</div>

`;

});






function displayProfile(profile, trip){



container.innerHTML = `



<div class="dashboard-card">


<h2>

${profile.profile.name}

</h2>


<p>

${profile.profile.title}

<br>

${profile.profile.company}

</p>


</div>





<div class="dashboard-card">


<h3>
✈ Current Travel
</h3>



<h2>

${trip.trip.destination}

</h2>



<p>

${trip.trip.dates}

<br>

Status:

${trip.trip.status}

</p>



<button onclick="openTrip('${trip.trip.id}')">

Open Itinerary

</button>



</div>





<div class="dashboard-card">


<h3>
Upcoming Trips
</h3>


${

profile.upcomingTrips.map(item => `

<p>
${item}
</p>

`).join("")

}



</div>





<div class="dashboard-card">


<h3>
Travel History
</h3>


${

profile.travelHistory.map(item => `

<p>
${item}
</p>

`).join("")

}



</div>


`;



}



function openTrip(id){

window.location.href =
`trip.html?id=${id}`;

}
