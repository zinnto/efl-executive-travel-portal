/*
Jasmine v1.0
Admin Controller
*/


console.log("Jasmine Admin Controller Loaded");





/*
PAGE NAVIGATION
*/


const navButtons =
document.querySelectorAll(".nav-button");



const sections =
document.querySelectorAll(".page-section");





navButtons.forEach(button => {



button.addEventListener("click", function(){



const target =
this.dataset.page;



navButtons.forEach(btn => {

btn.classList.remove("active");

});



this.classList.add("active");



sections.forEach(section => {

section.classList.add("hidden");

});



const selected =
document.getElementById(target);



if(selected){

selected.classList.remove("hidden");

}



});


});









/*
EXECUTIVES
*/


let executives = [];





function loadExecutives(){



executives =
[...Jasmine.getExecutives()];



renderExecutives();



updateDashboard();



}








function renderExecutives(){



const list =
document.getElementById(
"executive-list"
);




if(!list){

return;

}




if(executives.length === 0){


list.innerHTML =

`
<p>
No executives found.
</p>

`;

return;


}






list.innerHTML =



executives.map(executive => `


<div class="executive-card">


<h3>

${executive.name}

</h3>


<p>

${executive.title}

</p>


<p>

${executive.company}

</p>


<p>

${executive.email || ""}

</p>



</div>


`).join("");



}









function updateDashboard(){



const count =
document.getElementById(
"executive-count"
);



if(count){

count.innerText =
executives.length;

}



}









/*
ADD EXECUTIVE FORM
*/


const newExecutiveButton =

document.getElementById(
"new-executive"
);




const executiveForm =

document.getElementById(
"executive-form"
);







if(newExecutiveButton){



newExecutiveButton.addEventListener(
"click",
function(){


executiveForm.classList.toggle(
"hidden"
);


});


}









const saveExecutiveButton =

document.getElementById(
"save-executive"
);






if(saveExecutiveButton){



saveExecutiveButton.addEventListener(
"click",
function(){



const newExecutive = {


id:

"exec" +

String(

executives.length + 1

).padStart(3,"0"),




name:

document.getElementById(
"executive-name"
).value,



title:

document.getElementById(
"executive-title"
).value,



company:

document.getElementById(
"executive-company"
).value,



email:

document.getElementById(
"executive-email"
).value,



phone:

document.getElementById(
"executive-phone"
).value,



status:
"Active"


};






if(!newExecutive.name){


alert(
"Please enter executive name."
);


return;


}





executives.push(newExecutive);



renderExecutives();



updateDashboard();






document.getElementById(
"executive-name"
).value="";

document.getElementById(
"executive-title"
).value="";

document.getElementById(
"executive-company"
).value="";

document.getElementById(
"executive-email"
).value="";

document.getElementById(
"executive-phone"
).value="";





alert(
"Executive added successfully."
);



});


}









/*
WAIT FOR ENGINE
*/


function waitForJasmine(){



if(

Jasmine &&

Jasmine.data &&

Jasmine.data.executives

){


loadExecutives();


}

else{


setTimeout(

waitForJasmine,

200

);


}



}





waitForJasmine();
