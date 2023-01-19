declare module '@ioc:Adonis/Addons/Ws' {
  import { WebSocketManager } from 'managers/WebSocketManager'

  interface NewUserPayload {
    message: string
  }

  interface ListenEvents {
    'user:new': any
  }

  export const Ws: WebSocketManager
}
