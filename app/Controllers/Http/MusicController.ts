import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Folder from 'App/Models/Folder'
import Music from 'App/Models/Music'

import YouTubeDownload from 'ytdl-core'

export default class MusicController {
  @bind()
  public async index({}: HttpContextContract, folder: Folder) {
    await folder.load('musics')

    return folder.musics
  }

  @bind()
  public async store({ request, response }: HttpContextContract, folder: Folder) {
    const { videoUrl } = request.all()

    const { videoDetails } = await YouTubeDownload.getBasicInfo(videoUrl)

    const music = await folder.related('musics').create({
      title: videoDetails.title,
      videoUrl,
      thumbnailUrl: videoDetails.thumbnails.at(-1)?.url,
    })

    return response.created(music)
  }

  @bind()
  public async destroy({ response }: HttpContextContract, _folder: Folder, music: Music) {
    await music.delete()

    return response.noContent()
  }
}
