const axios = require("axios");

const BASE_URL = "http://localhost:8000/v1";


// =====================================
// PYTHON MAPPING ENGINE CLIENT
// =====================================

const mapSymptoms = async (
  symptoms = [],
  sources = null,
  requestId = null
) => {

  try {


    if (!Array.isArray(symptoms)) {
      symptoms = [symptoms];
    }


    console.log(
      "=============================="
    );

    console.log(
      "CALLING PYTHON MAPPING ENGINE"
    );

    console.log(
      "URL:",
      `${BASE_URL}/map`
    );


    console.log(
      "REQUEST:",
      JSON.stringify({
        symptoms,
        sources
      }, null, 2)
    );



    const response = await axios.post(

      `${BASE_URL}/map`,

      {
        symptoms,
        sources
      },

      {

        timeout:15000,

        headers:{

          "Content-Type":
          "application/json",

          ...(requestId
            ?
            {
              "x-request-id":requestId
            }
            :
            {}
          )

        }

      }

    );



    console.log(
      "PYTHON STATUS:",
      response.status
    );



    console.log(
      "PYTHON RAW RESPONSE:"
    );


    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );



    return response.data;



  }

  catch(error){


    console.error(
      "=============================="
    );

    console.error(
      "MAPPING ENGINE FAILED"
    );


    if(error.response){


      console.error(
        "STATUS:",
        error.response.status
      );


      console.error(
        "BODY:",
        JSON.stringify(
          error.response.data,
          null,
          2
        )
      );


    }
    else{


      console.error(
        "MESSAGE:",
        error.message
      );


    }



    return {

      request_id:null,

      engine_version:null,

      total:0,

      data:[],

      error:"mapping_engine_unreachable"

    };


  }

};



module.exports = {
  mapSymptoms
};