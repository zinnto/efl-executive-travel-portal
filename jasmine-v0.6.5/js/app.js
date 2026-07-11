fetch("data/executives.json")

.then(response => response.json())

.then(data => {


const container =
document.getElementById("executive-list");



container.innerHTML = "";



data.executives.forEach(executive => {



const card = document.createElement("div");


card.className = "trip-card";



card.innerHTML = `


<h2>

${executive.name}

</h2>


<p>

${executive.title}

</p>


<button onclick="openExecutive('${executive.id}')">

Open Profile

</button>


`;



container.appendChild(card);



});


});




function openExecutive(id){


window.location.href =
`executive.html?id=${id}`;


}