import YouTubeDownload from 'ytdl-core'

import Music from 'App/Models/Music'
import { inject } from '@adonisjs/core/build/standalone'
import { GenerateMp3Service } from './GenerateMp3Service'

@inject()
export class DownloadMusicService {
  constructor(protected generateMp3Service: GenerateMp3Service) {}

  public async handle(music: Music, path: string) {
    const stream = YouTubeDownload(music.videoUrl, {
      quality: 'highestaudio',
      filter: 'audioonly',
    })

    const sanitizedMusicTitle = music.title.replace('/', '-')

    await this.generateMp3Service.handle(stream, `${path}/${sanitizedMusicTitle}.mp3`)
  }
}
