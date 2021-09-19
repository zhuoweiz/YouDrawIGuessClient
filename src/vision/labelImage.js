// Imports the Google Cloud client library

export default async function make_prediction(imageData,handleSubmission) {    
  // const vision = require('@google-cloud/vision');
  const axios = require('axios')
  // Creates a client
  // const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  //const fileName = ''
  axios.post('https://vision.googleapis.com/v1/images:annotate', {
          "requests": [
            {
              "image": {
                "content" : imageData
              },
              "features": [
                {
                  "maxResults": 10,
                  "type": "LABEL_DETECTION"
                }
              ],
            }
          ],
          

  },{
      params: {
          "key":"AIzaSyDLhAxwplxKwoyfYTVzLMt-NruD5FifIVI"
      }
  }).then((response) => {
      handleSubmission(response.data.responses[0].labelAnnotations);
  }).catch((error) => {
      console.log("error..",error);
  })

  // Performs label detection on the local file
  // const [result] = await client.labelDetection(fileName);
  // const labels = result.labelAnnotations;
  // console.log('Labels:');
  // labels.forEach(label => console.log(label.description, label.score));
  
  }
