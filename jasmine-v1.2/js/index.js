/*
Jasmine v1.0
index.js
Renders the executive directory on the public landing page.
*/


const list = document.getElementById("executive-list");


function renderDirectory(){

    const executives = Jasmine.getExecutives();


    if(!executives.length){

        list.innerHTML = "<p>No executives added yet.</p>";

        return;

    }


    list.innerHTML = executives.map(executive => `

        <div class="executive-list-item" onclick="openProfile('${executive.id}')">

        <div>

        <h3>${executive.name}</h3>

        <p>${executive.title} · ${executive.company}</p>

        </div>

        <button onclick="event.stopPropagation(); openProfile('${executive.id}')">

        View Profile

        </button>

        </div>

    `).join("");

}


function openProfile(id){

    window.location.href = `executive.html?id=${id}`;

}


Jasmine.onReady(renderDirectory);
