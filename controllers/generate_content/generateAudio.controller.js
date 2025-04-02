const OpenAI = require("openai");
const { uploadAudioToCloudinary } = require( "../../middleware/uploadAudio.cloudinary");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateAudioController = async (req, res) => {
  const { description, voice } = req.body;

  try {
    // Generate audio from OpenAI
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice || "alloy",
      input: description,
    });

    const audioBuffer = Buffer.from(await mp3Response.arrayBuffer());

    // Upload audio to cloudinary
    const audioUrl = await uploadAudioToCloudinary(audioBuffer);
    const secureAudioUrl = audioUrl.secure_url;

    res.status(200).json({
      message: "Audio generated successfully",
      audioUrl: secureAudioUrl,
    });
  } catch (error) {
    console.log("Error generating audio from OpenAI: ", error);
    res.status(500).json({ message: "error encountered in generating audio" });
  }
};

module.exports= {generateAudioController};