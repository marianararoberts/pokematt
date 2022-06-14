const battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png'

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
});

const professorOakImage = new Image();
professorOakImage.src = './img/professor.png'

const professorOak = new Sprite({
  position: {
    x: 100,
    y: 20
  },
  image: professorOakImage
});

const doorBackgroundImage = new Image();
doorBackgroundImage.src = './img/doorBackground.png'

const doorBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: doorBackgroundImage
});

const BCAMattImage = new Image();
BCAMattImage.src = './img/ourMatt.png'

const BCAMatt = new Sprite({
  position: {
    x: 200,
    y: 240
  },
  image: BCAMattImage,
  name: 'BCA Matt'
});

const tiredMattImage = new Image();
tiredMattImage.src = './img/normalMattSprite.png'

const tiredMatt = new Sprite({
  position: {
    x: 720,
    y: -20
  },
  image: tiredMattImage,
  isEnemy: true,
  name: 'Tired Matt'
});

let battleAnimationId;

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  gsap.to('#transitionDiv', {
    opacity: 0,
    duration: .3
  })
  battleBackground.draw();
  tiredMatt.draw()
  BCAMatt.draw()
}

function enterDoor() {
  window.requestAnimationFrame(enterDoor)
  gsap.to('#transitionDiv', {
    opacity: 0,
    duration: .4
  })
  doorBackground.draw();
  professorOak.draw();
}

const queue = [];

const attackArr = ['Mathattack', 'Sleep']
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    BCAMatt.attack({
      attack: selectedAttack,
      recipient: tiredMatt
    })

    if (tiredMatt.health <= 0) {
      queue.push(() => {
        tiredMatt.faint()
      })
      queue.push(() => {
        battleItems.forEach(item => {
          item.style.display = "none";
        });
        battleItems2.forEach(item => {
          item.style.opacity = 0.0;
        });
        BCAMatt.leave()
      })


    }
    queue.push(() => {
      tiredMatt.attack({
        attack: attacks[attackArr[Math.floor(Math.random() * 2)]],
        recipient: BCAMatt
      })
      if (BCAMatt.health <= 0) {
        queue.push(() => {
          BCAMatt.faint()
        })
        queue.push(() => {
          battleItems.forEach(item => {
            item.style.display = "none";
          });
          battleItems2.forEach(item => {
            item.style.opacity = 0.0;
          });
          tiredMatt.leave()
        })
        
      }
    })

  })

  button.addEventListener('mouseenter', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    document.querySelector('#attackBox').innerHTML = selectedAttack.type;
    document.querySelector('#attackBox').style.color = selectedAttack.color;
  })
})

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else {
    e.currentTarget.style.display = 'none';
  }
})