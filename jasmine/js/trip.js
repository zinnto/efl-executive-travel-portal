const params =
new URLSearchParams(window.location.search);


const tripID =
params.get("id");



fetch("data/trips.json")

.then(response => response.json())

.then(data => {


const tripInfo =
data.trips.find(
trip => trip.id === tripID
);



fetch(tripInfo.file)

.then(response => response.json())

.then(trip => {



const dashboard =
document.getElementById("trip-dashboard");



dashboard.innerHTML = `


<div class="hero-card">


<h2>
Good Morning, ${trip.executive.name.split(" ")[0]} 👋
</h2>


<p>
${trip.executive.title}
</p>


</div>




<div class="trip-card">


<h1>
${trip.trip.country}
</h1>


<p>
${trip.trip.dates}
</p>


</div>





<div class="trip-card">


<h3>
✈ Next Flight
</h3>


<h2>
${trip.flight.airline}
${trip.flight.number}
</h2>


<p>

${trip.flight.route}

<br>

Departure:
${trip.flight.departure}

<br>

Seat:
${trip.flight.seat}

<br>

Gate:
${trip.flight.gate}

</p>


<a class="action"

href="${trip.flight.ticket}">

View Ticket

</a>


</div>





<div class="trip-card">


<h3>
🏨 Accommodation
</h3>


<h2>
${trip.hotel.name}
</h2>


<p>

Check-in:
${trip.hotel.checkin}

<br>

Check-out:
${trip.hotel.checkout}

</p>


<a class="action"

href="${trip.hotel.voucher}">

Hotel Voucher

</a>


</div>





<div class="trip-card">


<h3>
📄 Documents
</h3>



${trip.documents.map(doc => `


<p>
📎 ${doc.title}
</p>


`).join("")}



</div>





<div class="trip-card">


<h3>
☎ Support
</h3>



${trip.contacts.map(contact => `


<p>

<strong>
${contact.name}
</strong>

<br>

${contact.role}

<br>

${contact.phone}

</p>


`).join("")}



</div>



`;



});


});
