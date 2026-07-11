/*
Jasmine v1.0
Admin Controller
*/


console.log("Jasmine Admin Controller Loaded");


let executives = [];



/*
NAVIGATION
*/

const navButtons = document.querySelectorAll(".nav-button");
const sections = document.querySelectorAll(".page-section");


navButtons.forEach(button => {

    button.addEventListener("click", function(){

        const target = this.dataset.page;


        navButtons.forEach(btn=>{
            btn.classList.remove("active");
        });


        this.classList.add("active");


        sections.forEach(section=>{
            section.classList.add("hidden");
        });


        const page = document.getElementById(target);


        if(page){
            page.classList.remove("hidden");
        }

    });

});





/*
EXECUTIVES
*/


function loadExecutives(){


    executives = [...Jasmine.getExecutives()];


    renderExecutives();

    updateExecutiveCount();


}




function renderExecutives(){


    const list =
    document.getElementById("executive-list");


    if(!list){
        return;
    }



    if(executives.length === 0){

        list.innerHTML =
        "<p>No executives found.</p>";

        return;

    }



    list.innerHTML = executives.map(executive => `


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
            ${executive.status}
            </p>

        </div>


    `).join("");


}




function updateExecutiveCount(){


    const count =
    document.getElementById("executive-count");


    if(count){

        count.innerText =
        executives.length;

    }


}







/*
ADD EXECUTIVE
*/


const newExecutiveButton =
document.getElementById("new-executive");


const executiveForm =
document.getElementById("executive-form");



if(newExecutiveButton){


    newExecutiveButton.onclick = function(){


        executiveForm.classList.toggle("hidden");


    };


}







const saveExecutiveButton =
document.getElementById("save-executive");



if(saveExecutiveButton){


saveExecutiveButton.onclick = function(){


    const executive = {


        id:
        "exec" +
        String(executives.length + 1).padStart(3,"0"),


        name:
        document.getElementById("executive-name").value,


        title:
        document.getElementById("executive-title").value,


        company:
        document.getElementById("executive-company").value,


        email:
        document.getElementById("executive-email").value,


        phone:
        document.getElementById("executive-phone").value,


        status:"Active"


    };



    if(!executive.name){

        alert("Executive name required.");

        return;

    }



    executives.push(executive);


    renderExecutives();

    updateExecutiveCount();


    executiveForm.classList.add("hidden");


};



}









/*
WAIT FOR DATA ENGINE
*/


function waitForData(){



    if(
        Jasmine &&
        Jasmine.data &&
        Jasmine.data.executives &&
        Jasmine.data.executives.length > 0
    ){

        loadExecutives();

    }
    else{

        setTimeout(
            waitForData,
            300
        );

    }


}



waitForData();
