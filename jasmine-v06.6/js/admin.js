console.log("Jasmine Admin App Loaded");



/*
SIDEBAR NAVIGATION
*/


const menuButtons = document.querySelectorAll(".menu-btn");


const panels = {


"Dashboard":"dashboard-panel",

"Executives":"executives-panel",

"Trips":"trips-panel",

"Documents":"documents-panel",

"Settings":"settings-panel"


};





menuButtons.forEach(button => {



button.addEventListener("click", function(){



menuButtons.forEach(btn => {

btn.classList.remove("active");

});



this.classList.add("active");



Object.values(panels).forEach(panel => {


const element =
document.getElementById(panel);



if(element){

element.style.display="none";

}


});





const selectedPanel =

document.getElementById(

panels[this.innerText]

);



if(selectedPanel){

selectedPanel.style.display="block";

}



});



});









/*
LOAD EXECUTIVES
*/


const executiveList =

document.getElementById("executive-list");





function loadExecutives(){


if(!executiveList){

return;

}



fetch("data/executives.json")

.then(response => {


if(!response.ok){

throw new Error(

"Unable to load executive data"

);

}


return response.json();


})


.then(data => {



const executives =

data.executives || [];





if(executives.length===0){


executiveList.innerHTML =

"<p>No executives found.</p>";


return;


}




executiveList.innerHTML =


executives.map(executive => `


<div class="dashboard-card">


<h3>

${executive.name}

</h3>


<p>

${executive.title}

</p>


<button>

View Profile

</button>


</div>


`).join("");



})


.catch(error => {



executiveList.innerHTML =

`

<p>

${error.message}

</p>

`;



});



}







loadExecutives();
