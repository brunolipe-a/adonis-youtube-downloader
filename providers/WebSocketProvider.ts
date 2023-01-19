import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { WebSocketManager } from '../managers/WebSocketManager'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class WebSocketProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Adonis/Addons/Ws', () => {
      const redis = this.app.container.resolveBinding('Adonis/Addons/Redis')
      const server = this.app.container.resolveBinding('Adonis/Core/Server')

      return {
        Ws: new WebSocketManager(server, redis),
      }
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    if (this.app.environment === 'web') {
      await import('../start/socket')
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
