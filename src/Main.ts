class Main extends eui.UILayer {

    private SnakeSpeed = 1;

    private MapWidth = 26;
    private MapHeight = 15;

    private SpriteWidth = 8;
    private SpriteHeight = 8;

    private snake = [];
    private point = { x: 0, y: 0 };
    private snakeDirection = 0;

    private bg_border = [];

    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.stage.scaleMode = egret.StageScaleMode.NO_SCALE;
        this.stage.width = this.MapWidth * this.SpriteWidth;
        this.stage.height = this.MapHeight * this.SpriteHeight;

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        // 加载资源
        await this.loadResource()
        // 创建地图
        this.createMap();
        // 创建蛇
        this.createSnake();
        // 创建点
        this.createPoint();

        // await platform.login();
        // const userInfo = await platform.getUserInfo();
        // console.log(userInfo);

        this.render();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }
    // 创建地图
    createMap() {
        for (let i = 0; i < this.MapWidth * this.MapHeight; i++) {
            if (i < this.MapWidth) {
                this.bg_border.push(i);
            } else if (i > this.MapWidth * (this.MapHeight - 1) && i < this.MapWidth * this.MapHeight) {
                this.bg_border.push(i);
            } else {
                if (i % this.MapWidth == 0) {
                    this.bg_border.push(i);
                }
                if (i % this.MapWidth == (this.MapWidth - 1)) {
                    this.bg_border.push(i);
                }
            }
        }
    }
    // 渲染地图
    renderMap() {
        let bg = new egret.Sprite();
        bg.graphics.beginFill(0xffffff);
        bg.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
        bg.graphics.endFill();

        for (let i = 0; i < this.bg_border.length; i++) {
            let x = this.bg_border[i] % this.MapWidth * this.SpriteHeight;
            let y = Math.floor(this.bg_border[i] / this.MapWidth) * this.SpriteHeight;
            let wall = new Wall();
            wall.x = x;
            wall.y = y;
            this.stage.addChild(wall);
        }
    }
    // 渲染按钮
    renderInput() {
        // let up_x = 150;
        // let up_y = 200;
        // ctx.drawImage(InputUpImg, up_x, up_y, 100, 100);
        // let down_x = 150;
        // let down_y = 350;
        // ctx.drawImage(InputDownImg, down_x, down_y, 100, 100);
        // let left_x = 75;
        // let left_y = 275;
        // ctx.drawImage(InputLeftImg, left_x, left_y, 100, 100);
        // let right_x = 225;
        // let right_y = 275;
        // ctx.drawImage(InputRightImg, right_x, right_y, 100, 100);
    }
    // 创建蛇，5节
    createSnake() {
        // head
        this.snake.push({
            x: Math.floor(this.MapWidth / 2),
            y: Math.floor(this.MapHeight / 2),
        });
        // body
        for (let i = 1; i < 5; i++) {
            this.snake.push({
                x: Math.floor(this.MapWidth / 2 - i),
                y: Math.floor(this.MapHeight / 2),
            });
        }
    }
    // 创建点
    createPoint() {
        let is_hit = false;
        this.point = new Point();
        // 生成点位，并检测是否重叠
        do {
            this.point = this.generatePointIndex();
            for (let i = 0; i < this.snake.length; i++) {
                if (this.point.x == this.snake[i].x && this.point.y == this.snake[i].y) {
                    is_hit = true;
                }
            }
        } while (is_hit);
    }
    // 渲染点
    renderPoint() {
        let x = this.point.x * this.SpriteWidth;
        let y = this.point.y * this.SpriteHeight;
        let point = new Point();
        point.x = x;
        point.y = y;
        this.stage.addChild(point);
    }
    // 生成点位
    generatePointIndex() {
        let x = (Math.floor(Math.random() * (this.MapWidth - 2)) + 1);
        let y = (Math.floor(Math.random() * (this.MapHeight - 2)) + 1);
        return { x, y };
    }
    // 根据方向移动蛇
    moveSnake() {
        let old_snake = this.snake.slice();
        switch (this.snakeDirection) {
            case 0:
                return;
            case 1:
                this.snake.unshift({
                    x: old_snake[0].x,
                    y: old_snake[0].y - 1,
                });
                break;
            case 2:
                this.snake.unshift({
                    x: old_snake[0].x,
                    y: old_snake[0].y + 1,
                });
                break;
            case 3:
                this.snake.unshift({
                    x: old_snake[0].x - 1,
                    y: old_snake[0].y,
                });
                break;
            case 4:
                this.snake.unshift({
                    x: old_snake[0].x + 1,
                    y: old_snake[0].y,
                });
                break;
        }
        this.snake.pop();
    }
    // 渲染蛇
    renderSnake() {
        for (let i = 0; i < this.snake.length; i++) {
            let x = this.snake[i].x * this.SpriteWidth;
            let y = this.snake[i].y * this.SpriteHeight;
            let snake = new Snake();
            snake.x = x;
            snake.y = y;
            this.stage.addChild(snake);
        }
    }
    // 清理canvas用于重绘
    clearCanvas() {
        let x = this.SpriteWidth;
        let y = this.SpriteHeight;
        let width = (this.MapWidth - 2) * this.SpriteWidth;
        let height = (this.MapHeight - 2) * this.SpriteHeight;
        // ctx.fillStyle = 'white';
        // ctx.fillRect(x, y, width, height);
    }
    // 渲染
    render() {
        this.clearCanvas();
        this.renderMap();
        this.renderInput();
        this.renderSnake();
        this.renderPoint();
        // ctx.drawImage(PointImg, 0, 0);
        // requestAnimationFrame(() => {
        //     this.render();
        // });
        console.log('1');
    }
}
