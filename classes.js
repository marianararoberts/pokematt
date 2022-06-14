class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 }, sprites, isEnemy = false, name }) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.moving = false;
    this.sprites = sprites
    this.opacity = 1
    this.health = 100
    this.isEnemy = isEnemy
    this.name = name
  }
  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
    c.restore()

    if (this.moving) {

      if (this.frames.max > 1) {
        this.frames.elapsed++;
      }
      if (this.frames.elapsed % 10 === 0) {
        if (this.frames.val < this.frames.max - 1)
          this.frames.val++;
        else
          this.frames.val = 0;
      }
    }
  }
  attack({attack, recipient}) {
    let damageDealt = Math.floor(Math.random() * attack.damage) + 5;
    let dBox = document.querySelector('#dialogueBox');
    dBox.style.display = 'block'
    dBox.innerHTML = this.name + ' used ' + attack.name + '! Causing ' + damageDealt + ' damage.'

    const timeline = gsap.timeline()
    
    recipient.health -= damageDealt;

    let movementDistance = 20

    let healthBar = '#enemyHealthBar'
    if(this.isEnemy) healthBar = '#playerHealthBar'
    if (this.isEnemy) movementDistance = -20
    timeline.to(this.position, {
      x: this.position.x - movementDistance
    }).to(this.position, {
      x: this.position.x + movementDistance * 2,
      duration: 0.08,
      onComplete: () => {
        gsap.to(healthBar, {
          width: recipient.health + '%'
        })
        gsap.to(recipient.position, {
          x: recipient.position.x + 10,
          duration: 0.1,
          yoyo: true,
          repeat: 3
        })
        gsap.to(recipient, {
          opacity: 0,
          repeat: 3,
          yoyo: true,
          duration: 0.1
        })
      }
    }).to(this.position, {
      x: this.position.x
    })
  }

  faint() {
    let dBox = document.querySelector('#dialogueBox');
    dBox.innerHTML = this.name + ' fainted!'
    gsap.to(this.position, {
      y: this.position.y + 20
    })
    gsap.to(this, {
      opacity: 0
    })
  }

  leave() {
    gsap.to(this.position, {
      y: this.position.y + 20
    })
    gsap.to(this, {
      opacity: 0,
      onComplete: () => {
        cancelAnimationFrame(battleAnimationId)
        playerMove()
        battle.initiated = false;
      }
    })
    let dBox = document.querySelector('#dialogueBox');
    dBox.innerHTML = 'Fight!'
  }

}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0.0)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}