import { inject } from '@adonisjs/core/build/standalone'
import Application from '@ioc:Adonis/Core/Application'
import YouTubePlaylist from 'ytpl'
import { DownloadMusicService } from './DownloadMusicService'

import Drive from '@ioc:Adonis/Core/Drive'
import Music from 'App/Models/Music'

type ProcessFunction<T> = (item: T) => Promise<any>

@inject()
export class PlaylistDownloadService {
  constructor(protected downloadMusicService: DownloadMusicService) {}

  public async download(playlistUrl: string) {
    const playlistId = await YouTubePlaylist.getPlaylistID(playlistUrl)

    const { items, title } = await YouTubePlaylist(playlistId)

    const videosData = items.map(({ shortUrl, bestThumbnail, title }) => ({
      title: title,
      videoUrl: shortUrl,
      thumbnailUrl: bestThumbnail.url ?? '',
    }))

    await this.createFolder(title)

    const folderPath = Application.tmpPath(`uploads/${title}`)

    await this.processInBatches(videosData, 25, (music) =>
      this.downloadMusicService.handle(new Music().merge(music), folderPath)
    )
  }

  protected deleteFolder(folderName: string) {
    return Drive.delete(folderName)
  }

  protected createFolder(folderName: string) {
    return Drive.put(`${folderName}/.info`, '')
  }

  protected async processInBatches<T>(
    items: T[],
    batchSize: number,
    processFunction: ProcessFunction<T>
  ) {
    // Itera sobre os itens em lotes
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)

      await Promise.all(batch.map(processFunction))
    }
  }
}
