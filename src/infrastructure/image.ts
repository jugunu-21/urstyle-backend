import sharp, { Sharp } from 'sharp'
import mime from 'mime'
import { join } from 'path'
import fs from 'fs/promises'

import { IMedia } from '@/contracts/media'
import { joinRelativeToMainPath } from '@/utils/paths'

export class Image {
  private image: Express.Multer.File | IMedia

  private sharpInstance: Sharp

  constructor(image: Express.Multer.File | IMedia) {
    this.image = image
  }

  public async sharp({
    width,
    height
  }: { width?: number; height?: number } = {}): Promise<string> {
    const isResize = width || height

    let fileName = this.image.filename
    if (isResize) {
      fileName = `${fileName}_${[width, height].join('x')}`
    }

    const conversionsPath = join(this.image.destination, 'conversions')
    const filePath = join(
      conversionsPath,

      `${fileName}.${mime.extension(this.image.mimetype)}`
    )

    const fileFullPath = joinRelativeToMainPath(filePath)

    if (await this.isFileExist(fileFullPath)) {
      return filePath
    }

    this.sharpInstance = sharp(joinRelativeToMainPath(this.image.path))
    if (isResize) {
      this.sharpInstance.resize(width, height)
    }

    await this.createDirectoryIfNeeded(joinRelativeToMainPath(conversionsPath))

    await this.saveFile(fileFullPath)

    return filePath
  }

  public async deleteFile() {
    try {
      // console.log("OKEE")
      // console.log("OKEEe",this.image.path)
      if (await this.isFileExist(this.image.path)) {
        // console.log("OKEEe")
        await fs.unlink(this.image.path)
      }

      const conversionsPath = join(this.image.destination, 'conversions')
      const conversionsFullPath = joinRelativeToMainPath(conversionsPath)
      const files = await fs.readdir(conversionsPath)

      const promises = files
        .filter(file => {
          const fileFullPath = join(conversionsFullPath, file)
          return (
            new RegExp(this.image.filename).test(file) &&
            this.isFileExist(fileFullPath)
          )
        })
        .map(file => {
          const fileFullPath = join(conversionsFullPath, file)
          return fs.unlink(fileFullPath)
        })

      await Promise.all(promises)
      // console.log("OKEE")
    } catch {
      return null
    }
  }

  private async isFileExist(filePath: string) {
    try {
      return await fs.stat(filePath)
    } catch {
      return null
    }
  }

  private async createDirectoryIfNeeded(directoryPath: string): Promise<void> {
    try {
      await fs.access(directoryPath)
    } catch {
      await fs.mkdir(directoryPath, { recursive: true })
    }
  }

  private async saveFile(fileFullPath: string) {
    try {
      await this.sharpInstance.toFile(fileFullPath)
    } catch {
      return null
    }
  }
}
export class Images {
  private image: Express.Multer.File[]

  private sharpInstance: Sharp

  constructor(image: Express.Multer.File[]) {
    this.image = image
  }

  public async sharp({
    width,
    height
  }: { width?: number; height?: number } = {}): Promise<string> {
    const isResize = width || height

    let fileName = this.image['0'].filename
    if (isResize) {
      fileName = `${fileName}_${[width, height].join('x')}`
    }

    const conversionsPath = join(this.image['0'].destination, 'conversions')
    const filePath = join(
      conversionsPath,

      `${fileName}.${mime.extension(this.image['0'].mimetype)}`
    )

    const fileFullPath = joinRelativeToMainPath(filePath)

    if (await this.isFileExist(fileFullPath)) {
      return filePath
    }

    this.sharpInstance = sharp(joinRelativeToMainPath(this.image['0'].path))
    if (isResize) {
      this.sharpInstance.resize(width, height)
    }

    await this.createDirectoryIfNeeded(joinRelativeToMainPath(conversionsPath))

    await this.saveFile(fileFullPath)

    return filePath
  }

  public async deleteFile() {
    try {
      const fileFullPath = joinRelativeToMainPath(this.image['0'].path)
      console.log("deletedfunct", fileFullPath)
      if (await this.isFileExist(fileFullPath)) {
        await fs.unlink(fileFullPath)
      }

      const conversionsPath = join(this.image['0'].destination, 'conversions')
      const conversionsFullPath = joinRelativeToMainPath(conversionsPath)
      const files = await fs.readdir(conversionsFullPath)

      const promises = files
        .filter(file => {
          const fileFullPath = join(conversionsFullPath, file)
          return (
            new RegExp(this.image['0'].filename).test(file) &&
            this.isFileExist(fileFullPath)
          )
        })
        .map(file => {
          const fileFullPath = join(conversionsFullPath, file)
          return fs.unlink(fileFullPath)
        })

      await Promise.all(promises)
    } catch {
      return null
    }
  }

  private async isFileExist(filePath: string) {
    try {
      return await fs.stat(filePath)
    } catch {
      return null
    }
  }

  private async createDirectoryIfNeeded(directoryPath: string): Promise<void> {
    try {
      await fs.access(directoryPath)
    } catch {
      await fs.mkdir(directoryPath, { recursive: true })
    }
  }

  private async saveFile(fileFullPath: string) {
    try {
      await this.sharpInstance.toFile(fileFullPath)
    } catch {
      return null
    }
  }
}