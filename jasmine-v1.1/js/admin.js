/*
Jasmine v1.0
admin.js
Controller Build 2.0 — wired to the shared Jasmine data engine
*/


console.log("Jasmine Admin Loaded");


let activeTrip = null;



/*
TOAST
*/


function showToast(message){

    const existing = document.querySelector(".toast");

    if(existing) existing.remove();

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => toast.remove(), 300);

    }, 2200);

}



/*
NAVIGATION
*/


const navButtons = document.querySelectorAll(".nav-button");

const sections = document.querySelectorAll(".page-section");


navButtons.forEach(button => {

    button.onclick = function(){

        const target = this.dataset.page;

        navButtons.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        sections.forEach(section => section.classList.add("hidden"));

        const page = document.getElementById(target);

        if(page){

            page.classList.remove("hidden");

        }

        if(target === "dashboard"){

            renderDashboard();

        }

    };

});



/*
INITIALISE
*/


function startJasmine(){

    loadExecutives();

    loadTripDropdowns();

    renderTrips();

    renderDashboard();

    loadSettings();

}


Jasmine.onReady(startJasmine);



/*
DASHBOARD
*/


function renderDashboard(){

    const executives = Jasmine.getExecutives();

    const trips = Jasmine.getTrips();


    const executiveCount = document.getElementById("executive-count");

    if(executiveCount){

        executiveCount.innerText = executives.length;

    }


    const activeTripCount = document.getElementById("active-trip-count");

    if(activeTripCount){

        const active = trips.filter(trip =>

            trip.status === "Upcoming" || trip.status === "Current"

        );

        activeTripCount.innerText = active.length;

    }


    const pendingCount = document.getElementById("pending-count");

    if(pendingCount){

        pendingCount.innerText = Jasmine.getPendingCount();

    }


    const upcomingBox = document.getElementById("upcoming-trips");

    if(upcomingBox){

        const upcoming = trips.filter(trip => trip.status === "Upcoming");

        upcomingBox.innerHTML = upcoming.length ?

            upcoming.map(trip => `

                <div class="executive-card">

                <h3>${trip.executiveName}</h3>

                <p>${trip.destination} — ${trip.dates}</p>

                </div>

            `).join("")

            : "<p>No upcoming trips.</p>";

    }


    const pendingBox = document.getElementById("pending-items");

    if(pendingBox){

        const attention = [];

        trips.forEach(trip => {

            trip.readiness

                .filter(item => item.status !== "Complete")

                .forEach(item => {

                    attention.push(`${trip.executiveName}: ${item.item} pending`);

                });

        });

        pendingBox.innerHTML = attention.length ?

            attention.map(item => `

                <div class="executive-card">

                <p>${item}</p>

                </div>

            `).join("")

            : "<p>Nothing needs attention right now.</p>";

    }

}



/*
EXECUTIVES
*/


function loadExecutives(){

    renderExecutives();

    populateExecutiveDropdown();

}


function renderExecutives(){

    const list = document.getElementById("executive-list");

    if(!list) return;

    const executives = Jasmine.getExecutives();

    list.innerHTML = executives.map(executive => `

        <div class="executive-card">

        <h3>${executive.name}</h3>

        <p>${executive.title}</p>

        <p>${executive.company}</p>

        </div>

    `).join("");

}


function populateExecutiveDropdown(){

    const select = document.getElementById("trip-executive");

    if(!select) return;

    select.innerHTML = "<option value=''>Select Executive</option>";

    Jasmine.getExecutives().forEach(executive => {

        select.innerHTML += `<option value="${executive.id}">${executive.name}</option>`;

    });

}



/*
ADD EXECUTIVE
*/


const newExecutive = document.getElementById("new-executive");

const executiveForm = document.getElementById("executive-form");


if(newExecutive){

    newExecutive.onclick = function(){

        executiveForm.classList.toggle("hidden");

    };

}


const saveExecutive = document.getElementById("save-executive");


if(saveExecutive){

    saveExecutive.onclick = function(){

        const name = document.getElementById("executive-name").value.trim();

        if(!name){

            showToast("Executive name is required");

            return;

        }

        Jasmine.addExecutive({

            name,

            title: document.getElementById("executive-title").value,

            company: document.getElementById("executive-company").value,

            email: document.getElementById("executive-email").value,

            phone: document.getElementById("executive-phone").value

        });

        loadExecutives();

        renderDashboard();

        executiveForm.classList.add("hidden");

        ["executive-name","executive-title","executive-company","executive-email","executive-phone"]

            .forEach(id => document.getElementById(id).value = "");

        showToast("Executive added");

    };

}



/*
TRIP DROPDOWNS
*/


function loadTripDropdowns(){

    const country = document.getElementById("trip-country");

    const airline = document.getElementById("trip-airline");


    if(country){

        country.innerHTML = "<option value=''>Select Country</option>";

        Jasmine.getCountries().forEach(item => {

            country.innerHTML += `<option>${item.name}</option>`;

        });

    }


    if(airline){

        airline.innerHTML = "<option value=''>Select Airline</option>";

        Jasmine.getAirlines().forEach(item => {

            airline.innerHTML += `<option>${item}</option>`;

        });

    }

}


const countrySelect = document.getElementById("trip-country");


if(countrySelect){

    countrySelect.onchange = function(){

        const city = document.getElementById("trip-city");

        city.innerHTML = "<option value=''>Select City</option>";

        Jasmine.getCities(this.value).forEach(item => {

            city.innerHTML += `<option>${item}</option>`;

        });

    };

}



/*
TRIPS
*/


const newTrip = document.getElementById("new-trip");

const tripForm = document.getElementById("trip-form");


if(newTrip){

    newTrip.onclick = function(){

        tripForm.classList.toggle("hidden");

    };

}


const saveTripButton = document.getElementById("save-trip");


if(saveTripButton){

    saveTripButton.onclick = function(){

        const executive = document.getElementById("trip-executive").value;

        const departure = document.getElementById("trip-departure").value;


        if(!executive || !departure){

            showToast("Executive and departure date are required");

            return;

        }


        Jasmine.addTrip({

            executive,

            country: document.getElementById("trip-country").value,

            city: document.getElementById("trip-city").value,

            airline: document.getElementById("trip-airline").value,

            departure,

            return: document.getElementById("trip-return").value,

            purpose: document.getElementById("trip-purpose").value

        });


        renderTrips();

        renderDashboard();

        tripForm.classList.add("hidden");

        showToast("Trip created");

    };

}


function renderTrips(){

    const list = document.getElementById("trip-list");

    if(!list) return;

    const trips = Jasmine.getTrips();

    list.innerHTML = trips.length ?

        trips.map(trip => `

            <div class="executive-card" data-trip="${trip.id}">

            <h3>${trip.destination}</h3>

            <p>${trip.executiveName} · ${trip.airline || "Airline TBC"}</p>

            <p>${trip.status} · ${trip.readinessPercent}% Ready</p>

            </div>

        `).join("")

        : "<p>No trips created yet.</p>";


    document.querySelectorAll("[data-trip]").forEach(card => {

        card.onclick = function(){

            openTripWorkspace(this.dataset.trip);

        };

    });

}


function openTripWorkspace(tripId){

    activeTrip = Jasmine.getTripById(tripId);

    if(!activeTrip) return;


    document.getElementById("trip-workspace").classList.remove("hidden");


    document.getElementById("trip-summary").innerHTML = `

        <h3>${activeTrip.destination}</h3>

        <p>Executive: ${activeTrip.executiveName}</p>

        <p>Purpose: ${activeTrip.purpose || "—"}</p>

        <p>Status: ${activeTrip.status}</p>

    `;


    renderFlight();

    renderHotel();

    renderDocuments();

    renderReadiness();

}



/*
READINESS
*/


function renderReadiness(){

    const box = document.getElementById("readiness-summary");

    if(!box || !activeTrip) return;


    box.innerHTML = `

        <div class="executive-card">

        <h3>${activeTrip.readinessPercent}% Ready</h3>

        ${activeTrip.readiness.map(item => `

            <p>${item.status === "Complete" ? "✔" : "⚠"} ${item.item} ${item.status === "Complete" ? "added" : "missing"}</p>

        `).join("")}

        </div>

    `;

}



/*
RENDER HELPERS
*/


function renderFlight(){

    const box = document.getElementById("flight-summary");

    if(!box || !activeTrip) return;

    const flight = activeTrip.flight;

    box.innerHTML = (flight && flight.airline) ?

        `<div class="executive-card">

        <h3>${flight.airline} ${flight.number || ""}</h3>

        <p>${flight.departureAirport || "?"} → ${flight.arrivalAirport || "?"}</p>

        </div>`

        : "<p>No flight added yet.</p>";

}


function renderHotel(){

    const box = document.getElementById("hotel-summary");

    if(!box || !activeTrip) return;

    const hotel = activeTrip.hotel;

    box.innerHTML = (hotel && hotel.name) ?

        `<div class="executive-card">

        <h3>${hotel.name}</h3>

        <p>${hotel.city || ""}</p>

        </div>`

        : "<p>No hotel added yet.</p>";

}


function renderDocuments(){

    const box = document.getElementById("document-summary");

    if(!box || !activeTrip) return;

    const documents = activeTrip.documents || [];

    box.innerHTML = documents.length ?

        documents.map(doc => `

            <div class="executive-card">

            <h3>${doc.name}</h3>

            <p>${doc.status}</p>

            </div>

        `).join("")

        : "<p>No documents added yet.</p>";

}



/*
FLIGHT SAVE
*/


document.getElementById("save-flight")?.addEventListener("click", () => {

    if(!activeTrip) return;


    const flight = {

        airline: document.getElementById("flight-airline").value,

        number: document.getElementById("flight-number").value,

        departureAirport: document.getElementById("flight-departure-airport").value,

        arrivalAirport: document.getElementById("flight-arrival-airport").value,

        departureTime: document.getElementById("flight-departure-time").value,

        arrivalTime: document.getElementById("flight-arrival-time").value,

        booking: document.getElementById("flight-booking").value

    };


    activeTrip = Jasmine.updateTrip(activeTrip.id, { flight });


    renderFlight();

    renderReadiness();

    renderTrips();

    showToast("Flight saved");

});



/*
HOTEL SAVE
*/


document.getElementById("save-hotel")?.addEventListener("click", () => {

    if(!activeTrip) return;


    const hotel = {

        name: document.getElementById("hotel-name").value,

        city: document.getElementById("hotel-city").value,

        checkIn: document.getElementById("hotel-checkin").value,

        checkOut: document.getElementById("hotel-checkout").value,

        booking: document.getElementById("hotel-booking").value

    };


    activeTrip = Jasmine.updateTrip(activeTrip.id, { hotel });


    renderHotel();

    renderReadiness();

    renderTrips();

    showToast("Hotel saved");

});



/*
DOCUMENT SAVE
*/


document.getElementById("save-document")?.addEventListener("click", () => {

    if(!activeTrip) return;


    const name = document.getElementById("document-name").value.trim();

    if(!name){

        showToast("Document name is required");

        return;

    }


    activeTrip = Jasmine.addDocumentToTrip(activeTrip.id, {

        type: document.getElementById("document-type").value,

        name,

        link: document.getElementById("document-link").value,

        status: document.getElementById("document-status").value

    });


    renderDocuments();

    renderReadiness();

    renderTrips();

    document.getElementById("document-name").value = "";

    document.getElementById("document-link").value = "";

    showToast("Document saved");

});



/*
SETTINGS
*/


function loadSettings(){

    const settings = Jasmine.getSettings();

    const org = document.getElementById("setting-organisation");

    const tz = document.getElementById("setting-timezone");

    const currency = document.getElementById("setting-currency");

    const assistant = document.getElementById("setting-assistant");


    if(org) org.value = settings.organisation || "";

    if(tz) tz.value = settings.timezone || "";

    if(currency) currency.value = settings.currency || "";

    if(assistant) assistant.value = settings.defaultAssistant || "";

}


document.getElementById("save-settings")?.addEventListener("click", () => {

    Jasmine.updateSettings({

        organisation: document.getElementById("setting-organisation").value,

        timezone: document.getElementById("setting-timezone").value,

        currency: document.getElementById("setting-currency").value,

        defaultAssistant: document.getElementById("setting-assistant").value

    });

    showToast("Settings saved");

});
