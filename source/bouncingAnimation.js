const canvas = document.getElementById("canvas")
const ctx    = canvas.getContext("2d")

class Ball {
  constructor(r, color, canvas) {
    this.r = r 
    this.color = color
    this.canvas = canvas
  } 

  isColliding(y) {
    return y > this.canvas.height - this.r
  }

  boundaryAligment() {
    return this.canvas.height - this.r
  }

  render(x, y) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.beginPath()
    ctx.arc(x, y, this.r, 0, Math.PI * 2, true)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

}

class Triangle {
	constructor(edge, color, canvas) {
		this.edge = edge
		this.color = color
		this.canvas = canvas
	}

  isColliding(y) {
    return y > this.canvas.height - (this.edge / (2 * Math.sqrt(3)))
  }

  boundaryAligment() {
    return this.canvas.height - (this.edge / (2 * Math.sqrt(3)))
  }

	clacVertices(gx, gy){
		this.x1 = gx - (this.edge / 2)
		this.y1 = gy + (this.edge / (2 * Math.sqrt(3)))
		this.x2 = gx + (this.edge / 2)
		this.y2 = gy + (this.edge / (2 * Math.sqrt(3)))
		this.x3 = gx 
		this.y3 = gy -  (this.edge / Math.sqrt(3))
	}

	render(gx, gy){
		this.clacVertices(gx, gy)
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		ctx.beginPath()
		ctx.moveTo(this.x1, this.y1)
		ctx.lineTo(this.x2, this.y2)
		ctx.lineTo(this.x3, this.y3)
		ctx.fillStyle = this.color
		ctx.fill()
		ctx.closePath()
	}

}
class Rectangle {
	constructor(width, height, color, canvas){
		this.width = width
		this.height = height
		this.color = color
		this.canvas = canvas
	}

	isColliding(y){
		return y > this.canvas.height - this.height
	}

	boundaryAligment(){
		return this.canvas.height - this.height
	}

	render(x, y){
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		ctx.beginPath()
		ctx.fillStyle = this.color
		ctx.fillRect(x, y, this.width, this.height)
		ctx.closePath()
	}

}

class Text {
  constructor(textContent, color, canvas) {
    this.textContent =  textContent
    this.color = color
    this.canvas = canvas
  } 

  isColliding(y) {
    return y > this.canvas.height
  }

  boundaryAligment() {
    return this.canvas.height
  }

  render(x, y){
    ctx.font = "20px sans-serif"
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.fillText(this.textContent, x, y)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

}

class Picture {
  constructor(width, height, imgSrc, canvas){
    this.width = width
    this.height = height

    this.imgSrc = imgSrc
    this.canvas = canvas

    this.img = new Image() 
    this.complete = false
    const dum = this
    this.img.addEventListener('load', ()=> {
      dum.complete = true
    }, false)
    this.img.src = "/img/cheers.jpeg"
  }

  isColliding(y) {
    return y + this.height > this.canvas.height
  }
  
  boundaryAligment() {
    return this.canvas.height - this.height 
  }

  imageIsReady() {
    return this.complete
  }

  render(x, y){
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (this.imageIsReady()){ 
      ctx.drawImage(this.img, x, y, this.width, this.height)
    }

  }

}

class BounceEngine {
  constructor(vx, vy, g, objectType) {
    this.vx = vx
    this.vy = vy
    this.g  = g

    this.running = false

    this.setObjectType(objectType)
  }

  resetPosition() {
    this.x  = 100
    this.y  = 100
	}

  setObjectType(bt) {
    this.objectType = bt
  }

  update(dt = 0.03) {
    if ( ! this.running ) return 

    this.vy += this.g * dt 

    this.x  += this.vx * dt
    this.y  += this.vy * dt

    if( this.objectType.isColliding(this.y) ){
      this.vx *= 0.8
      this.vy *= -0.8

      this.y   = this.objectType.boundaryAligment()
    }

    this.objectType.render(this.x, this.y)
  }

}

const initialVX   = 15 
const initialVY   = -5
const g           = 9.8

let   objectType 

const bounceEngine = new BounceEngine(initialVX, initialVY, g, objectType)


function startAnimation(){
	bounceEngine.resetPosition()
	bounceEngine.vx = initialVX
	bounceEngine.vy = initialVY
  bounceEngine.running = true
}

function setAnimationTarget(){
  const type = getValue(objectType, "draw")
  const color = getValue(colorType, "color")

	switch (type) {
		case "ball":
			const ball = new Ball(10, color, canvas) 
				bounceEngine.setObjectType(ball)
				break;
		case "triangle":
			const triangle = new Triangle(30, color, canvas) 
				bounceEngine.setObjectType(triangle)
				break;
		case "rectangle":
			const rectangle = new Rectangle(30, 30, color, canvas) 
				bounceEngine.setObjectType(rectangle)
				break;
		case "text":
			const text = new Text("Hello", color, canvas)
			bounceEngine.setObjectType(text)
			break;
		case 'picture':
			const picture = new Picture(100, 100, "/img/cheers.jpeg", canvas)
			bounceEngine.setObjectType(picture)
			break;
		default:
			console.log(`Sorry, we are out of ${type}.`);
	}
}
setAnimationTarget()

function startAnimationLoop(){
	bounceEngine.update(0.2)
	window.requestAnimationFrame(startAnimationLoop)
}
startAnimationLoop()

function getValue (id, typeName){
  const elm = document.getElementById("id")
  const elmName = document.querySelector(`[name="${typeName}"]:checked`) 
  const val = elmName.value
  return val
}
  
