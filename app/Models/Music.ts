import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Folder from './Folder'

export default class Music extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public folderId: number

  @column()
  public title: string

  @column()
  public videoUrl: string

  @column()
  public thumbnailUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Folder)
  public folder: BelongsTo<typeof Folder>
}
