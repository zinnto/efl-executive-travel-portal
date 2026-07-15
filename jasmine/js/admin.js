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

    loadGitHubSettings();

    Jasmine.startLiveRefresh(refreshLiveStatuses, 30000);

}


Jasmine.onReady(startJasmine);


/*
LIVE STATUS REFRESH

Keeps Upcoming / Current / Completed badges (and readiness) accurate
without needing a manual page reload — re-renders the trip list, the
dashboard counts, and the open trip workspace (if any) on an interval
and whenever the tab regains focus.
*/


function refreshLiveStatuses(){

    renderTrips();

    renderDashboard();

    if(activeTrip){

        const refreshed = Jasmine.getTripById(activeTrip.id);

        if(refreshed){

            activeTrip = refreshed;

            renderTripSummary();

            renderReadiness();

        }

    }

}



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

        <div class="executive-card-actions">

        <button data-view-profile="${executive.id}">👤 View Profile</button>

        <button data-trip-summary="${executive.id}" style="background:#555;">🧳 Trip Summary</button>

        </div>

        </div>

    `).join("");


    list.querySelectorAll("[data-view-profile]").forEach(button => {

        button.onclick = function(){

            window.open("index.html", "_blank");

        };

    });


    list.querySelectorAll("[data-trip-summary]").forEach(button => {

        button.onclick = function(){

            showTripsForExecutive(this.dataset.tripSummary);

        };

    });

}


function populateExecutiveDropdown(){

    ["trip-executive", "edit-trip-executive"].forEach(id => {

        const select = document.getElementById(id);

        if(!select) return;

        select.innerHTML = "<option value=''>Select Executive</option>";

        Jasmine.getExecutives().forEach(executive => {

            select.innerHTML += `<option value="${executive.id}">${executive.name}</option>`;

        });

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


function renderChecklistOptions(containerId, selectedKeys){

    const box = document.getElementById(containerId);

    if(!box) return;

    const options = Jasmine.getChecklistOptions();

    box.innerHTML = `

        <div class="checklist-options">

        ${options.map(option => `

            <label class="checklist-option">

            <input type="checkbox" value="${option.key}"

                ${selectedKeys.includes(option.key) ? "checked" : ""}>

            ${option.label}

            </label>

        `).join("")}

        </div>

    `;

}


function getCheckedChecklist(containerId){

    const box = document.getElementById(containerId);

    if(!box) return [];

    return Array.from(box.querySelectorAll("input[type='checkbox']:checked"))

        .map(input => input.value);

}


function populateCountryDropdown(select){

    if(!select) return;

    select.innerHTML = "<option value=''>Select Country</option>";

    Jasmine.getCountries().forEach(item => {

        select.innerHTML += `<option>${item.name}</option>`;

    });

}


function populateAirlineDropdown(select){

    if(!select) return;

    select.innerHTML = "<option value=''>Select Airline</option>";

    Jasmine.getAirlines().forEach(item => {

        select.innerHTML += `<option>${item}</option>`;

    });

}


function populateCityDropdown(select, countryName, selectedCity){

    if(!select) return;

    select.innerHTML = "<option value=''>Select City</option>";

    Jasmine.getCities(countryName).forEach(item => {

        select.innerHTML += `<option ${item === selectedCity ? "selected" : ""}>${item}</option>`;

    });

}


function loadTripDropdowns(){

    renderChecklistOptions("trip-checklist-options", Jasmine.getDefaultChecklist());


    populateCountryDropdown(document.getElementById("trip-country"));

    populateAirlineDropdown(document.getElementById("trip-airline"));

    populateCountryDropdown(document.getElementById("edit-trip-country"));

    populateAirlineDropdown(document.getElementById("edit-trip-airline"));

}


const countrySelect = document.getElementById("trip-country");


if(countrySelect){

    countrySelect.onchange = function(){

        populateCityDropdown(document.getElementById("trip-city"), this.value);

    };

}


const editCountrySelect = document.getElementById("edit-trip-country");


if(editCountrySelect){

    editCountrySelect.onchange = function(){

        populateCityDropdown(document.getElementById("edit-trip-city"), this.value);

    };

}


const airlineSelect = document.getElementById("trip-airline");


if(airlineSelect){

    airlineSelect.onchange = function(){

        const linkBox = document.getElementById("trip-airline-link");

        if(!linkBox) return;

        const website = Jasmine.getAirlineWebsite(this.value);

        linkBox.innerHTML = website ?

            `<a href="${website}" target="_blank">Check ${this.value}'s current routes ↗</a>`

            : "";

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


        const checklist = getCheckedChecklist("trip-checklist-options");


        Jasmine.addTrip({

            executive,

            country: document.getElementById("trip-country").value,

            city: document.getElementById("trip-city").value,

            airline: document.getElementById("trip-airline").value,

            departure,

            return: document.getElementById("trip-return").value,

            purpose: document.getElementById("trip-purpose").value,

            checklist: checklist.length ? checklist : Jasmine.getDefaultChecklist()

        });


        renderTrips();

        renderDashboard();

        tripForm.classList.add("hidden");

        renderChecklistOptions("trip-checklist-options", Jasmine.getDefaultChecklist());

        showToast("Trip created");

    };

}


let tripFilterExecutiveId = null;


function renderTripFilterBar(){

    const bar = document.getElementById("trip-filter-bar");

    if(!bar) return;

    if(!tripFilterExecutiveId){

        bar.classList.add("hidden");

        bar.innerHTML = "";

        return;

    }

    const executive = Jasmine.getExecutiveById(tripFilterExecutiveId);

    bar.classList.remove("hidden");

    bar.innerHTML = `

        <span>Showing trips for ${executive ? executive.name : "this executive"}</span>

        <button id="clear-trip-filter">Clear filter</button>

    `;

    document.getElementById("clear-trip-filter").onclick = () => {

        tripFilterExecutiveId = null;

        renderTrips();

    };

}


function showTripsForExecutive(executiveId){

    tripFilterExecutiveId = executiveId;

    navButtons.forEach(btn => btn.classList.remove("active"));

    const tripsNavButton = document.querySelector('.nav-button[data-page="trips"]');

    if(tripsNavButton) tripsNavButton.classList.add("active");

    sections.forEach(section => section.classList.add("hidden"));

    document.getElementById("trips")?.classList.remove("hidden");

    renderTrips();

}


function renderTrips(){

    const list = document.getElementById("trip-list");

    if(!list) return;

    renderTripFilterBar();

    const trips = Jasmine.getTrips().filter(trip =>

        !tripFilterExecutiveId || trip.executive === tripFilterExecutiveId

    );

    list.innerHTML = trips.length ?

        trips.map(trip => {

            const meta = Jasmine.getStatusMeta(trip.status);

            return `

            <div class="trip-list-card" data-trip="${trip.id}">

            <div class="trip-list-card-top">

            <div>

            <h3>${trip.destination}</h3>

            <p>${trip.executiveName} · ${trip.airline || "Airline TBC"}</p>

            <p><span class="status-badge ${meta.className}">${meta.icon} ${trip.status}</span> · ${trip.readinessPercent}% Ready</p>

            </div>

            <div class="trip-list-card-actions">

            <button data-details="${trip.id}">Show More Details</button>

            <button data-remove="${trip.id}" style="background:#c0392b;">Remove</button>

            </div>

            </div>

            </div>

        `;

        }).join("")

        : "<p>No trips created yet.</p>";


    document.querySelectorAll("[data-details]").forEach(button => {

        button.onclick = function(event){

            event.stopPropagation();

            openTripWorkspace(this.dataset.details);

        };

    });


    document.querySelectorAll("[data-remove]").forEach(button => {

        button.onclick = function(event){

            event.stopPropagation();

            removeTrip(this.dataset.remove);

        };

    });

}


function removeTrip(tripId){

    const trip = Jasmine.getTripById(tripId);

    if(!trip) return;

    const confirmed = confirm(`Remove the trip to ${trip.destination} for ${trip.executiveName}? This can't be undone.`);

    if(!confirmed) return;

    Jasmine.deleteTrip(tripId);

    if(activeTrip && activeTrip.id === tripId){

        activeTrip = null;

        document.getElementById("trip-workspace").classList.add("hidden");

    }

    renderTrips();

    renderDashboard();

    showToast("Trip removed");

}


function openTripWorkspace(tripId){

    activeTrip = Jasmine.getTripById(tripId);

    if(!activeTrip) return;


    document.getElementById("trip-workspace").classList.remove("hidden");

    setTripEditMode(false);

    editingDocumentIndex = null;

    const saveDocButton = document.getElementById("save-document");

    if(saveDocButton) saveDocButton.innerText = "Save Document";


    renderTripSummary();

    renderFlight();

    renderHotel();

    renderDocuments();

    renderContacts();

    renderReadiness();

    renderChecklistOptions("workspace-checklist-options", activeTrip.checklist || Jasmine.getDefaultChecklist());

    loadEditTripDetails();


    document.getElementById("trip-workspace").scrollIntoView({ behavior: "smooth", block: "start" });

}


function renderTripSummary(){

    const box = document.getElementById("trip-summary");

    if(!box || !activeTrip) return;

    const meta = Jasmine.getStatusMeta(activeTrip.status);

    box.innerHTML = `

        <h3>${activeTrip.destination}</h3>

        <p>Executive: ${activeTrip.executiveName}</p>

        <p>Purpose: ${activeTrip.purpose || "—"}</p>

        <p>${activeTrip.dates || ""}</p>

        <p><span class="status-badge ${meta.className}">${meta.icon} ${activeTrip.status}</span></p>

    `;

}


function setTripEditMode(isEditing){

    const panel = document.getElementById("trip-edit-panel");

    const toggle = document.getElementById("toggle-trip-edit");

    if(panel) panel.classList.toggle("hidden", !isEditing);

    if(toggle) toggle.innerText = isEditing ? "✔ Done Editing" : "✏ Edit Trip";

}


document.getElementById("toggle-trip-edit")?.addEventListener("click", () => {

    const panel = document.getElementById("trip-edit-panel");

    const isCurrentlyHidden = panel ? panel.classList.contains("hidden") : true;

    setTripEditMode(isCurrentlyHidden);

});


document.getElementById("close-trip-workspace")?.addEventListener("click", () => {

    activeTrip = null;

    document.getElementById("trip-workspace").classList.add("hidden");

});


function loadEditTripDetails(){

    if(!activeTrip) return;

    const executive = document.getElementById("edit-trip-executive");

    const country = document.getElementById("edit-trip-country");

    const city = document.getElementById("edit-trip-city");

    const airline = document.getElementById("edit-trip-airline");

    const departure = document.getElementById("edit-trip-departure");

    const ret = document.getElementById("edit-trip-return");

    const purpose = document.getElementById("edit-trip-purpose");


    if(executive) executive.value = activeTrip.executive || "";

    if(country) country.value = activeTrip.country || "";

    if(city) populateCityDropdown(city, activeTrip.country, activeTrip.city);

    if(airline) airline.value = activeTrip.airline || "";

    if(departure) departure.value = activeTrip.departure || "";

    if(ret) ret.value = activeTrip.return || "";

    if(purpose) purpose.value = activeTrip.purpose || "";

}


document.getElementById("save-trip-details")?.addEventListener("click", () => {

    if(!activeTrip) return;


    const executive = document.getElementById("edit-trip-executive").value;

    const departure = document.getElementById("edit-trip-departure").value;


    if(!executive || !departure){

        showToast("Executive and departure date are required");

        return;

    }


    activeTrip = Jasmine.updateTrip(activeTrip.id, {

        executive,

        country: document.getElementById("edit-trip-country").value,

        city: document.getElementById("edit-trip-city").value,

        airline: document.getElementById("edit-trip-airline").value,

        departure,

        return: document.getElementById("edit-trip-return").value,

        purpose: document.getElementById("edit-trip-purpose").value

    });


    renderTripSummary();


    renderReadiness();

    renderTrips();

    renderDashboard();

    showToast("Trip details updated");

});



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

        documents.map((doc, index) => `

            <div class="executive-card" style="position:relative;">

            <div style="position:absolute; top:14px; right:14px;">

            <button class="doc-edit-btn" data-doc-edit="${index}" style="padding:6px 12px; font-size:12px;">Edit</button>

            <button class="doc-remove-btn" data-doc-remove="${index}" style="background:#c0392b; padding:6px 12px; font-size:12px;">Remove</button>

            </div>

            <h3>${doc.name}</h3>

            <p>${doc.type || ""} · ${doc.status}</p>

            </div>

        `).join("")

        : "<p>No documents added yet.</p>";


    document.querySelectorAll("[data-doc-edit]").forEach(button => {

        button.onclick = function(){

            startEditDocument(Number(this.dataset.docEdit));

        };

    });


    document.querySelectorAll("[data-doc-remove]").forEach(button => {

        button.onclick = function(){

            removeDocument(Number(this.dataset.docRemove));

        };

    });

}


let editingDocumentIndex = null;


function startEditDocument(index){

    if(!activeTrip) return;

    const doc = (activeTrip.documents || [])[index];

    if(!doc) return;

    editingDocumentIndex = index;

    setTripEditMode(true);

    document.getElementById("document-type").value = doc.type || "Select Type";

    document.getElementById("document-name").value = doc.name || "";

    document.getElementById("document-link").value = doc.link || "";

    document.getElementById("document-status").value = doc.status || "Pending";

    const saveButton = document.getElementById("save-document");

    if(saveButton) saveButton.innerText = "Update Document";

    document.getElementById("documents-section")?.scrollIntoView({ behavior: "smooth", block: "center" });

}


function resetDocumentForm(){

    editingDocumentIndex = null;

    document.getElementById("document-name").value = "";

    document.getElementById("document-link").value = "";

    const saveButton = document.getElementById("save-document");

    if(saveButton) saveButton.innerText = "Save Document";

}


function removeDocument(index){

    if(!activeTrip) return;

    const doc = (activeTrip.documents || [])[index];

    if(!doc) return;

    const confirmed = confirm(`Remove the document "${doc.name}"?`);

    if(!confirmed) return;

    activeTrip = Jasmine.removeDocumentFromTrip(activeTrip.id, index);

    if(editingDocumentIndex === index) resetDocumentForm();

    renderDocuments();

    renderReadiness();

    renderTrips();

    showToast("Document removed");

}


function renderContacts(){

    const box = document.getElementById("contact-summary");

    if(!box || !activeTrip) return;

    const contacts = activeTrip.contacts || [];

    box.innerHTML = contacts.length ?

        contacts.map((contact, index) => `

            <div class="executive-card" style="position:relative;">

            <button class="contact-remove-btn" data-contact-remove="${index}"
                style="position:absolute; top:14px; right:14px; background:#c0392b; padding:6px 12px; font-size:12px;">
                Remove
            </button>

            <h3>${contact.name}</h3>

            <p>${contact.type}</p>

            </div>

        `).join("")

        : "<p>No contacts added yet.</p>";


    document.querySelectorAll("[data-contact-remove]").forEach(button => {

        button.onclick = function(){

            removeContact(Number(this.dataset.contactRemove));

        };

    });

}


function removeContact(index){

    if(!activeTrip) return;

    const contact = (activeTrip.contacts || [])[index];

    if(!contact) return;

    const confirmed = confirm(`Remove the contact "${contact.name}"?`);

    if(!confirmed) return;

    activeTrip = Jasmine.removeContactFromTrip(activeTrip.id, index);

    renderContacts();

    renderTrips();

    showToast("Contact removed");

}


document.getElementById("delete-trip")?.addEventListener("click", () => {

    if(!activeTrip) return;

    removeTrip(activeTrip.id);

});



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



document.getElementById("cancel-document-edit")?.addEventListener("click", () => {

    resetDocumentForm();

    document.getElementById("document-type").value = "Select Type";

    document.getElementById("document-status").value = "Pending";

    showToast("Edit cancelled");

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


    const payload = {

        type: document.getElementById("document-type").value,

        name,

        link: document.getElementById("document-link").value,

        status: document.getElementById("document-status").value

    };


    if(editingDocumentIndex !== null){

        activeTrip = Jasmine.updateDocumentInTrip(activeTrip.id, editingDocumentIndex, payload);

        showToast("Document updated");

    } else {

        activeTrip = Jasmine.addDocumentToTrip(activeTrip.id, payload);

        showToast("Document saved");

    }


    resetDocumentForm();

    renderDocuments();

    renderReadiness();

    renderTrips();

});



/*
CONTACT SAVE
*/


document.getElementById("save-contact")?.addEventListener("click", () => {

    if(!activeTrip) return;


    const name = document.getElementById("contact-name").value.trim();

    if(!name){

        showToast("Contact name is required");

        return;

    }


    activeTrip = Jasmine.addContactToTrip(activeTrip.id, {

        name,

        type: document.getElementById("contact-type").value

    });


    renderContacts();

    document.getElementById("contact-name").value = "";

    document.getElementById("contact-type").value = "";

    showToast("Contact saved");

});



/*
CHECKLIST UPDATE
*/


document.getElementById("save-checklist")?.addEventListener("click", () => {

    if(!activeTrip) return;


    const checklist = getCheckedChecklist("workspace-checklist-options");


    if(!checklist.length){

        showToast("Select at least one checklist item");

        return;

    }


    activeTrip = Jasmine.updateTrip(activeTrip.id, { checklist });


    renderReadiness();

    renderTrips();

    renderDashboard();

    showToast("Checklist updated");

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



/*
PUBLISH & SYNC
*/


function downloadJSON(filename, dataObj){

    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


document.getElementById("export-data")?.addEventListener("click", () => {

    const data = Jasmine.exportData();

    downloadJSON("executives.json", { executives: data.executives });

    downloadJSON("trips.json", { trips: data.trips });

    downloadJSON("settings.json", data.settings);

    showToast("Data exported — replace the files in data/ and push");

});


document.getElementById("reload-data")?.addEventListener("click", async () => {

    const confirmed = confirm(

        "This discards any unpublished changes in this browser and reloads " +

        "whatever is currently published in data/*.json. Continue?"

    );

    if(!confirmed) return;


    await Jasmine.reloadFromFiles();

    showToast("Reloaded from published data");

    setTimeout(() => location.reload(), 800);

});



/*
GITHUB PUBLISHING
*/


function loadGitHubSettings(){

    const config = Jasmine.getGitHubConfig();

    if(!config) return;

    const owner = document.getElementById("github-owner");

    const repo = document.getElementById("github-repo");

    const branch = document.getElementById("github-branch");

    const token = document.getElementById("github-token");

    if(owner) owner.value = config.owner || "";

    if(repo) repo.value = config.repo || "";

    if(branch) branch.value = config.branch || "main";

    if(token) token.value = config.token || "";

}


document.getElementById("save-github-settings")?.addEventListener("click", () => {

    const owner = document.getElementById("github-owner").value.trim();

    const repo = document.getElementById("github-repo").value.trim();

    const branch = document.getElementById("github-branch").value.trim() || "main";

    const token = document.getElementById("github-token").value.trim();


    if(!owner || !repo || !token){

        showToast("Owner, repo, and token are all required");

        return;

    }


    Jasmine.saveGitHubConfig({ owner, repo, branch, token });

    showToast("GitHub settings saved");

});


document.getElementById("publish-to-github")?.addEventListener("click", async () => {

    const statusBox = document.getElementById("github-publish-status");

    const button = document.getElementById("publish-to-github");


    const confirmed = confirm(

        "This pushes your current executives, trips, and settings straight " +

        "to the live repo, and bumps the data version so every visitor " +

        "refreshes to it automatically. Continue?"

    );

    if(!confirmed) return;


    button.disabled = true;

    button.innerText = "Publishing...";

    if(statusBox) statusBox.innerText = "Publishing to GitHub — this can take a few seconds...";


    try {

        await Jasmine.publishAllData();

        if(statusBox) statusBox.innerText = "✔ Published. GitHub Pages usually redeploys within a minute or two.";

        showToast("Published to GitHub");

    } catch(error){

        if(statusBox) statusBox.innerText = "⚠ " + error.message;

        showToast("Publish failed — see message below the button");

    } finally {

        button.disabled = false;

        button.innerText = "Publish All Data to GitHub";

    }

});
