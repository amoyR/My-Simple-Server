import { createRequire } from 'module';
import {Request} from './request.js'
import {Response} from './response.js'

export class WebServer {
  constructor() {
    const require = createRequire(import.meta.url);
    this.net = require("net")
    const config = require('config')
    this.basePath = config.server.base
    this.portNum = config.server.port
  }

  bootServer () {
    const server = this.net.createServer(socket => {
      socket.setEncoding('utf8')
      socket.on("data", data => {
        const reqLine = this.extractRequestLine(data)
        const response = this.createResponse(reqLine)

        socket.write(response['head'])
        socket.write(response['body'])
      })
    
    }).listen(this.portNum)
  }

  extractRequestLine (requestMsg) {
        const request = new Request()
        return request.parseReqMsg(requestMsg)
  }

  createResponse (reqLine) {
    const repose = new Response(this.basePath)
    return repose.createResMsg(reqLine) 
  }
}