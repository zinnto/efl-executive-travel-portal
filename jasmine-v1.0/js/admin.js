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
LOAD EXECUTIVES
*/


function loadExecutives(){



const executives =
Jasmine.getExecutives();



const list =
document.getElementById(
"executive-list"
);



const count =
document.getElementById(
"executive-count"
);





if(count){

count.innerText =
executives.length;

}





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


<span>
${executive.status}
</span>


</div>


`).join("");



}









/*
WAIT FOR DATA ENGINE
*/


function waitForJasmineData(){



if(

Jasmine &&

Jasmine.data &&

Jasmine.data.executives.length > 0

){


loadExecutives();


}

else{


setTimeout(

waitForJasmineData,

200

);


}



}





waitForJasmineData();
