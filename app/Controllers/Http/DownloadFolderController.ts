import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Queue } from '@ioc:Setten/Queue'

import { bind } from '@adonisjs/route-model-binding'

import Download from 'App/Models/Download'
import Folder from 'App/Models/Folder'

export default class DownloadFolderController {
  @bind()
  public async handle({}: HttpContextContract, folder: Folder) {
    const download = await Download.create({
      description: folder.name,
    })

    Queue.dispatch('App/Jobs/ProcessFolderDownload', {
      downloadId: download.id,
      folderId: folder.id,
    })

    return { message: 'Processamento dos arquivos iniciado' }
  }
}
