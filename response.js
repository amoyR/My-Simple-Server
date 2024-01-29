import { createRequire } from 'module';

export class Response {
  constructor (basePath) {
    this.basePath = basePath
    this.statusCode
    this.body
    this.bodySize
    this.contentType
  }

  createResMsg (request) {
    switch (request['method']) {
      case 'GET': 
        this.httpGet(request['path'])
        break
      default:
        this.returnServerError(500)
    }
    const response = {head: `${request['versiton']} ${this.statusCode}\r\nConnection: keep-alive\r\nKeep-Alive: timeout=5\r\nContent-Type: ${this.contentType}\r\nContent-Length: ${this.bodySize}\r\n\r\n`, body: this.body}
    return response
  }

  httpGet (path) {
    const filePath = this.basePath + path
    const extension = this.identifyExtension(path)
    const require = createRequire(import.meta.url);
    const fs = require('fs');

    if (filePath.indexOf("..") != -1) {
      this.returnClientError(403)
    } else {
      try {
        const fileStat    = fs.statSync(filePath)
        this.body         = fs.readFileSync(filePath)
        this.statusCode   = "200 OK"
        this.bodySize     = fileStat.size
        this.contentType  = this.setContentType(extension)
      } catch {
        this.returnClientError(404)
      }
    }
    return
  }

  returnClientError (statusCode) {
    switch (statusCode) {
      case 403:
        this.statusCode = "403 Forbidden"
        this.body = "Forbidden"
        this.bodySize = Buffer.byteLength(this.body)
        this.contentType = 'text/plain'
      case 404:
        this.statusCode = "404 Not Found"
        this.body = "Not Found"
        this.bodySize = Buffer.byteLength(this.body)
        this.contentType = 'text/plain'
    } 
    return
  }

  returnServerError (statusCode) {
    switch (statusCode) { 
      case 500:
        this.statusCode = "500 Internal Server Error"
        this.body = "Internal Server Error"
        this.bodySize = Buffer.byteLength(this.body)
        this.contentType = 'text/plain'
    }
    return
  }

  identifyExtension(path) {
    const separatedPath = path.split(".")
    const extension = separatedPath[1]
    return extension
  }

  setContentType(extension) {
    let contentType = "text/plain"
    switch (extension) {
      case "html":
        contentType = "text/html";
        break;
      case "css":
        contentType = "text/css";
        break;
      case "js":
        contentType = "application/javascript";
        break;
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "bmp":
        contentType = "image/bmp";
        break;
    }
    return contentType
  }
}