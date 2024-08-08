import { dirname, join } from 'path'

export const joinRelativeToMainPath = (path = '') => {
  const { filename } = require.main || {}

  if (!filename) return path

  return join(dirname(filename), path)
}

export const appUrl = (path = '') => `${process.env.APP_URL}/src/${path}`
export const cloudUrlId=(url:string)=>{
  const parts = url.split('/');
  const fileName = parts.pop();
  const publicId = fileName?.split('.')[0]; 
  return publicId

}
