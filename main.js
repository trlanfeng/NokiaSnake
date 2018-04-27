const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d');
const Image = wx.createImage;

const BorderURL = 'images/point.png';
const PointURL = 'images/point.png';
const SnakeURL = 'images/snake.png';

const MapWidth = 26;
const MapHeight = 15;

const SpriteWidth = 8;
const SpriteHeight = 8;

const snake = [];

const UP = 1;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 4;

let snake_dir = 0;

export default class Main {
  constructor() {
    wx.onTouchStart(function (e) {
      snake_dir = UP;
    });
    wx.onTouchMove(function (e) {
      console.log('move');
    });
    wx.onTouchEnd(function (e) {
      console.log('end');
    });
    wx.onTouchCancel(function (e) {
      console.log('cancel');
    });

    this.bg_border = [];
    this.createMap();
    this.createSnake();
    this.createPoint();
    this.renderSnake();
    setInterval(() => { this.moveSnake(); }, 1000);
  }

  // 创建地图
  createMap() {
    for (let i = 0; i < MapWidth * MapHeight; i++) {
      if (i < MapWidth) {
        this.bg_border.push(i);
      } else if (i > MapWidth * (MapHeight - 1) && i < MapWidth * MapHeight) {
        this.bg_border.push(i);
      } else {
        if (i % MapWidth == 0) {
          this.bg_border.push(i);
        }
        if (i % MapWidth == (MapWidth - 1)) {
          this.bg_border.push(i);
        }
      }
    }

    // console.log(this.bg_border);

    for (let i = 0; i < this.bg_border.length; i++) {
      let img = wx.createImage();
      img.src = BorderURL;
      let x = this.bg_border[i] % MapWidth * SpriteHeight;
      let y = Math.floor(this.bg_border[i] / MapWidth) * SpriteHeight;
      img.onload = () => {
        ctx.drawImage(img, x, y);
      }
    }
  }

  // 创建蛇，5节
  createSnake() {
    // head
    snake.push({
      x: Math.floor(MapWidth / 2),
      y: Math.floor(MapHeight / 2),
    });
    // body
    for (let i = 1; i < 5; i++) {
      snake.push({
        x: Math.floor(MapWidth / 2 - i),
        y: Math.floor(MapHeight / 2),
      });
    }
  }
  createPoint() {
    let point;
    let is_hit = false;
    do {
      point = this.generatePointIndex();
      for (let i = 0; i < snake.length; i++) {
        if (point.x == snake[i].x && point.y == snake[i].y) {
          is_hit = true;
        }
      }
    } while (is_hit);

    let x = point.x * SpriteWidth;
    let y = point.y * SpriteHeight;
    let img = new Image();
    console.log({ x, y });
    img.src = PointURL;
    img.onload = () => {
      ctx.drawImage(img, x, y);
    }
  }
  generatePointIndex() {
    let x = (Math.floor(Math.random() * (MapWidth - 2)) + 1);
    let y = (Math.floor(Math.random() * (MapHeight - 2)) + 1);
    return { x, y };
  }
  moveSnake() {
    let old_snake = snake.slice();
    switch (snake_dir) {
      case 0:
        return;
      case 1:
        snake.unshift({
          x: old_snake[0].x,
          y: old_snake[0].y - SpriteHeight,
        });
        break;
      case 2:
        snake.unshift({
          x: old_snake[0].x,
          y: old_snake[0].y + SpriteHeight,
        });
        break;
      case 3:
        snake.unshift({
          x: old_snake[0].x - SpriteWidth,
          y: old_snake[0].y,
        });
        break;
      case 4:
        snake.unshift({
          x: old_snake[0].x + SpriteWidth,
          y: old_snake[0].y,
        });
        break;
    }
    snake.pop();
    this.renderSnake();
  }
  renderSnake() {
    for (let i = 0; i < snake.length; i++) {
      let img = new Image();
      img.src = SnakeURL;
      let x = snake[i].x * SpriteWidth;
      let y = snake[i].y * SpriteHeight;
      img.onload = () => {
        ctx.drawImage(img, x, y);
      }
    }
  }
}