import { Ws } from '@ioc:Adonis/Addons/Ws'
import TestController from 'App/Controllers/Websocket/TestController'

Ws.io.on('connection', (socket) => {
  socket.on('user:new', TestController.handle)
})
