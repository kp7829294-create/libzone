import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file, folder = "libzone") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    stream.end(buffer);
  });
  return result?.secure_url;
}

export async function uploadFile(file, folder = "libzone/files", options = {}) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto", ...options },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    stream.end(buffer);
  });
  return {
    url: result?.secure_url,
    publicId: result?.public_id,
    resourceType: result?.resource_type,
    type: result?.type,
  };
}

export { cloudinary };
