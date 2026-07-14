/*
Jasmine v1.0
executive.js
*/


const params = new URLSearchParams(window.location.search);

const executiveID = params.get("id");

const container = document.getElementById("executive-profile");


function createTripCard(trip){

    const meta = Jasmine.getStatusMeta(trip.status);

    return `

        <div class="trip-card">

        <h3>🌍 ${trip.destination}</h3>

        <p><strong>${trip.purpose || "Business travel"}</strong></p>

        <p>${trip.dates}</p>

        <p><span class="status-badge ${meta.className}">${meta.icon} ${trip.status}</span></p>

        <button onclick="openTrip('${trip.id}')">View Travel Details</button>

        </div>

    `;

}


function displayExecutive(){

    const executive = Jasmine.getExecutiveById(executiveID);


    if(!executive){

        container.innerHTML = `

            <div class="dashboard-card">

            <h3>Unable to load profile</h3>

            <p>No executive found with ID "${executiveID}".</p>

            </div>

        `;

        return;

    }


    const trips = Jasmine.getTripsByExecutive(executive.id);

    const currentTrips = trips.filter(trip => trip.status === "Current");

    const upcomingTrips = trips.filter(trip => trip.status === "Upcoming");

    const historyTrips = trips.filter(trip => trip.status === "Completed");


    container.innerHTML = `

        <div class="dashboard-card executive-header">

        <h2>${executive.name}</h2>

        <p>${executive.title}<br>${executive.company}</p>

        <p style="opacity:.6; font-size:12px;">Trip status updates live · last checked ${new Date().toLocaleTimeString()}</p>

        </div>


        <div class="dashboard-card">

        <h3>🌍 Current Travel</h3>

        ${currentTrips.length ?

            currentTrips.map(trip => createTripCard(trip)).join("")

            : "<p>No current travel</p>"

        }

        </div>


        <div class="dashboard-card">

        <h3>✈ Upcoming Trips</h3>

        ${upcomingTrips.length ?

            upcomingTrips.map(trip => createTripCard(trip)).join("")

            : "<p>No upcoming trips</p>"

        }

        </div>


        <div class="dashboard-card">

        <h3>🗂 Travel History</h3>

        ${historyTrips.length ?

            historyTrips.map(trip => createTripCard(trip)).join("")

            : "<p>No travel history</p>"

        }

        </div>

    `;

}


function openTrip(id){

    window.location.href = `trip.html?id=${id}`;

}


Jasmine.onReady(() => Jasmine.startLiveRefresh(displayExecutive, 30000));
