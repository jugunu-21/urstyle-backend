import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

import { ImageSizeInMb, Mimetype } from '@/constants'
import { mbToBytes } from '@/utils/maths'
import { joinRelativeToMainPath } from '@/utils/paths'
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }
  return cb(new Error(`Only image files are allowed.`));
};
// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ) => {

//   if (/^data:image\/jpeg;base64,.*/.test(file.buffer.toString())) {
//     console.log('sucess')
//     return cb(null, true)
//   }
//   console.log('sucess')
//   return cb(new Error(`Only files are allowed.`))
// }

const upload = multer({
  dest: joinRelativeToMainPath(process.env.STORAGE_PATH),
  limits: { fileSize: mbToBytes(ImageSizeInMb.Ten) },
  // fileFilter
})
console.log("upload", upload)
export const uploadMultipleImages = upload.array('image', 10)
// export const uploadSingleImage = upload.single('files')
