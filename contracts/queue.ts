import { ProcessFolderDownloadPayload } from 'App/Jobs/ProcessFolderDownload'

declare module '@ioc:Setten/Queue' {
  interface JobsList {
    'App/Jobs/ProcessFolderDownload': ProcessFolderDownloadPayload
  }
}
