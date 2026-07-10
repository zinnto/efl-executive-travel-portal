fetch("data/trips.json")
.then(response => response.json())
.then(data => {

const container =
document.getElementById("trip-list");

container.innerHTML = "";

data.trips.forEach(trip => {

container.innerHTML += `

<div class="trip-card">

<h2>${trip.executive}</h2>

<p>
${trip.destination}
</p>

<p>
${trip.dates}
</p>

<button onclick="openTrip('${trip.id}')">

Open Trip

</button>

</div>

`;

});

});

function openTrip(id){

window.location.href =
`trip.html?id=${id}`;

}