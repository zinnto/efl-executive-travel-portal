/*
Jasmine v1.0
Core Application Engine
*/


const Jasmine = {


    data: {


        countries: [],

        airlines: [],

        executives: [],

        trips: [],

        documents: []


    },





    async loadJSON(path){


        try {


            const response = await fetch(path);


            if(!response.ok){

                throw new Error(
                    "Unable to load " + path
                );

            }


            return await response.json();



        } catch(error){


            console.error(
                "Jasmine Data Error:",
                error
            );


            return null;


        }


    },









    async init(){



        console.log(
            "Initializing Jasmine v1.0..."
        );




        const countries =

        await this.loadJSON(
            "data/countries.json"
        );



        if(countries){

            this.data.countries =
            countries.countries || [];

        }






        const airlines =

        await this.loadJSON(
            "data/airlines.json"
        );



        if(airlines){

            this.data.airlines =
            airlines.airlines || [];

        }






        const executives =

        await this.loadJSON(
            "data/executives.json"
        );



        if(executives){

            this.data.executives =
            executives.executives || [];

        }





        console.log(
            "Jasmine Ready",
            this.data
        );



    },









    getCountries(){


        return this.data.countries;


    },






    getCities(countryName){



        const country =

        this.data.countries.find(

            item =>
            item.name === countryName

        );



        return country
        ?
        country.cities
        :
        [];



    },








    getAirlines(){


        return this.data.airlines;


    },








    getExecutives(){


        return this.data.executives;


    }






};









window.Jasmine = Jasmine;



Jasmine.init();