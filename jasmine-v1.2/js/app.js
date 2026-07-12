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

    tripsVersion: "jasmine_trips_version",

    settings: "jasmine_settings"

};


/*
Master list of everything a trip's readiness can be tracked
against. "core" items check built-in trip fields (flight/hotel/
schedule); "document" items check whether a document of that
type has been added with status Received or Verified. The keys
for document items match the Document Type dropdown exactly.
*/

const CHECKLIST_OPTIONS = [

    { key: "flight", label: "Flight Booked", kind: "core" },

    { key: "hotel", label: "Hotel Booked", kind: "core" },

    { key: "schedule", label: "Schedule Confirmed", kind: "core" },

    { key: "Visa", label: "Visa", kind: "document" },

    { key: "Passport", label: "Passport", kind: "document" },

    { key: "Flight Ticket", label: "Flight Ticket", kind: "document" },

    { key: "Hotel Confirmation", label: "Hotel Confirmation", kind: "document" },

    { key: "Invitation Letter", label: "Invitation Letter", kind: "document" },

    { key: "Insurance", label: "Insurance", kind: "document" }

];


// Used for trips saved before the checklist feature existed.

const DEFAULT_CHECKLIST = ["flight", "hotel", "schedule"];



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


        // Trips also respect a published version number (data/version.json).
        // If it's higher than what this browser last saw, that means a
        // reset/replacement was pushed (e.g. a blanked trips.json) — wipe
        // and reseed from the current file, even if local data exists.

        const versionData = await this.loadJSON("data/version.json");

        const shippedTripsVersion = versionData ? (versionData.trips || 0) : 0;

        const storedTripsVersion = parseInt(localStorage.getItem(STORAGE_KEYS.tripsVersion) || "0", 10);


        let trips = this.loadLocal(STORAGE_KEYS.trips);

        if(!trips || shippedTripsVersion !== storedTripsVersion){

            const seed = await this.loadJSON("data/trips.json");

            trips = seed ? (seed.trips || []) : [];

            this.saveLocal(STORAGE_KEYS.trips, trips);

            localStorage.setItem(STORAGE_KEYS.tripsVersion, String(shippedTripsVersion));

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


    getChecklistOptions(){

        return CHECKLIST_OPTIONS;

    },


    getDefaultChecklist(){

        return [...DEFAULT_CHECKLIST];

    },


    isChecklistItemComplete(trip, key){

        if(key === "flight"){

            return !!(trip.flight && trip.flight.airline && trip.flight.number);

        }

        if(key === "hotel"){

            return !!(trip.hotel && trip.hotel.name);

        }

        if(key === "schedule"){

            return !!(trip.schedule && trip.schedule.length > 0);

        }

        // Document-type item: complete if a matching document has
        // been added and its status is Received or Verified.

        return !!(trip.documents && trip.documents.some(doc =>

            doc.type === key && (doc.status === "Received" || doc.status === "Verified")

        ));

    },


    getReadiness(trip){

        const checklist = (trip.checklist && trip.checklist.length) ?

            trip.checklist : DEFAULT_CHECKLIST;


        return checklist.map(key => {

            const option = CHECKLIST_OPTIONS.find(item => item.key === key);

            return {

                key,

                item: option ? option.label : key,

                status: this.isChecklistItemComplete(trip, key) ? "Complete" : "Pending"

            };

        });

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

            checklist: (trip.checklist && trip.checklist.length) ? trip.checklist : [...DEFAULT_CHECKLIST],

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


    addContactToTrip(id, contact){

        const trip = this.data.trips.find(item => item.id === id);

        if(!trip) return null;

        if(!trip.contacts) trip.contacts = [];

        trip.contacts.push(contact);

        this.saveLocal(STORAGE_KEYS.trips, this.data.trips);

        return this.enrichTrip(trip);

    },


    deleteTrip(id){

        this.data.trips = this.data.trips.filter(item => item.id !== id);

        this.saveLocal(STORAGE_KEYS.trips, this.data.trips);

    },


    getPendingCount(){

        let pending = 0;

        this.data.trips.forEach(trip => {

            const readiness = this.getReadiness(trip);

            pending += readiness.filter(item => item.status !== "Complete").length;

        });

        return pending;

    },


    /*
    PUBLISHING (for static, backend-less hosting like GitHub Pages)

    Data lives in each visitor's own browser via localStorage —
    there's no shared database. exportData() hands back the raw
    editable data so it can be downloaded and committed over the
    data/*.json files in the repo, making it the new baseline for
    anyone visiting fresh. reloadFromFiles() discards whatever is
    in this browser's localStorage and re-seeds from the current
    data/*.json files, for pulling down data that was published
    elsewhere.
    */


    exportData(){

        return {

            executives: this.data.executives,

            trips: this.data.trips,

            settings: this.data.settings

        };

    },


    async reloadFromFiles(){

        const executives = await this.loadJSON("data/executives.json");

        this.data.executives = executives ? (executives.executives || []) : [];

        this.saveLocal(STORAGE_KEYS.executives, this.data.executives);


        const trips = await this.loadJSON("data/trips.json");

        this.data.trips = trips ? (trips.trips || []) : [];

        this.saveLocal(STORAGE_KEYS.trips, this.data.trips);


        const versionData = await this.loadJSON("data/version.json");

        localStorage.setItem(STORAGE_KEYS.tripsVersion, String(versionData ? (versionData.trips || 0) : 0));


        const settings = await this.loadJSON("data/settings.json");

        this.data.settings = settings || {};

        this.saveLocal(STORAGE_KEYS.settings, this.data.settings);

    }


};



window.Jasmine = Jasmine;

Jasmine.init();
