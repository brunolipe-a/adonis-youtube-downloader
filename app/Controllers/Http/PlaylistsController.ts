import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Folder from 'App/Models/Folder'
import StorePlaylistValidator from 'App/Validators/StorePlaylistValidator'

import YouTubePlaylist from 'ytpl'

export default class PlaylistsController {
  @bind()
  public async store({ request }: HttpContextContract, folder: Folder) {
    const { playlistUrl } = await request.validate(StorePlaylistValidator)

    const playlistId = await YouTubePlaylist.getPlaylistID(playlistUrl)

    const { items } = await YouTubePlaylist(playlistId)

    const videosData = items.map(({ shortUrl, bestThumbnail, title }) => ({
      title: title,
      videoUrl: shortUrl,
      thumbnailUrl: bestThumbnail.url ?? '',
    }))

    await folder.related('musics').createMany(videosData)

    return { message: 'Músicas adicionadas' }
  }
}
