const container =
document.getElementById("overview-container");



fetch("data/executives.json")

.then(response => {

    if (!response.ok) {

        throw new Error("Could not load executives");

    }

    return response.json();

})


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








function displayOverview(executives){



container.innerHTML = executives.map(executive => {



const currentTrip =
executive.trips.current.length
?
executive.trips.current[0]
:
null;



return `


<div class="dashboard-card executive-card">


<h2>

${executive.profile.name}

</h2>


<p>

${executive.profile.title}

<br>

${executive.profile.company}

</p>




${
currentTrip

?

`

<h3>

🌍 ${currentTrip.destination}

</h3>


<p>

${currentTrip.name}

<br>

${currentTrip.dates}

</p>


<p>

🟢 Current Travel

</p>

`

:

`

<p>

No Current Travel

</p>

`

}




<button onclick="openProfile('${executive.id}')">

Open Profile

</button>



</div>


`;



}).join("");



}








function openProfile(id){


window.location.href =
`executive.html?id=${id}`;


}
