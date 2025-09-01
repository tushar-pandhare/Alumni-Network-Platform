// utils/cloudinaryUpload.js

export const uploadToCloudinary = async (imageFile) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary environment variables");
  }

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to upload image: ${error}`);
  }

  const data = await res.json();
  return data.secure_url;
};


//   // frontend/src/cloudinaryUpload.js
// export const uploadToCloudinary = async (imageFile) => {
//   const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
//   const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

//   if (!cloudName || !uploadPreset) {
//     throw new Error("Missing Cloudinary environment variables");
//   }

//   const formData = new FormData();
//   formData.append("file", imageFile);
//   formData.append("upload_preset", uploadPreset);

//   const res = await fetch(
//     `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!res.ok) {
//     const error = await res.text();
//     throw new Error(`Failed to upload image: ${error}`);
//   }

//   const data = await res.json();
//   return data.secure_url;
// };
