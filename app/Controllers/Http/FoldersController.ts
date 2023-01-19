import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Folder from 'App/Models/Folder'

export default class FoldersController {
  public async index({}: HttpContextContract) {
    return await Folder.all()
  }

  public async store({ request, response }: HttpContextContract) {
    const { name } = request.all()

    const folder = await Folder.create({ name })

    return response.created(folder)
  }

  @bind()
  public async show({}: HttpContextContract, folder: Folder) {
    return folder
  }

  @bind()
  public async update({ request }: HttpContextContract, folder: Folder) {
    const { name } = request.all()

    folder.merge({
      name,
    })

    await folder.save()

    return folder
  }

  @bind()
  public async destroy({ response }: HttpContextContract, folder: Folder) {
    await folder.delete()

    return response.noContent()
  }
}
