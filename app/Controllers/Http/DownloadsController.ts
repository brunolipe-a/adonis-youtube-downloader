import { Ws } from '@ioc:Adonis/Addons/Ws'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Download from 'App/Models/Download'

export default class DownloadsController {
  public async index({}: HttpContextContract) {
    Ws.io.emit('news', { message: 'teste' })

    return await Download.all()
  }
}
