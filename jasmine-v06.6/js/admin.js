console.log("Jasmine Admin Loaded");



const generateButton =
document.getElementById("generate-executive");




generateButton.addEventListener("click", function(){



const id =
document.getElementById("executive-id").value.trim();



const name =
document.getElementById("executive-name").value.trim();



const title =
document.getElementById("executive-title").value.trim();



const company =
document.getElementById("executive-company").value.trim();





if(!id || !name || !title || !company){


alert("Please complete all fields.");

return;


}





const executiveData = {


"profile": {


"name": name,


"title": title,


"company": company


},


"trips": {


"current": [],


"upcoming": [],


"history": []


}


};






const fileContent =

JSON.stringify(

executiveData,

null,

2

);






const blob = new Blob(

[fileContent],

{

type:"application/json"

}

);





const link = document.createElement("a");


link.href =
URL.createObjectURL(blob);



link.download =
id + ".json";



link.click();



URL.revokeObjectURL(link.href);



alert(

"Executive JSON created successfully."

);



});
