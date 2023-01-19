import { Readable } from 'stream'
import ffmpeg from 'fluent-ffmpeg'

export class GenerateMp3Service {
  public async handle(stream: Readable, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg({
        source: stream,
      })
        .on('error', (err) => {
          reject(err)
        })
        .on('end', () => {
          resolve()
        })
        .save(path)
    })
  }
}
