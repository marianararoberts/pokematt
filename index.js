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

image.onload = () => {
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






