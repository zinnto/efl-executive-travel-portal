/*
Jasmine v1.0
trip.js
*/


const params = new URLSearchParams(window.location.search);

const tripID = params.get("id");

const container = document.getElementById("trip-dashboard");


function displayTrip(){

    const trip = Jasmine.getTripById(tripID);


    if(!trip){

        container.innerHTML = `

            <div class="dashboard-card">

            <h3>Trip Not Found</h3>

            <p>ID received: ${tripID}</p>

            </div>

        `;

        return;

    }


    const executive = Jasmine.getExecutiveById(trip.executive);

    const flight = trip.flight;

    const hotel = trip.hotel;


    container.innerHTML = `

        <div class="dashboard-card">

        <button onclick="backToExecutive('${trip.executive}')">← Back to Profile</button>

        </div>


        <div class="dashboard-card">

        <h1>${trip.purpose || "Business Trip"}</h1>

        <h2>🌍 ${trip.destination}</h2>

        <p>${trip.dates}</p>

        <p><span class="status-badge ${Jasmine.getStatusMeta(trip.status).className}">${Jasmine.getStatusMeta(trip.status).icon} ${trip.status}</span></p>

        <p style="opacity:.6; font-size:12px;">Status updates live · last checked ${new Date().toLocaleTimeString()}</p>

        </div>


        <div class="dashboard-card">

        <h3>✈ Flight Details</h3>

        ${flight && flight.airline ? `

            <p><strong>Airline:</strong> ${flight.airline}</p>

            <p><strong>Flight:</strong> ${flight.number || "Pending"}</p>

            <p><strong>Route:</strong> ${flight.departureAirport || "?"} → ${flight.arrivalAirport || "?"}</p>

            <p><strong>Departure:</strong> ${flight.departureTime || "Pending"}</p>

        ` : "<p>No flight details added yet</p>"}

        </div>


        <div class="dashboard-card">

        <h3>🏨 Accommodation</h3>

        ${hotel && hotel.name ? `

            <p><strong>Hotel:</strong> ${hotel.name}</p>

            <p>Check-in: ${hotel.checkIn || "Pending"}</p>

            <p>Check-out: ${hotel.checkOut || "Pending"}</p>

        ` : "<p>No accommodation details added yet</p>"}

        </div>


        <div class="dashboard-card">

        <h3>📅 Schedule</h3>

        ${trip.schedule && trip.schedule.length ?

            trip.schedule.map(item => `

                <p><strong>${item.date}</strong><br>${item.time}<br>${item.event}<br>${item.location}</p>

            `).join("")

            : "<p>No schedule items added yet</p>"

        }

        </div>


        <div class="dashboard-card">

        <h3>📄 Documents</h3>

        ${trip.documents && trip.documents.length ?

            trip.documents.map(doc => `

                <div class="document-item">

                <p>

                ${doc.status === "Received" || doc.status === "Verified" ? "✅" : "⏳"}

                <strong>${doc.name}</strong>

                <br>${doc.type || "Document"}

                <br>Status: ${doc.status}

                </p>

                ${doc.link ? `<a href="${doc.link}" target="_blank"><button>View Document</button></a>` : ""}

                </div>

            `).join("")

            : "<p>No documents added yet</p>"

        }

        </div>


        <div class="dashboard-card">

        <h3>✅ Travel Readiness</h3>

        ${trip.readiness.map(item => `

            <p>${item.status === "Complete" ? "✅" : "⏳"} <strong>${item.item}</strong><br>Status: ${item.status}</p>

        `).join("")}

        </div>


        <div class="dashboard-card">

        <h3>📞 Contacts</h3>

        ${trip.contacts && trip.contacts.length ?

            trip.contacts.map(contact => `

                <p><strong>${contact.name}</strong><br>${contact.type}</p>

            `).join("")

            : "<p>No contacts added</p>"

        }

        </div>

    `;

}


function backToExecutive(id){

    window.location.href = `executive.html?id=${id}`;

}


Jasmine.onReady(() => Jasmine.startLiveRefresh(displayTrip, 30000));
