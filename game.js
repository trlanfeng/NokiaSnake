// import Main from './main.js'

// let main = new Main();


const canvas = wx.createCanvas();
const off_canvas = wx.createCanvas();

const ScreenWidth = canvas.width;
const ScreenHeight = canvas.height;
const ctx = canvas.getContext('2d');
const off_ctx = off_canvas.getContext('2d');
const Image = wx.createImage;

let img = new Image();
img.src = 'images/hero.png';

ctx.fillStyle= 'white';
ctx.fillRect(0,0,canvas.width,canvas.height);

img.onload = () => {
  off_ctx.drawImage(img, 0, 0);
}

wx.onTouchEnd(()=>{
  console.log('end');
  off_ctx.drawImage(img, 0, 0);
})

function test() {
  requestAnimationFrame(()=>{
    off_ctx.drawImage(img, 0, 0);
    ctx.drawImage(off_canvas,0,0);
    test();
  });
}

test();