const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
ctx.translate(0, canvas.height)
ctx.scale(1, -1)


class Particle {
  constructor(x, y, radius, vx, vy, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.vx = vx
    this.vy = vy
    this.color = color
  }
  render() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    ctx.fillStyle = this.color
    ctx.fill()
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    if(this.x + this.radius >= canvas.width || this.x - this.radius <= 0){
      this.vx *= -1
      const red = Math.floor(Math.random()*256)
      const green = Math.floor(Math.random()*256)
      const blue = Math.floor(Math.random()*256)
      const alpha = Math.floor(Math.random()*101) 
      this.color = "rgb("+red+", "+green+", "+blue+","+alpha+")"
      //this.color = "#FF0461"
    }
    if(this.y + this.radius >= canvas.height || this.y - this.radius <= 0){
      this.vy *= -1
      const red = Math.floor(Math.random()*256)
      const green = Math.floor(Math.random()*256)
      const blue = Math.floor(Math.random()*256)
      const alpha = Math.floor(Math.random()*101) 
      this.color = "rgb("+red+", "+green+", "+blue+","+alpha+")"
    }
    this.render()
  }
}

const num = 1000
const particles = []

function createRanParticles() {
  for(let i = 0; i < num; i++) {
    const radius = Math.random() * 20
    const x = Math.random() * (canvas.width - radius*2) + radius 
    const y = Math.random() * (canvas.height - radius*2) + radius
    const vx = Math.random() * 5
    const vy = Math.random() * 5
    const particle = new Particle(x, y, radius, vx, vy, "#66FF66")
    
    particles.push(particle)
  }
}
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for(let i = 0; i < particles.length; i++) {
    particles[i].update()
  }

  window.requestAnimationFrame(render)
}

createRanParticles()
render()


