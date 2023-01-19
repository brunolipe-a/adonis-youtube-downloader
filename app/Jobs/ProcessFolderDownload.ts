import type { JobHandlerContract, Job } from '@ioc:Setten/Queue'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import Download from 'App/Models/Download'
import Folder from 'App/Models/Folder'

import { zip } from 'zip-a-folder'
import { DownloadMusicService } from 'App/Service/DownloadMusicService'
import { inject } from '@adonisjs/core/build/standalone'

export type ProcessFolderDownloadPayload = {
  downloadId: string
  folderId: number
}

@inject()
export default class implements JobHandlerContract {
  constructor(public job: Job, protected downloadMusicService: DownloadMusicService) {
    this.job = job
  }

  public async handle({ downloadId, folderId }: ProcessFolderDownloadPayload) {
    const download = await Download.find(downloadId)
    const folder = await Folder.find(folderId)

    if (!download || !folder) {
      return
    }

    await folder.load('musics')

    await this.createFolder(download.id)

    const folderPath = Application.tmpPath(`uploads/${download.id}`)

    await Promise.all(
      folder.musics.map((music) => this.downloadMusicService.handle(music, folderPath))
    )

    const zipUrl = await this.generateZipFromFolder(folderPath, download.id)

    await this.deleteFolder(download.id)

    await download.merge({ url: zipUrl, isFinished: true }).save()
  }

  protected async generateZipFromFolder(folderPath: string, zipFilename: string) {
    const zipPath = Application.tmpPath(`uploads/${zipFilename}.zip`)

    await zip(folderPath, zipPath)

    return `/uploads/${zipFilename}.zip`
  }

  protected deleteFolder(folderName: string) {
    return Drive.delete(folderName)
  }

  protected createFolder(folderName: string) {
    return Drive.put(`${folderName}/.info`, '')
  }

  public async failed() {}
}
