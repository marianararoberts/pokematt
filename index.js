const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const battleItems = document.querySelectorAll('.battleItem');
const boxes = document.querySelectorAll('.box1');
const battleItems2 = document.querySelectorAll('.battleItem2');

battleItems.forEach(item => {
  item.style.display = "none";
});  

battleItems2.forEach(item => {
  item.style.opacity = 0.0;
});  

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const doorMap = []
for (let i = 0; i < doorData.length; i += 70) {
  doorMap.push(doorData.slice(i, 70 + i))
}

const boundaries = []
const offset = {
  x: -735,
  y: -620
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y - 50
          }
        })
      )
  })
})

const doorZones = []

doorMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
    doorZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})


c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/map.png';

const foregroundImage = new Image();
foregroundImage.src = './img/foregroundObjects.png';

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2
  },
  image: playerDownImage,
  frames: {
    max: 4
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage
  }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage
})

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

const movables = [background, foreground, ...boundaries, ...battleZones, ...doorZones]

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y + rectangle2.height
  )
}

const battle = {
  initiated: false
}

const openDoor = {
  initiated: false
}

function playerMove() {
  const animationId = window.requestAnimationFrame(playerMove)
  background.draw()
  boundaries.forEach((boundary) => {
    boundary.draw();
  })
  battleZones.forEach((battleZone) => {
    battleZone.draw()
  })
  doorZones.forEach((doorZone) => {
    doorZone.draw()
  })
  player.draw();
  foreground.draw();
  if (openDoor.initiated)
    player.position.y +=40;
  let moving = true
  player.moving = false;
  
  if (openDoor.initiated) return

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < doorZones.length; i++) {
      const doorZone = doorZones[i]
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          doorZone.position.x + doorZone.width
        ) -
          Math.max(player.position.x, doorZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          doorZone.position.y + doorZone.height
        ) -
          Math.max(player.position.y, doorZone.position.y))
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: doorZone
        }) &&
        overlappingArea > (player.width * player.height) / 2
      ) {
        window.cancelAnimationFrame(animationId)
        openDoor.initiated = true
        gsap.to('#transitionDiv', {
          opacity: 1,
          yoyo: true,
          duration: .4,
          onComplete() {
            gsap.to('#transitionDiv', {
              opacity: 1,
              duration: .4,
              onComplete() {
                enterDoor()
                gsap.to('#transitionDiv', {
                  opacity: 1,
                  duration: .4
                })
                battleItems.forEach(item => {
                  item.style.display = "flex";
                });
                document.querySelector('#dialogueBox').style.display = "block"
                boxes.forEach(item => {
                  item.style.display = "none";
                });
                let dialogueThing = document.querySelector('#dialogueBox');
                dialogueThing.innerHTML = "Hi! I'm Professor Oak!"
                queue.push(() => {
                  dialogueThing.innerHTML = "Congratulations on defeating a Pokematt!"
                })
                queue.push(() => {
                  document.querySelector('#dialogueBox').style.display = "none"
                  document.querySelector('#boxThing').style.display = "none"
                  professorOak.faint();
                  playerMove()
                  cancelAnimationFrame(doorAnimationId)
                  openDoor.initiated = false
                })
              }
            })
          }
        })
        break
      }
    }
  }

  if (battle.initiated) return

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y))
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.02
      ) {
        window.cancelAnimationFrame(animationId)

        audio.Map.stop()
        audio.initBattle.play()
        audio.battle.play()
        battle.initiated = true
        gsap.to('#transitionDiv', {
          opacity: 1,
          repeat: 3, 
          yoyo: true,
          duration: .4,
          onComplete() {
            gsap.to('#transitionDiv', {
              opacity: 1,
              duration: .4,
              onComplete() {
                BCAMatt.health = 100;
                tiredMatt.health = 100;
                let healthBar1 = '#enemyHealthBar'
                let healthBar2 = '#playerHealthBar'
                gsap.to(healthBar1, {
                  width: BCAMatt.health + '%',
                  duration: 0.01
                })
                gsap.to(healthBar2, {
                  width: tiredMatt.health + '%',
                  duration: 0.01
                })
                gsap.to(BCAMatt, {
                  opacity: 1
                })
                gsap.to(tiredMatt, {
                  opacity: 1
                })
                animateBattle()
                battleItems.forEach(item => {
                  item.style.display = "flex";
                });
                battleItems2.forEach(item => {
                  item.style.opacity = "";
                });
                gsap.to('#transitionDiv', {
                  opacity: 1,
                  duration: .4
                })
              }
            })
            
          }
        })
        break
      }
    }
  }


  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true;
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
  }
  else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true;
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
  }
  else if (keys.s.pressed && lastKey === 's') {
    player.moving = true;
    player.image = player.sprites.down
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
  }
  else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true;
    player.image = player.sprites.right
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
  }
}
playerMove()

let lastKey = '';
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break

    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})

let clicked = false
addEventListener('click', () => {
  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
})