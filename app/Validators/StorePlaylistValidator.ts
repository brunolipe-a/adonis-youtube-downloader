import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StorePlaylistValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    playlistUrl: schema.string([rules.url()]),
  })

  public messages: CustomMessages = {}
}
