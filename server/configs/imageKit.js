import ImageKit from "@imagekit/nodejs";
// import dotenv from "dotenv"
// dotenv.config();


const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export default imageKit;