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
Unable to load profile
</h3>

<p>
${error.message}
</p>

</div>

`;

});







function displayProfile(profile, trip){


container.innerHTML = `



<div class="dashboard-card executive-header">


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
🌍 Current Journey
</h3>



<h2>

${trip.trip.destination}

</h2>



<p>

${trip.trip.name}

<br>

${trip.trip.dates}

</p>



<p>

🟢 ${trip.trip.status}

</p>



<button onclick="openTrip('${trip.trip.id}')">

View Travel Details

</button>


</div>







<div class="dashboard-card">


<h3>
Upcoming Journeys
</h3>



${
profile.upcomingTrips.length

?

profile.upcomingTrips.map(item => `

<p>
${item}
</p>

`).join("")

:

"<p>No upcoming journeys</p>"

}



</div>








<div class="dashboard-card">


<h3>
Recent Travel
</h3>



${
profile.travelHistory.length

?

profile.travelHistory.map(item => `

<p>
${item}
</p>

`).join("")

:

"<p>No travel history</p>"

}



</div>



`;



}




function openTrip(id){

window.location.href =
`trip.html?id=${id}`;

}
