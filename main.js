const canvas = wx.createCanvas();
const ScreenWidth = canvas.width;
const ScreenHeight = canvas.height;
const ctx = canvas.getContext('2d');
const Image = wx.createImage;

const ResList = [];
let LoadedRes = 0;
let FinishLoad = false;

const BorderURL = 'images/point.png';
const PointURL = 'images/point.png';
const SnakeURL = 'images/snake.png';
const InputUpURL = 'images/input_up.png';
const InputDownURL = 'images/input_down.png';
const InputLeftURL = 'images/input_left.png';
const InputRightURL = 'images/input_right.png';

const BorderImg = new Image();
const PointImg = new Image();
const SnakeImg = new Image();
const InputUpImg = new Image();
const InputDownImg = new Image();
const InputLeftImg = new Image();
const InputRightImg = new Image();

let SnakeSpeed = 1;

const MapWidth = 26;
const MapHeight = 15;

const SpriteWidth = 8;
const SpriteHeight = 8;

const snake = [];
let point = {};

const UP = 1;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 4;

let snake_dir = 0;

export default class Main {
  constructor() {
    BorderImg.src = BorderURL;
    PointImg.src = PointURL;
    SnakeImg.src = SnakeURL;
    InputUpImg.src = InputUpURL;
    InputDownImg.src = InputDownURL;
    InputLeftImg.src = InputLeftURL;
    InputRightImg.src = InputRightURL;

    // 绑定输入
    wx.onTouchStart(function (e) {
      snake_dir = UP;
    });
    wx.onTouchMove(function (e) {
      console.log('move');
    });
    wx.onTouchEnd(function (e) {
      let x = e.screenX;
      let y = e.screenY;
    });
    wx.onTouchCancel(function (e) {
      console.log('cancel');
    });

    // 初始化边界
    this.bg_border = [];

    this.init();
  }
  // 初始化方法
  init() {
    // 初始化资源
    this.init_resources();
    // 开始加载资源
    this.load_resources();
    // 创建地图
    this.createMap();
    // 创建蛇
    this.createSnake();
    // 创建点
    this.createPoint();
    // setInterval(() => { this.moveSnake(); }, 1000 / SnakeSpeed);
  }
  // 初始化资源
  init_resources() {
    ResList.push(BorderImg);
    ResList.push(PointImg);
    ResList.push(SnakeImg);
    ResList.push(InputUpImg);
    ResList.push(InputDownImg);
    ResList.push(InputLeftImg);
    ResList.push(InputRightImg);
  }
  // 加载资源
  load_resources() {
    for (let i = 0; i < ResList.length; i++) {
      ResList[i].onload = () => {
        LoadedRes++;
        console.log(LoadedRes + '/' + ResList.length);
        if (LoadedRes === ResList.length) {
          FinishLoad = true;
          console.log('加载完毕！');
          // 资源加载完毕方法
          this.onload_complete_resources();
        }
      };
    }
  }
  // 资源加载完毕方法
  onload_complete_resources() {
    requestAnimationFrame(() => { this.render(); });
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
  }
  // 渲染地图
  renderMap() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.bg_border.length; i++) {
      let x = this.bg_border[i] % MapWidth * SpriteHeight;
      let y = Math.floor(this.bg_border[i] / MapWidth) * SpriteHeight;
      ctx.drawImage(BorderImg, x, y);
    }
  }
  // 渲染按钮
  renderInput() {
    let up_x = 150;
    let up_y = 200;
    ctx.drawImage(InputUpImg, up_x, up_y, 100, 100);
    let down_x = 150;
    let down_y = 350;
    ctx.drawImage(InputDownImg, down_x, down_y, 100, 100);
    let left_x = 75;
    let left_y = 275;
    ctx.drawImage(InputLeftImg, left_x, left_y, 100, 100);
    let right_x = 225;
    let right_y = 275;
    ctx.drawImage(InputRightImg, right_x, right_y, 100, 100);
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
  // 创建点
  createPoint() {
    let is_hit = false;
    // 生成点位，并检测是否重叠
    do {
      point = this.generatePointIndex();
      for (let i = 0; i < snake.length; i++) {
        if (point.x == snake[i].x && point.y == snake[i].y) {
          is_hit = true;
        }
      }
    } while (is_hit);
  }
  // 渲染点
  renderPoint() {
    let x = point.x * SpriteWidth;
    let y = point.y * SpriteHeight;
    ctx.drawImage(PointImg, x, y);
  }
  // 生成点位
  generatePointIndex() {
    let x = (Math.floor(Math.random() * (MapWidth - 2)) + 1);
    let y = (Math.floor(Math.random() * (MapHeight - 2)) + 1);
    return { x, y };
  }
  // 根据方向移动蛇
  moveSnake() {
    let old_snake = snake.slice();
    switch (snake_dir) {
      case 0:
        return;
      case 1:
        snake.unshift({
          x: old_snake[0].x,
          y: old_snake[0].y - 1,
        });
        break;
      case 2:
        snake.unshift({
          x: old_snake[0].x,
          y: old_snake[0].y + 1,
        });
        break;
      case 3:
        snake.unshift({
          x: old_snake[0].x - 1,
          y: old_snake[0].y,
        });
        break;
      case 4:
        snake.unshift({
          x: old_snake[0].x + 1,
          y: old_snake[0].y,
        });
        break;
    }
    snake.pop();
  }
  // 渲染蛇
  renderSnake() {
    for (let i = 0; i < snake.length; i++) {
      let x = snake[i].x * SpriteWidth;
      let y = snake[i].y * SpriteHeight;
      ctx.drawImage(SnakeImg, x, y);
    }
  }
  // 清理canvas用于重绘
  clearCanvas() {
    let x = SpriteWidth;
    let y = SpriteHeight;
    let width = (MapWidth - 2) * SpriteWidth;
    let height = (MapHeight - 2) * SpriteHeight;
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, width, height);
  }
  // 渲染
  render() {
    this.clearCanvas();
    this.renderMap();
    this.renderInput();
    this.renderSnake();
    this.renderPoint();
    ctx.drawImage(PointImg, 0, 0);
    requestAnimationFrame(() => {
      this.render();
    });
  }
}