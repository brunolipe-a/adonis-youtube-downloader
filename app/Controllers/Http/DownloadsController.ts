import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Download from 'App/Models/Download'

export default class DownloadsController {
  public async index({}: HttpContextContract) {
    return await Download.all()
  }
}
