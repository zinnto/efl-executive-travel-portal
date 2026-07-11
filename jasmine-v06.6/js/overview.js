const container =
document.getElementById("overview-container");


fetch("data/executives.json")

.then(response => response.json())

.then(data => {

loadExecutives(data.executives);

})

.catch(error => {


container.innerHTML = `

<div class="dashboard-card">

<h3>
Unable to load overview
</h3>

<p>
${error.message}
</p>

</div>

`;

});





let attentionItems = [];






function loadExecutives(executives){


const requests = executives.map(executive => {


return fetch(executive.file)

.then(response => response.json())

.then(profile => {


return {

id: executive.id,

profile: profile.profile,

trips: profile.trips

};


});


});



Promise.all(requests)

.then(results => {


displayOverview(results);


});


}







function calculateReadiness(items){


if(!items || items.length === 0){

return 0;

}


const completed =
items.filter(item => item.status === "Complete").length;


return Math.round(

(completed / items.length) * 100

);


}







function progressBar(percent){


return `


<div class="progress-container">


<div 
class="progress-bar"
style="width:${percent}%">

</div>


</div>


`;

}


 







function displayOverview(executives){



const cards = executives.map(executive => {


const currentTrip =
executive.trips.current[0];


const upcoming =
executive.trips.upcoming;



if(!currentTrip){


return `

<div class="dashboard-card executive-card">

<h2>

${executive.profile.name}

</h2>


<p>

${executive.profile.title}

</p>


<p>

No Current Travel

</p>


<button onclick="openProfile('${executive.id}')">

Open Profile

</button>


</div>

`;



}




return fetch(`data/trips/${currentTrip.id}.json`)

.then(response => response.json())

.then(trip => {



const percentage =
calculateReadiness(trip.readiness);



trip.readiness.forEach(item => {


if(item.status !== "Complete"){


attentionItems.push({

executive:
executive.profile.name,

item:item.item


});


}


});




return `


<div class="dashboard-card executive-card">


<h2>

${executive.profile.name}

</h2>



<p>

${executive.profile.title}

</p>



<h3>

🌍 ${currentTrip.destination}

</h3>


<p>

${currentTrip.name}

<br>

${currentTrip.dates}

</p>



<p>

Travel Readiness

<br>

<strong>

${percentage}%

</strong>

</p>


${progressBar(percentage)}



<h4>

Upcoming Trips

</h4>


${
upcoming.length

?

upcoming.map(trip => `

<p>

✈ ${trip.destination}

<br>

${trip.dates}

</p>

`).join("")

:

"<p>No upcoming trips</p>"

}



<button onclick="openProfile('${executive.id}')">

Open Profile

</button>



</div>


`;



});


});





Promise.all(cards)

.then(results => {


container.innerHTML = results.join("");



showAttention();


});



}






function showAttention(){


if(attentionItems.length === 0){

return;

}



container.innerHTML += `


<div class="dashboard-card">


<h2>

⚠ Needs Attention

</h2>



${
attentionItems.map(item => `


<p>

<strong>

${item.executive}

</strong>

<br>

${item.item}

pending

</p>


`).join("")

}



</div>


`;



}






function openProfile(id){


window.location.href =
`executive.html?id=${id}`;


}
