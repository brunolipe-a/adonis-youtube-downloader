import { inject } from '@adonisjs/core/build/standalone'
import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Folder from 'App/Models/Folder'
import { PlaylistDownloadService } from 'App/Service/PlaylistDownloadService'
import StorePlaylistValidator from 'App/Validators/StorePlaylistValidator'

import YouTubePlaylist from 'ytpl'

@inject()
export default class PlaylistsController {
  constructor(protected service: PlaylistDownloadService) {}

  @bind()
  public async store({ request, response }: HttpContextContract, folder: Folder) {
    const { playlistUrl } = await request.validate(StorePlaylistValidator)

    const playlistId = await YouTubePlaylist.getPlaylistID(playlistUrl)

    const { items, title } = await YouTubePlaylist(playlistId)

    const videosData = items.map(({ shortUrl, bestThumbnail, title }) => ({
      title: title,
      videoUrl: shortUrl,
      thumbnailUrl: bestThumbnail.url ?? '',
    }))

    await folder.merge({ name: title }).save()

    await folder.related('musics').createMany(videosData)

    return response.redirect().back()
  }

  public async download({ request, response }: HttpContextContract) {
    const { playlistUrl } = await request.validate(StorePlaylistValidator)

    await this.service.download(playlistUrl)

    return response.redirect().withQs({ ok: true }).back()
  }
}
