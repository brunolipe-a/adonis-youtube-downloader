/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Folder from 'App/Models/Folder'

Route.get('/', async ({ view }) => {
  const folders = await Folder.query().preload('musics')
  // const downloads = await Download.query().orderBy('createdAt', 'desc')

  return view.render('home', { folders })
})

Route.get('/download', ({ view, request }) => {
  return view.render('download', { isOk: request.input('ok') })
})

Route.post('folders/:folder/download', 'DownloadFolderController.handle').as('folders.download')

Route.resource('folders', 'FoldersController').apiOnly()
Route.resource('folders.musics', 'MusicController').only(['index', 'store', 'destroy'])
Route.resource('folders.playlists', 'PlaylistsController').only(['store'])
Route.post('playlist/download', 'PlaylistsController.download')

Route.resource('downloads', 'DownloadsController').only(['index'])
