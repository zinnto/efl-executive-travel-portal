const params = new URLSearchParams(window.location.search);

const executiveID = params.get("id");

const container = document.getElementById("executive-profile");


fetch("data/executives.json")

.then(response => {

    if (!response.ok) {
        throw new Error("Could not load executives.json");
    }

    return response.json();

})

.then(data => {


    const executive = data.executives.find(
        item => item.id === executiveID
    );


    if (!executive) {

        container.innerHTML = "Executive not found";

        return;

    }



    return fetch(executive.file);


})

.then(response => {


    if (!response.ok) {

        throw new Error("Could not load executive profile file");

    }


    return response.json();


})

.then(profile => {

    console.log("Current Trip:", profile.currentTrip);

    container.innerHTML = ``


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
${profile.currentTrip.destination}
</h2>


<p>

${profile.currentTrip.dates}

<br>

Status:
${profile.currentTrip.status}

</p>


<button onclick="openTrip('${profile.currentTrip.id}')">

Open Itinerary

</button>


</div>



<div class="dashboard-card">

<h3>
Upcoming Trips
</h3>


${
profile.upcomingTrips.map(trip => `

<p>

<strong>
${trip.destination}
</strong>

<br>

${trip.date}

</p>


`).join("")
}


</div>




<div class="dashboard-card">

<h3>
Travel History
</h3>


${
profile.travelHistory.map(trip => `

<p>

<strong>
${trip.destination}
</strong>

<br>

${trip.date}

</p>


`).join("")
}


</div>


`;



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




function openTrip(id) {

window.location.href =
`trip.html?id=${id}`;

}
