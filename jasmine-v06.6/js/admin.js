console.log("Jasmine Admin Loaded");


const executiveList =
document.getElementById("executive-list");


const generateButton =
document.getElementById("generate-executive");



let existingExecutives = [];





loadExecutives();







function loadExecutives(){



fetch("data/executives.json")


.then(response => {


if(!response.ok){

throw new Error("Could not load executives.json");

}


return response.json();


})


.then(data => {


existingExecutives = data.executives || [];


displayExecutives();


})


.catch(error => {


executiveList.innerHTML = `

<p>

Unable to load executives.

<br>

${error.message}

</p>

`;



});


}








function displayExecutives(){


if(existingExecutives.length === 0){


executiveList.innerHTML = `

<p>
No executives found.
</p>

`;

return;


}




executiveList.innerHTML =


existingExecutives.map(executive => `


<div class="dashboard-card">


<h3>

${executive.name}

</h3>


<p>

${executive.title}

</p>



<button onclick="editExecutive('${executive.id}')">

Edit

</button>


</div>



`).join("");



}








generateButton.addEventListener("click", function(){



const id =
document.getElementById("executive-id").value.trim();



const name =
document.getElementById("executive-name").value.trim();



const title =
document.getElementById("executive-title").value.trim();



const company =
document.getElementById("executive-company").value.trim();






if(!id || !name || !title || !company){


alert("Please complete all fields.");

return;


}





const exists = existingExecutives.some(executive =>

executive.id === id

);




if(exists){


alert(

"Executive ID already exists. Please use Edit instead."

);


return;


}






const executiveData = {


"profile": {


"name": name,


"title": title,


"company": company


},


"trips": {


"current": [],


"upcoming": [],


"history": []

}


};






downloadJSON(

executiveData,

id + ".json"

);



});









function editExecutive(id){


alert(

"Edit function will be added in the next module: " + id

);


}









function downloadJSON(data, filename){



const fileContent =

JSON.stringify(

data,

null,

2

);




const blob = new Blob(

[fileContent],

{

type:"application/json"

}

);




const link = document.createElement("a");



link.href =
URL.createObjectURL(blob);



link.download =
filename;



link.click();



URL.revokeObjectURL(link.href);



alert(

"Executive JSON created successfully."

);



}
