const {
  mapSymptoms
} = require("../mappingEngineClient");


// =====================================
// ICD + NAMASTE MAPPING ENGINE
// =====================================

const mapPatientCondition = async (symptoms = []) => {

  try {


    // Normalize input

    if (!Array.isArray(symptoms)) {
      symptoms = [symptoms];
    }


    console.log(
      "INPUT SYMPTOMS:",
      JSON.stringify(symptoms)
    );



    // Call mapping service

    const response =
      await mapSymptoms(symptoms);



    console.log(
      "RAW MAPPING SERVICE RESPONSE:"
    );

    console.log(
      JSON.stringify(response, null, 2)
    );



    /*
      Handle different possible API formats:

      {
        data:[]
      }

      OR

      [
        {}
      ]

      OR

      {
        results:[]
      }
    */


    let raw = [];


    if (Array.isArray(response)) {

      raw = response;

    }

    else if (Array.isArray(response?.data)) {

      raw = response.data;

    }

    else if (Array.isArray(response?.results)) {

      raw = response.results;

    }



    console.log(
      "NORMALIZED RAW DATA:",
      JSON.stringify(raw,null,2)
    );



    if (!raw.length) {


      console.log(
        "NO MAPPING DATA RECEIVED"
      );


      return {

        total:0,

        data:[]

      };

    }




    // Normalize final structure

    const results =
      raw.map((item)=>{


        return {


          symptom:
            item?.symptom ||
            item?.term ||
            item?.input ||
            "unknown",




          icd:{


            icdCode:
              item?.icd?.icd_code ||
              item?.icd?.icdCode ||
              item?.icd_code ||
              null,



            description:
              item?.icd?.description ||
              item?.description ||
              "",



            source:
              item?.icd?.source ||
              item?.source ||
              "mapping-engine",



            confidence:
              Number(
                item?.icd?.confidence ||
                item?.confidence ||
                0
              )


          },




          traditional:


            item?.traditional ||
            item?.traditional_system ||
            item?.ayurveda ||
            null,





          fusion:{


            score:
              Number(
                item?.fusion?.score ||
                0
              ),



            risk:
              item?.fusion?.risk ||
              item?.risk_level ||
              "LOW"


          }



        };


      });





    console.log(
      "FINAL NORMALIZED MAPPING:",
      JSON.stringify(results,null,2)
    );




    return {


      total:
        results.length,


      data:
        results


    };



  }

  catch(err){


    console.error(
      "MAPPING ENGINE ERROR:",
      err
    );



    return {


      total:0,


      data:[]


    };


  }


};



module.exports = {

  mapPatientCondition

};