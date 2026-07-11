const params = new URLSearchParams(window.location.search);

const executiveID = params.get("id");

const container =
document.getElementById("executive-profile");



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

        throw new Error("Executive not found");

    }


    return fetch(executive.file);


})


.then(response => {


    if (!response.ok) {

        throw new Error("Could not load executive profile");

    }


    return response.json();


})


.then(profile => {


    displayExecutive(profile);


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








function displayExecutive(profile){



const currentTrips =
profile.trips.current;


const upcomingTrips =
profile.trips.upcoming;


const historyTrips =
profile.trips.history;




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
🌍 Current Travel
</h3>



${
currentTrips.length

?

currentTrips.map(trip => `


<p>

<strong>

${trip.destination}

</strong>

<br>

${trip.name}

<br>

${trip.dates}

</p>


<button onclick="openTrip('${trip.id}')">

View Travel Details

</button>


`).join("")


:

"<p>No current travel</p>"

}



</div>







<div class="dashboard-card">


<h3>
✈ Upcoming Trips
</h3>



${
upcomingTrips.length

?

upcomingTrips.map(trip => `


<p>

<strong>

${trip.destination}

</strong>

<br>

${trip.name}

<br>

${trip.dates}

</p>


<button onclick="openTrip('${trip.id}')">

View Travel Details

</button>


`).join("")


:

"<p>No upcoming trips</p>"

}



</div>







<div class="dashboard-card">


<h3>
🗂 Travel History
</h3>



${
historyTrips.length

?

historyTrips.map(trip => `


<p>

<strong>

${trip.destination}

</strong>

<br>

${trip.name}

<br>

${trip.dates}

</p>


<button onclick="openTrip('${trip.id}')">

View Travel Details

</button>


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
