export class Request {
  constructor () {
  }

  parseReqMsg (reqMsg) {
    const separateInx = reqMsg.indexOf("\r\n")
    const reqLineAry = reqMsg.substring(0, separateInx).split(" ")
    const reqLine = {method: reqLineAry[0], path: reqLineAry[1], versiton: reqLineAry[2]}
    return reqLine
  }
}