const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 960;
canvas.height = 540;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/map.png';

const playerImage = new Image();
playerImage.src = './img/playerDown.png'

let backgroundX = 0
let playerX = 0

class Sprite {
    constructor({position, velocity, image}) {
        this.position = position
        this.image = image
    }
    draw() {
        c.drawImage(this.image, 0, -1350)
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: -1350
    },
    image: image
})

function playerMove() {
    window.requestAnimationFrame(playerMove)
    background.draw()
    c.drawImage(image, 0, -1350);
    c.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2.71 - playerImage.width / 4 / 2,
        canvas.height / 1.8- playerImage.height / 2,
        playerImage.width / 4,
        playerImage.height
    )
}
playerMove()

function animate(){
    window.requestAnimationFrame(animate)
    console.log('animate')
}
animate()

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            console.log('pressed w key')
            break
        case 'a':
            console.log('pressed a key')
            break
        case 's':
            console.log('pressed s key')
            break
        case 'd':
            console.log('pressed d key')
            break
    }
})





