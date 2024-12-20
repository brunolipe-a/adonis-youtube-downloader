import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import Download from 'App/Models/Download'
import Folder from 'App/Models/Folder'

import { inject } from '@adonisjs/core/build/standalone'
import { DownloadMusicService } from 'App/Service/DownloadMusicService'
import { zip } from 'zip-a-folder'

type ProcessFunction<T> = (item: T) => Promise<any>

export type ProcessFolderDownloadPayload = {
  downloadId: string
  folderId: number
}

@inject()
export default class {
  constructor(protected downloadMusicService: DownloadMusicService) {}

  public async handle({ downloadId, folderId }: ProcessFolderDownloadPayload) {
    const download = await Download.find(downloadId)
    const folder = await Folder.find(folderId)

    if (!download || !folder) {
      return
    }

    await folder.load('musics')

    await this.createFolder(folder.name)

    const folderPath = Application.tmpPath(`uploads/${folder.name}`)

    await this.processInBatches(folder.musics, 25, (music) =>
      this.downloadMusicService.handle(music, folderPath)
    )

    // const zipUrl = await this.generateZipFromFolder(folderPath, download.id)

    // await this.deleteFolder(download.id)

    // await download.merge({ url: zipUrl, isFinished: true }).save()
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
