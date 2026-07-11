/*
Jasmine v1.0
admin.js
Stable Build
*/


console.log("Jasmine Admin Loaded");


let executives = [];
let trips = [];



/*
NAVIGATION
*/


const navButtons = document.querySelectorAll(".nav-button");
const sections = document.querySelectorAll(".page-section");


navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const page = button.dataset.page;


        navButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        sections.forEach(section => {
            section.classList.add("hidden");
        });


        const selected = document.getElementById(page);


        if(selected){
            selected.classList.remove("hidden");
        }

    });

});





/*
WAIT FOR DATA
*/


function startJasmine(){


    executives = [...Jasmine.getExecutives()];


    loadExecutiveList();

    updateExecutiveCount();

    populateExecutiveDropdown();

    populateTripOptions();


}



function waitForJasmine(){


    if(
        window.Jasmine &&
        Jasmine.data &&
        Jasmine.data.executives.length > 0
    ){

        startJasmine();

    }
    else{

        setTimeout(waitForJasmine,300);

    }


}





/*
EXECUTIVES
*/


function loadExecutiveList(){


    const container =
    document.getElementById("executive-list");


    if(!container){
        return;
    }



    if(executives.length === 0){

        container.innerHTML =
        "<p>No executives found.</p>";

        return;

    }



    container.innerHTML = executives.map(executive => `

        <div class="executive-card">

            <h3>${executive.name}</h3>

            <p>${executive.title}</p>

            <p>${executive.company}</p>

            <p>${executive.status}</p>

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


const newExecutive =
document.getElementById("new-executive");


const executiveForm =
document.getElementById("executive-form");



if(newExecutive){


    newExecutive.onclick = () => {

        executiveForm.classList.toggle("hidden");

    };


}






const saveExecutive =
document.getElementById("save-executive");



if(saveExecutive){


saveExecutive.onclick = () => {



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


        status:
        "Active"


    };



    if(!executive.name){

        alert("Executive name required");

        return;

    }



    executives.push(executive);


    loadExecutiveList();

    updateExecutiveCount();

    populateExecutiveDropdown();



    executiveForm.classList.add("hidden");


};



}








/*
TRIPS
*/


function populateTripOptions(){


    const executiveDropdown =
    document.getElementById("trip-executive");


    const countryDropdown =
    document.getElementById("trip-country");


    const airlineDropdown =
    document.getElementById("trip-airline");





    if(executiveDropdown){


        executiveDropdown.innerHTML =
        "<option>Select Executive</option>";



        executives.forEach(executive => {


            executiveDropdown.innerHTML +=

            `
            <option value="${executive.id}">
            ${executive.name}
            </option>
            `;


        });


    }






    if(countryDropdown){


        countryDropdown.innerHTML =
        "<option>Select Country</option>";



        Jasmine.getCountries().forEach(country => {


            countryDropdown.innerHTML +=

            `
            <option>
            ${country.name}
            </option>
            `;


        });


    }







    if(airlineDropdown){


        airlineDropdown.innerHTML =
        "<option>Select Airline</option>";



        Jasmine.getAirlines().forEach(airline => {


            airlineDropdown.innerHTML +=

            `
            <option>
            ${airline}
            </option>
            `;


        });


    }



}








const countrySelect =
document.getElementById("trip-country");



if(countrySelect){


countrySelect.onchange = () => {


    const citySelect =
    document.getElementById("trip-city");


    citySelect.innerHTML =
    "<option>Select City</option>";



    Jasmine.getCities(countrySelect.value)
    .forEach(city => {


        citySelect.innerHTML +=

        `
        <option>
        ${city}
        </option>
        `;


    });



};


}








const newTrip =
document.getElementById("new-trip");



const tripForm =
document.getElementById("trip-form");



if(newTrip){


newTrip.onclick = () => {


    tripForm.classList.toggle("hidden");


};


}








const saveTrip =
document.getElementById("save-trip");



if(saveTrip){


saveTrip.onclick = () => {


    const trip = {


        id:
        "trip" +
        String(trips.length + 1).padStart(3,"0"),


        executive:
        document.getElementById("trip-executive").value,


        country:
        document.getElementById("trip-country").value,


        city:
        document.getElementById("trip-city").value,


        airline:
        document.getElementById("trip-airline").value,


        departure:
        document.getElementById("trip-departure").value,


        return:
        document.getElementById("trip-return").value,


        purpose:
        document.getElementById("trip-purpose").value


    };



    trips.push(trip);


    renderTrips();


    tripForm.classList.add("hidden");


};



}








function renderTrips(){


    const list =
    document.getElementById("trip-list");


    if(!list){
        return;
    }



    if(trips.length === 0){

        list.innerHTML =
        "<p>No trips created yet.</p>";

        return;

    }




    list.innerHTML = trips.map(trip => `


        <div class="executive-card">


            <h3>
            ${trip.city}, ${trip.country}
            </h3>


            <p>
            Executive: ${trip.executive}
            </p>


            <p>
            ${trip.airline}
            </p>


            <p>
            ${trip.departure}
            -
            ${trip.return}
            </p>


        </div>


    `).join("");



}







waitForJasmine();
