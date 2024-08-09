import { v2 as cloudinary } from 'cloudinary';
import { appUrl, joinRelativeToMainPath } from '@/utils/paths'
import fs from "fs"
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
export async function deleteFromCloudinaryWithUrl(url:string){
    try {
        const parts = url.split('/');
        const fileName = parts.pop(); // Get the file name part
        const publicId = fileName?.split('.')[0]; // Extract the public ID before the file extension
        if (publicId) {
          const result = await cloudinary.uploader.destroy(publicId);
          console.log("sucessfully deleted from cloudinary",result);
          return true;
        } else {
          console.error('Public ID is undefined');
          return false;
        }
      } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return false;
      }
}
export async function uploadCloudinary(filepath:string){
    const fileBuffer = fs.readFileSync(filepath)
    const url = await uploadFileToCloudinary(fileBuffer)
return url
}