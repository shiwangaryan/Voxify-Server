const cloudinary = require("cloudinary").v2;

const uploadAudioToCloudinary = async (audioBuffer) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadResponse = cloudinary.uploader.upload_stream(  // returns a writable stream here
        {
          resource_type: "auto",
          public_id: `podcasts/${Date.now()}`,
          folder: "podcasts",
        },
        (error, uploadedResult) => {  // a callback function after the cloudinary finishes uploading by executing uploadResponse.end(audioBuffer)
          if (error) {
            console.log("Error uploading to cloudinary: ", error);
            reject(error);
          }
          resolve(uploadedResult);  // returns the url of the uploaded audio file
        }
      );

      uploadResponse.end(audioBuffer);
    });
  } catch (error) {
    console.log("Error in uploadAudioToCloudinary: ", error);
    throw error;
  }
};

module.exports= uploadAudioToCloudinary;