import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

import { ImageSizeInMb, Mimetype } from '@/constants'
import { mbToBytes } from '@/utils/maths'
import { joinRelativeToMainPath } from '@/utils/paths'

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // console.log("filesss",file)
  const mimetypes: string[] = Object.values(Mimetype)

  if (!mimetypes.includes(file.mimetype)) {
    console.log("fileeee",)
    return cb(new Error(`Only ${mimetypes} files are allowed.`))
  }
  // console.log("fileeeemm",)
  cb(null, true)
}

const upload = multer({
  dest: joinRelativeToMainPath(process.env.STORAGE_PATH),
  limits: { fileSize: mbToBytes(ImageSizeInMb.Ten) },
  // fileFilter
})
console.log("upload",upload)
export const uploadMultipleImages = upload.array('image', 10) 
export const uploadSingleImage = upload.single('files')
