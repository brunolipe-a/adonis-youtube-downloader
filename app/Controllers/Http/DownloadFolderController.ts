import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { bind } from '@adonisjs/route-model-binding'

import { inject } from '@adonisjs/core/build/standalone'
import ProcessFolderDownload from 'App/Jobs/ProcessFolderDownload'
import Download from 'App/Models/Download'
import Folder from 'App/Models/Folder'

@inject()
export default class DownloadFolderController {
  constructor(protected processFolderDownload: ProcessFolderDownload) {}

  @bind()
  public async handle({ response }: HttpContextContract, folder: Folder) {
    const download = await Download.create({
      description: folder.name,
    })

    await this.processFolderDownload.handle({ downloadId: download.id, folderId: folder.id })

    await folder.delete()

    return response.redirect().back()
  }
}
