// import { v2 as cloudinary } from 'cloudinary';

// const connectCloudinary = async () => {
//     cloudinary.config({
//         cloud_name: process.env.CLOUDNIARY_CLOUD_NAME,
//         api_key: process.env.CLOUDNIARY_API_KEY,
//         api_secret: process.env.CLOUDNIARY_API_SECRET,
//     });
//     console.log("Cloudinary config:", {
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY
//     });


// }

// export default connectCloudinary; 


import { v2 as cloudinary } from 'cloudinary';

// Directly configure it once on import
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Optional: Log to verify
console.log("Cloudinary config loaded:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY
});

export default cloudinary; // ✅ Export the cloudinary object
