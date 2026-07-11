/*
Jasmine v1.0
Core Application Engine

This is the single source of truth for the whole app.
Every page (admin, index, overview, executive, trip) reads
and writes through the Jasmine object below instead of
fetching JSON files directly, so data stays consistent and
persists across page loads via localStorage.
*/


const STORAGE_KEYS = {

    executives: "jasmine_executives",

    trips: "jasmine_trips",

    settings: "jasmine_settings"

};



const Jasmine = {


    data: {

        countries: [],

        airlines: [],

        hotels: [],

        executives: [],

        trips: [],

        settings: {}

    },


    ready: false,



    /*
    LOADING HELPERS
    */


    async loadJSON(path){

        try {

            const response = await fetch(path);

            if(!response.ok){

                throw new Error("Unable to load " + path);

            }

            return await response.json();

        } catch(error){

            console.error("Jasmine Data Error:", error);

            return null;

        }

    },


    loadLocal(key){

        try {

            const raw = localStorage.getItem(key);

            return raw ? JSON.parse(raw) : null;

        } catch(error){

            console.error("Jasmine Storage Error:", error);

            return null;

        }

    },


    saveLocal(key, value){

        try {

            localStorage.setItem(key, JSON.stringify(value));

        } catch(error){

            console.error("Jasmine Storage Error:", error);

        }

    },



    /*
    INIT
    */


    async init(){

        console.log("Initializing Jasmine v1.0...");


        // Reference data: always loaded fresh from JSON, not user-editable.

        const countries = await this.loadJSON("data/countries.json");

        if(countries){

            this.data.countries = countries.countries || [];

        }


        const airlines = await this.loadJSON("data/airlines.json");

        if(airlines){

            this.data.airlines = airlines.airlines || [];

        }


        const hotels = await this.loadJSON("data/hotels.json");

        if(hotels){

            this.data.hotels = hotels.hotels || [];

        }


        // Editable data: localStorage is the source of truth once it
        // exists. First run seeds it from the JSON files.

        let executives = this.loadLocal(STORAGE_KEYS.executives);

        if(!executives){

            const seed = await this.loadJSON("data/executives.json");

            executives = seed ? (seed.executives || []) : [];

            this.saveLocal(STORAGE_KEYS.executives, executives);

        }

        this.data.executives = executives;


        let trips = this.loadLocal(STORAGE_KEYS.trips);

        if(!trips){

            const seed = await this.loadJSON("data/trips.json");

            trips = seed ? (seed.trips || []) : [];

            this.saveLocal(STORAGE_KEYS.trips, trips);

        }

        this.data.trips = trips;


        let settings = this.loadLocal(STORAGE_KEYS.settings);

        if(!settings){

            const seed = await this.loadJSON("data/settings.json");

            settings = seed || {};

            this.saveLocal(STORAGE_KEYS.settings, settings);

        }

        this.data.settings = settings;


        console.log("Jasmine Ready", this.data);


        this.ready = true;

        document.dispatchEvent(new CustomEvent("jasmine:ready"));

    },


    /*
    Call fn immediately if Jasmine is already loaded, otherwise
    wait for the ready event. Replaces manual setTimeout polling.
    */

    onReady(fn){

        if(this.ready){

            fn();

        } else {

            document.addEventListener("jasmine:ready", fn, { once: true });

        }

    },



    /*
    REFERENCE DATA
    */


    getCountries(){

        return this.data.countries;

    },


    getCities(countryName){

        const country = this.data.countries.find(

            item => item.name === countryName

        );

        return country ? country.cities : [];

    },


    getAirlines(){

        return this.data.airlines;

    },


    getHotelDirectory(){

        return this.data.hotels;

    },



    /*
    SETTINGS
    */


    getSettings(){

        return this.data.settings;

    },


    updateSettings(changes){

        this.data.settings = { ...this.data.settings, ...changes };

        this.saveLocal(STORAGE_KEYS.settings, this.data.settings);

        return this.data.settings;

    },



    /*
    EXECUTIVES
    */


    getExecutives(){

        return this.data.executives;

    },


    getExecutiveById(id){

        return this.data.executives.find(item => item.id === id);

    },


    addExecutive(executive){

        const id = "exec" + String(this.data.executives.length + 1).padStart(3, "0");

        const record = {

            id,

            name: executive.name || "",

            title: executive.title || "",

            company: executive.company || "",

            email: executive.email || "",

            phone: executive.phone || "",

            assistant: executive.assistant || "",

            status: "Active"

        };

        this.data.executives.push(record);

        this.saveLocal(STORAGE_KEYS.executives, this.data.executives);

        return record;

    },



    /*
    TRIPS
    */


    getTrips(){

        return this.data.trips.map(trip => this.enrichTrip(trip));

    },


    getTripById(id){

        const trip = this.data.trips.find(item => item.id === id);

        return trip ? this.enrichTrip(trip) : null;

    },


    getTripsByExecutive(executiveId){

        return this.data.trips

            .filter(trip => trip.executive === executiveId)

            .map(trip => this.enrichTrip(trip));

    },


    /*
    Adds computed fields (status, dates label, readiness) without
    mutating the stored record, so every page sees the same values.
    */

    enrichTrip(trip){

        return {

            ...trip,

            executiveName: this.getExecutiveById(trip.executive)?.name || "Unknown Executive",

            destination: trip.city ? `${trip.city}, ${trip.country}` : trip.country,

            dates: this.formatDateRange(trip.departure, trip.return),

            status: this.getTripStatus(trip),

            readiness: this.getReadiness(trip),

            readinessPercent: this.getReadinessPercent(trip)

        };

    },


    formatDateRange(departure, ret){

        if(!departure) return "Dates pending";

        const options = { day: "numeric", month: "long", year: "numeric" };

        const start = new Date(departure);

        const startLabel = start.toLocaleDateString("en-GB", options);

        if(!ret){

            return startLabel;

        }

        const end = new Date(ret);

        const endLabel = end.toLocaleDateString("en-GB", options);

        return `${start.getDate()} - ${endLabel}`;

    },


    getTripStatus(trip){

        if(!trip.departure) return "Planning";

        const today = new Date();

        today.setHours(0,0,0,0);

        const start = new Date(trip.departure);

        const end = trip.return ? new Date(trip.return) : start;

        if(today < start) return "Upcoming";

        if(today > end) return "Completed";

        return "Current";

    },


    getReadiness(trip){

        const items = [];


        items.push({

            item: "Flight",

            status: (trip.flight && trip.flight.airline && trip.flight.number) ? "Complete" : "Pending"

        });


        items.push({

            item: "Hotel",

            status: (trip.hotel && trip.hotel.name) ? "Complete" : "Pending"

        });


        const docsReady = trip.documents && trip.documents.length > 0 &&

            trip.documents.every(doc => doc.status === "Received" || doc.status === "Verified");

        items.push({

            item: "Documents",

            status: docsReady ? "Complete" : "Pending"

        });


        items.push({

            item: "Schedule",

            status: (trip.schedule && trip.schedule.length > 0) ? "Complete" : "Pending"

        });


        return items;

    },


    getReadinessPercent(trip){

        const items = this.getReadiness(trip);

        const complete = items.filter(item => item.status === "Complete").length;

        return Math.round((complete / items.length) * 100);

    },


    addTrip(trip){

        const id = trip.id || "trip" + String(this.data.trips.length + 1).padStart(3, "0");

        const record = {

            id,

            executive: trip.executive,

            country: trip.country,

            city: trip.city,

            airline: trip.airline,

            departure: trip.departure,

            return: trip.return,

            purpose: trip.purpose,

            flight: null,

            hotel: null,

            documents: [],

            schedule: [],

            contacts: []

        };

        this.data.trips.push(record);

        this.saveLocal(STORAGE_KEYS.trips, this.data.trips);

        return this.enrichTrip(record);

    },


    updateTrip(id, changes){

        const trip = this.data.trips.find(item => item.id === id);

        if(!trip) return null;

        Object.assign(trip, changes);

        this.saveLocal(STORAGE_KEYS.trips, this.data.trips);

        return this.enrichTrip(trip);

    },


    addDocumentToTrip(id, document){

        const trip = this.data.trips.find(item => item.id === id);

        if(!trip) return null;

        if(!trip.documents) trip.documents = [];

        trip.documents.push(document);

        this.saveLocal(STORAGE_KEYS.trips, this.data.trips);

        return this.enrichTrip(trip);

    },


    getPendingCount(){

        let pending = 0;

        this.data.trips.forEach(trip => {

            const readiness = this.getReadiness(trip);

            pending += readiness.filter(item => item.status !== "Complete").length;

        });

        return pending;

    }


};



window.Jasmine = Jasmine;

Jasmine.init();
