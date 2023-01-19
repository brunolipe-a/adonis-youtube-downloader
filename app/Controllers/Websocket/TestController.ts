interface TestControllerPayload {
  message: string
}

class TestController {
  public async handle({ message }: TestControllerPayload) {
    console.log(message)
  }
}

export default new TestController()
