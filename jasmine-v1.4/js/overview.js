/*
Jasmine v1.0
overview.js
*/


const container = document.getElementById("overview-container");


function progressBar(percent){

    return `

        <div class="progress-container">

        <div class="progress-bar" style="width:${percent}%"></div>

        </div>

    `;

}


function displayOverview(){

    const executives = Jasmine.getExecutives();

    const attentionItems = [];


    if(!executives.length){

        container.innerHTML = `

            <div class="dashboard-card">

            <h3>No executives added yet</h3>

            <p>Add an executive in the admin dashboard to get started.</p>

            </div>

        `;

        return;

    }


    const cards = executives.map(executive => {

        const trips = Jasmine.getTripsByExecutive(executive.id);

        const current = trips.find(trip => trip.status === "Current");

        const upcoming = trips.filter(trip => trip.status === "Upcoming");

        const focusTrip = current || upcoming[0];


        if(!focusTrip){

            return `

                <div class="dashboard-card executive-card">

                <h2>${executive.name}</h2>

                <p>${executive.title}<br>${executive.company}</p>

                <p>No trips scheduled</p>

                <button onclick="openProfile('${executive.id}')">Open Profile</button>

                </div>

            `;

        }


        focusTrip.readiness

            .filter(item => item.status !== "Complete")

            .forEach(item => {

                attentionItems.push({

                    executive: executive.name,

                    item: item.item

                });

            });


        const otherUpcoming = upcoming.filter(trip => trip.id !== focusTrip.id);


        return `

            <div class="dashboard-card executive-card">

            <h2>${executive.name}</h2>

            <p>${executive.title}<br>${executive.company}</p>


            <h3>🌍 ${focusTrip.destination}</h3>

            <p><strong>${focusTrip.purpose || "Business travel"}</strong><br>${focusTrip.dates}</p>

            <p>Travel Readiness<br><strong>${focusTrip.readinessPercent}%</strong></p>

            ${progressBar(focusTrip.readinessPercent)}


            <h4>Upcoming Trips</h4>

            ${otherUpcoming.length ?

                otherUpcoming.map(trip => `

                    <p>✈ ${trip.destination}<br>${trip.dates}</p>

                `).join("")

                : "<p>No other upcoming trips</p>"

            }


            <button onclick="openProfile('${executive.id}')">Open Profile</button>

            </div>

        `;

    });


    container.innerHTML = cards.join("");


    if(attentionItems.length){

        container.innerHTML += `

            <div class="dashboard-card">

            <h2>⚠ Needs Attention</h2>

            ${attentionItems.map(item => `

                <div class="attention-item">

                <p><strong>${item.executive}</strong><br>${item.item} pending</p>

                </div>

            `).join("")}

            </div>

        `;

    }

}


function openProfile(id){

    window.location.href = `executive.html?id=${id}`;

}


Jasmine.onReady(() => Jasmine.startLiveRefresh(displayOverview, 30000));
