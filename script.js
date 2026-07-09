fetch("trip.json")

.then(response => response.json())

.then(data => {


document.querySelector(".logo").innerHTML =
data.company;



document.querySelector("header h1").innerHTML =
"Good Morning, " + data.traveller.name;



document.querySelector("header p").innerHTML =
data.traveller.position +
"<br>" +
data.trip.destination +
"<br>" +
data.trip.dates;




document.querySelector(".next-card h2").innerHTML =
data.nextEvent.icon +
" " +
data.nextEvent.title;



document.querySelector(".next-card p").innerHTML =
data.nextEvent.route +
"<br>" +
data.nextEvent.time +
"<br>" +
data.nextEvent.details;



let agendaHTML="";


data.agenda.forEach(item => {


agendaHTML += `

<div>

<span>
${item.time}
</span>

${item.icon}
${item.event}

</div>

`;

});


document.querySelector(".agenda").innerHTML =
agendaHTML;




let statusHTML="";


data.status.forEach(item=>{


statusHTML += `

<p>
✅ ${item}
</p>

`;

});


document.querySelector(".status").innerHTML += statusHTML;



})

.catch(error => {

console.log("Error loading trip data", error);

});