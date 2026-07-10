const params = new URLSearchParams(window.location.search);


const tripID = params.get("id");



const tripFiles = {

    "wasantha-india-2026":
    "data/trips/wasantha-india-2026.json",


    "prageeth-uganda-2026":
    "data/trips/prageeth-uganda-2026.json"

};




fetch(tripFiles[tripID])

.then(response => response.json())

.then(trip => {



const container =
document.getElementById("trip-dashboard");



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

<strong>
${trip.flight.airline}
</strong>

<br>

${trip.flight.flightNumber}

<br>

${trip.flight.route}

<br>

${trip.flight.departure}

</p>


</div>





<div class="dashboard-card">


<h3>
🏨 Hotel
</h3>


<p>

<strong>
${trip.hotel.name}
</strong>

<br>

Check-in:
${trip.hotel.checkIn}

<br>

Check-out:
${trip.hotel.checkOut}

</p>


</div>





<div class="dashboard-card">


<h3>
📅 Schedule
</h3>


${
trip.schedule.map(item => `

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
trip.documents.map(doc => `

<p>

<strong>
${doc.name}
</strong>

<br>

Status:
${doc.status}

</p>


`).join("")

}


</div>




<div class="dashboard-card">


<h3>
☎ Contacts
</h3>


${
trip.contacts.length

?

trip.contacts.map(contact => `

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



});