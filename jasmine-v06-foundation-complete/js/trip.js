const params = new URLSearchParams(window.location.search);

const tripID = params.get("id");

const container =
document.getElementById("trip-dashboard");


console.log("Trip ID:", tripID);



fetch(`data/trips/${tripID}.json`)

.then(response => {


    if (!response.ok) {

        throw new Error("Trip not found");

    }


    return response.json();


})


.then(data => {


    displayTrip(data);


})


.catch(error => {


console.error(error);


container.innerHTML = `

<div class="dashboard-card">

<h3>
Trip Not Found
</h3>

<p>
ID received: ${tripID}
</p>

<p>
${error.message}
</p>

</div>

`;

});







function displayTrip(data){



container.innerHTML = `




<div class="dashboard-card">


<h1>

${data.trip.name}

</h1>


<h2>

🌍 ${data.trip.destination}

</h2>


<p>

${data.trip.dates}

</p>


<p>

Status:
🟢 ${data.trip.status}

</p>


</div>







<div class="dashboard-card">


<h3>
✈ Flight Details
</h3>



<p>

<strong>
Airline:
</strong>

${data.flight.airline}

</p>


<p>

<strong>
Flight:
</strong>

${data.flight.flightNumber}

</p>


<p>

<strong>
Route:
</strong>

${data.flight.route}

</p>


<p>

<strong>
Departure:
</strong>

${data.flight.departure}

</p>


</div>








<div class="dashboard-card">


<h3>
🏨 Accommodation
</h3>



<p>

<strong>
Hotel:
</strong>

${data.hotel.name}

</p>


<p>

Check-in:

${data.hotel.checkIn}

</p>


<p>

Check-out:

${data.hotel.checkOut}

</p>



</div>







<div class="dashboard-card">


<h3>
📅 Schedule
</h3>



${

data.schedule.map(item => `


<p>

<strong>

${item.date}

</strong>

<br>

${item.time}

<br>

${item.event}

<br>

${item.location}

</p>


`).join("")

}


</div>








<div class="dashboard-card">


<h3>
📄 Documents
</h3>



${

data.documents.map(doc => `


<p>

${doc.status === "Ready" ? "✅" : "⏳"}

<strong>

${doc.name}

</strong>


<br>

${doc.status}


</p>


`).join("")

}


</div>








<div class="dashboard-card">


<h3>
📞 Contacts
</h3>



${

data.contacts.length

?

data.contacts.map(contact => `


<p>

<strong>

${contact.name}

</strong>

<br>

${contact.type}

</p>


`).join("")

:

"<p>No contacts added</p>"

}


</div>





`;



}
