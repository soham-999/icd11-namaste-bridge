const client = require("../db");

const {
  mapPatientCondition
} = require("../services/mapping/mappingEngine");



// =====================================
// CREATE PATIENT + SAVE ICD MAPPING
// =====================================

exports.addPatient = async (req, res) => {


const dbClient = await client.connect();


try {


await dbClient.query("BEGIN");



const {
  name,
  age,
  symptoms
} = req.body;



if(!name || !symptoms){


await dbClient.query("ROLLBACK");


return res.status(400).json({

success:false,

error:"Name and symptoms required"

});


}



// =====================================
// CALL ICD MAPPING ENGINE
// =====================================


const mapping =
await mapPatientCondition(symptoms);



const results =
Array.isArray(mapping?.data)
?
mapping.data
:
[];




const first =
results[0] || {};




const icdCode =
first?.icd?.icdCode || null;



const icdSource =
first?.icd?.source || "mapping-engine";



const traditional =
first?.traditional?.description ||
first?.traditional?.system ||
null;






// =====================================
// SAVE PATIENT
// =====================================

const patientResult =
await dbClient.query(

`
INSERT INTO patients
(
name,
age,
symptom,
icd_code,
traditional_medicine,
icd_source
)

VALUES
($1,$2,$3,$4,$5,$6)

RETURNING *
`,

[

name,

age,

JSON.stringify(symptoms),

icdCode,

traditional,

icdSource

]

);

const patient =
patientResult.rows[0];


// ===============================
// DEBUG
// ===============================

console.log("Patient created:", patient.id);



// =====================================
// SAVE DIAGNOSIS RECORDS
// =====================================

for (const item of results) {

    await dbClient.query(

`
INSERT INTO diagnoses
(
patient_id,
symptom,
diagnosis,
icd_code,
system_type
)

VALUES
($1,$2,$3,$4,$5)
`,

[

patient.id,

item?.symptom ||
"unknown",

item?.traditional?.description ||
item?.traditional?.system ||
"Unknown",

item?.icd?.icdCode ||
null,

item?.icd?.source ||
"mapping-engine"

]

);

}




// =====================================
// SAVE MAPPING HISTORY
// =====================================

for (const item of results) {

    console.log(
        "Saving mapping for patient:",
        patient.id,
        item?.symptom
    );

    await dbClient.query(

`
INSERT INTO mapping_results
(
patient_id,
symptom,
icd_code,
traditional_system,
mapping_source,
confidence_score,
risk_level
)

VALUES
($1,$2,$3,$4,$5,$6,$7)
`,

[

patient.id,

item?.symptom ||
"unknown",

item?.icd?.icdCode ||
null,

item?.traditional?.system ||
item?.traditional?.description ||
null,

item?.icd?.source ||
"mapping-engine",

Number(item?.icd?.confidence || 0),

item?.fusion?.risk ||
"LOW"

]

);

}

await dbClient.query("COMMIT");




res.json({

success:true,

message:
"Patient saved with permanent ICD mapping",


patient,


mapping:results


});



}

catch(err){


await dbClient.query("ROLLBACK");


console.error(
"ADD PATIENT ERROR:",
err
);



res.status(500).json({

success:false,

error:err.message

});


}

finally{


dbClient.release();


}


};







// =====================================
// GET ALL PATIENTS
// =====================================


exports.getPatients =
async(req,res)=>{


try{


const result =
await client.query(

`
SELECT *
FROM patients
ORDER BY id DESC
`

);



res.json({

success:true,

data:
result.rows

});


}

catch(err){


res.status(500).json({

success:false,

error:err.message

});


}


};









// =====================================
// PATIENT WORKSPACE
// =====================================


exports.getPatientWorkspace =
async(req,res)=>{


try{


const id =
req.params.id;



const patient =
await client.query(

`
SELECT *
FROM patients
WHERE id=$1
`,

[id]

);




const diagnoses =
await client.query(

`
SELECT *
FROM diagnoses
WHERE patient_id=$1
ORDER BY id DESC
`,

[id]

);




const mappings =
await client.query(
`
SELECT
    id,
    patient_id,
    symptom,
    icd_code,
    traditional_system,
    mapping_source,
    confidence_score,
    risk_level,
    created_at
FROM mapping_results
WHERE patient_id = $1
ORDER BY created_at DESC
`,
[id]
);

res.json({

success:true,


patient:
patient.rows[0],



diagnoses:
diagnoses.rows,



mappingHistory:
mappings.rows


});


}


catch(err){


res.status(500).json({

success:false,

error:err.message

});


}


};