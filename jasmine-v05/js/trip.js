const params = new URLSearchParams(window.location.search);

const tripID = params.get("id");


const container =
document.getElementById("trip-dashboard");



const tripFiles = {


    "wasantha-india-2026":
    "data/trips/wasantha-india-2026.json",


    "prageeth-uganda-2026":
    "data/trips/prageeth-uganda-2026.json"


};



console.log("Trip ID:", tripID);



if (!tripFiles[tripID]) {


    container.innerHTML = `

    <div class="dashboard-card">

    <h3>
    Trip Not Found
    </h3>

    <p>
    ID received:
    ${tripID}
    </p>

    </div>

    `;


}

else {


fetch(tripFiles[tripID])


.then(response => {


    if(!response.ok){

        throw new Error(
        "Trip JSON file could not be loaded"
        );

    }


    return response.json();


})


.then(trip => {



container.innerHTML = `


<div class="dashboard-card">

<h2>

${trip.executive.name}

</h2>


<p>

${trip.executive.title}

</p>


</div>




<div class="dashboard-card">

<h3>

🌍 ${trip.trip.name}

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


</div>


<div class="dashboard-card">

<h3>
✈ Flight
</h3>


<p>

${trip.flight.airline}

<br>

${trip.flight.route}

</p>


</div>



<div class="dashboard-card">

<h3>
🏨 Hotel
</h3>


<p>

${trip.hotel.name}

</p>


</div>



<div class="dashboard-card">

<h3>
📅 Schedule
</h3>


${trip.schedule.map(item => `

<p>

<strong>
${item.date}
</strong>

<br>

${item.event}

</p>

`).join("")}


</div>



<div class="dashboard-card">

<h3>
📄 Documents
</h3>


${trip.documents.map(doc => `

<p>

<strong>
${doc.name}
</strong>

<br>

${doc.status}

</p>

`).join("")}


</div>



`;


})


.catch(error => {


console.error(error);


container.innerHTML = `

<div class="dashboard-card">

<h3>
Error Loading Travel Details
</h3>

<p>
${error.message}
</p>

</div>

`;

});


}
