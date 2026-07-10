const params = new URLSearchParams(window.location.search);


const executiveID = params.get("id");



fetch("data/executives.json")

.then(response => response.json())

.then(data => {


    const executive = data.executives.find(
        item => item.id === executiveID
    );


    if (!executive) {

        document.getElementById("executive-profile").innerHTML =
        "Executive not found";

        return;

    }



    fetch(executive.file)

    .then(response => response.json())

    .then(profile => {



        const container =
        document.getElementById("executive-profile");



        container.innerHTML = `



        <div class="dashboard-card">


            <h2>
            ${profile.profile.name}
            </h2>


            <p>

            ${profile.profile.title}

            <br>

            ${profile.profile.company}

            </p>


        </div>





        <div class="dashboard-card">


            <h3>
            ✈ Current Travel
            </h3>


            <h2>
            ${profile.currentTrip.destination}
            </h2>


            <p>

            ${profile.currentTrip.dates}

            <br>

            Status:
            ${profile.currentTrip.status}

            </p>



            <button onclick="openTrip('${profile.currentTrip.id}')">

            Open Itinerary

            </button>


        </div>





        <div class="dashboard-card">


            <h3>
            Upcoming Trips
            </h3>


            ${
            profile.upcomingTrips.length

            ?

            profile.upcomingTrips.map(trip => `


                <p>

                <strong>
                ${trip.destination}
                </strong>

                <br>

                ${trip.date}

                </p>


            `).join("")


            :

            "<p>No upcoming trips</p>"

            }


        </div>





        <div class="dashboard-card">


            <h3>
            Travel History
            </h3>



            ${
            profile.travelHistory.length

            ?

            profile.travelHistory.map(trip => `


                <p>

                <strong>
                ${trip.destination}
                </strong>

                <br>

                ${trip.date}

                </p>


            `).join("")


            :

            "<p>No travel history</p>"

            }



        </div>



        `;



    });


});




function openTrip(id) {


    window.location.href =
    `trip.html?id=${id}`;


}
