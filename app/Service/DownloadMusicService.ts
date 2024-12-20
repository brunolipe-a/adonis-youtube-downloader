import YouTubeDownload from '@distube/ytdl-core'
import fs from 'node:fs'

import { inject } from '@adonisjs/core/build/standalone'
import Music from 'App/Models/Music'
import { Readable } from 'node:stream'
import { GenerateMp3Service } from './GenerateMp3Service'

const streamToFile = (inputStream: Readable, filePath: string) => {
  return new Promise((resolve, reject) => {
    const fileWriteStream = fs.createWriteStream(filePath)
    inputStream.pipe(fileWriteStream).on('finish', resolve).on('error', reject)
  })
}

@inject()
export class DownloadMusicService {
  constructor(protected generateMp3Service: GenerateMp3Service) {}

  public async handle(music: Music, path: string) {
    const sanitizedMusicTitle = music.title.replace('/', '-')

    try {
      const stream = YouTubeDownload(music.videoUrl, {
        quality: 'highestaudio',
        filter: 'audioonly',
      })

      await this.generateMp3Service.handle(stream, `${path}/${sanitizedMusicTitle}.mp3`)
    } catch (error) {
      console.error(`Houve um problema com a música ${music.title}`)
      console.error(error)
    }
  }
}
