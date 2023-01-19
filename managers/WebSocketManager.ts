import { RedisManagerContract } from '@ioc:Adonis/Addons/Redis'
import { ListenEvents } from '@ioc:Adonis/Addons/Ws'
import { ServerContract } from '@ioc:Adonis/Core/Server'
import { createAdapter } from '@socket.io/redis-adapter'
import { Server } from 'socket.io'

export class WebSocketManager {
  public io: Server<ListenEvents, ListenEvents, ListenEvents>

  private booted = false

  constructor(private server: ServerContract, private redis: RedisManagerContract) {
    this.boot()
  }

  private boot() {
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(this.server.instance!)

    const redisConnection = this.redis.connection()

    this.io.adapter(
      createAdapter(redisConnection.ioConnection, redisConnection.ioSubscriberConnection)
    )
  }
}
