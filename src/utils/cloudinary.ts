import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View Credentials' below to copy your API secret
});  
export default cloudinary;
export async function uploadFileToCloudinary(buffer: Buffer): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                // Add any other options you need
            },
            (error, result) => {
                if (error) {
                    console.error('Error uploading file to Cloudinary:', error);
                    reject(error);
                } else {
                    resolve(result?.url); // This is the URL of the uploaded file
                }
            }
        ).end(buffer);
    });
}