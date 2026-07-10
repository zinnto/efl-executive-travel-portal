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


<div class="trip-card">


<h2>
${trip.executive.name}
</h2>


<p>
${trip.executive.title}
</p>


<hr>


<h3>
📍 Destination
</h3>


<p>
${trip.trip.destination}
<br>
${trip.trip.dates}
</p>



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
☎ Contacts
</h3>


${trip.contacts.map(contact => `


<p>

${contact.name}
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