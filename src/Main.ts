class Main extends eui.UILayer {

    private SnakeSpeed = 1;

    private MapWidth = 83;
    private MapHeight = 47;

    private SpriteWidth = 8;
    private SpriteHeight = 10;

    private DesignWidth = 750;
    private DesignHeight = 1334;

    private OffsetY = 0;

    private pointPosition;
    public snakeArray = [];
    private snakeDirection = 0;
    private snakeDefaultLength = 5;

    private point: Point;
    private snake: egret.Sprite;

    private bg_border = [];

    private GameContainer: egret.Sprite;

    private timer: egret.Timer;

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

        this.runGame().catch(e => {
            console.log(e);
        })

        Main.Instance = this;
    }

    private async runGame() {
        // 加载资源
        await this.loadResource()
        // 初始化
        this.initGame();
        // 创建手机壳
        this.createPhone();
        // 创建游戏容器
        this.createGameContainer();
        // 创建地图
        this.createMap();
        // 创建蛇
        this.createSnake();
        // 创建点
        this.createPoint();

        // await platform.login();
        // const userInfo = await platform.getUserInfo();
        // console.log(userInfo);

    }
    // 资源加载
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
    // 初始化
    initGame() {
        this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
        this.OffsetY = Math.floor((this.stage.stageHeight - this.DesignHeight) / 2);
        this.GameContainer = new egret.Sprite();
        this.snake = new egret.Sprite();
        this.GameContainer.addChild(this.snake);
        this.point = new Point();
        this.GameContainer.addChild(this.point);

        this.timer = new egret.Timer(200, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, () => {
            this.moveSnake();
            this.updateSnake();
            this.checkGameEnd();
        }, this);
        this.timer.start();

        setTimeout(() => {
            this.changeDirection(1);
        }, 1000);

        setTimeout(() => {
            this.changeDirection(3);
        }, 3000);

        setTimeout(() => {
            this.changeDirection(2);
        }, 5000);

        setTimeout(() => {
            this.changeDirection(4);
        }, 7000);
    }
    // 创建并渲染手机壳
    createPhone() {
        let bg = new egret.Bitmap();
        bg.texture = RES.getRes('bg_png');
        bg.y = this.OffsetY;
        this.stage.addChild(bg);
    }
    // 创建游戏容器
    createGameContainer() {
        // this.GameContainer.width = 314;
        // this.GameContainer.height = 316;
        this.GameContainer.width = this.MapWidth * this.SpriteWidth;
        this.GameContainer.height = this.MapHeight * this.SpriteHeight;
        this.GameContainer.x = 219;
        this.GameContainer.y = 304 + this.OffsetY;
        this.GameContainer.scaleX = 1.5;
        this.GameContainer.scaleY = 1.5;
        this.stage.addChild(this.GameContainer);
    }
    // 创建地图
    createMap() {
        for (let i = 0; i < this.MapWidth * this.MapHeight; i++) {
            if (i < this.MapWidth) {
                this.createWall(i);
            } else if (i > this.MapWidth * (this.MapHeight - 1) && i < this.MapWidth * this.MapHeight) {
                this.createWall(i);
            } else {
                if (i % this.MapWidth == 0) {
                    this.createWall(i);
                }
                if (i % this.MapWidth == (this.MapWidth - 1)) {
                    this.createWall(i);
                }
            }
        }
    }
    // 创建具体墙
    createWall(index) {
        let pos_x = index % this.MapWidth;
        let x = pos_x * this.SpriteHeight;
        let pos_y = Math.floor(index / this.MapWidth);
        let y = pos_y * this.SpriteHeight;
        let wall = new Wall();
        wall.x = x;
        wall.y = y;
        this.GameContainer.addChild(wall);
        this.bg_border.push({ x: pos_x, y: pos_y });
    }
    // 创建蛇，默认5节:snakeDefaultLength
    createSnake() {
        // head
        this.snakeArray.push({
            x: Math.floor(this.MapWidth / 2),
            y: Math.floor(this.MapHeight / 2),
        });
        // body
        for (let i = 1; i < this.snakeDefaultLength; i++) {
            this.snakeArray.push({
                x: Math.floor(this.MapWidth / 2 - i),
                y: Math.floor(this.MapHeight / 2),
            });
        }
        for (let i = 0; i < this.snakeArray.length; i++) {
            let x = this.snakeArray[i].x * this.SpriteWidth;
            let y = this.snakeArray[i].y * this.SpriteHeight;
            let body = new SnakeBody();
            body.x = x;
            body.y = y;
            this.snake.addChild(body);
        }
    }
    // 创建点
    createPoint() {
        this.pointPosition = this.generatePointIndex();
        this.point.x = this.pointPosition.x * this.SpriteWidth;
        this.point.y = this.pointPosition.y * this.SpriteHeight;
    }
    // 生成点位，并检测是否重叠
    generatePointIndex() {
        let x, y;
        let is_hit = false;
        do {
            is_hit = false;
            x = (Math.floor(Math.random() * (this.MapWidth - 2)) + 1);
            y = (Math.floor(Math.random() * (this.MapHeight - 2)) + 1);
            for (let i = 0; i < this.snakeArray.length; i++) {
                if (x == this.snakeArray[i].x && y == this.snakeArray[i].y) {
                    is_hit = true;
                    break;
                }
            }
        } while (is_hit)
        return { x, y };
    }
    // 改变蛇方向
    changeDirection(arrow) {
        switch (arrow) {
            case 1:
                if (this.snakeDirection === 2) return;
                break;
            case 2:
                if (this.snakeDirection === 1) return;
                break;
            case 3:
                if (this.snakeDirection === 4) return;
                break;
            case 4:
                if (this.snakeDirection === 3) return;
                break;
        }
        this.snakeDirection = arrow;
    }
    // 根据方向移动蛇
    moveSnake() {
        let old_snake = this.snakeArray.slice();
        switch (this.snakeDirection) {
            case 0:
                return;
            case 1:
                this.snakeArray.unshift({
                    x: old_snake[0].x,
                    y: old_snake[0].y - 1,
                });
                break;
            case 2:
                this.snakeArray.unshift({
                    x: old_snake[0].x,
                    y: old_snake[0].y + 1,
                });
                break;
            case 3:
                this.snakeArray.unshift({
                    x: old_snake[0].x - 1,
                    y: old_snake[0].y,
                });
                break;
            case 4:
                this.snakeArray.unshift({
                    x: old_snake[0].x + 1,
                    y: old_snake[0].y,
                });
                break;
        }
        this.snakeArray.pop();
    }
    // 更新蛇位置
    updateSnake() {
        console.log('update snake');
        // 如果蛇数组长度大于实际长度，补全
        if (this.snake.numChildren !== this.snakeArray.length) {
            let left_count = this.snakeArray.length - this.snake.numChildren;
            for (let i = 0; i < left_count; i++) {
                this.snake.addChild(new SnakeBody());
            }
        }
        for (let i = 0; i < this.snakeArray.length; i++) {
            let body = this.snake.getChildAt(i);
            body.x = this.snakeArray[i].x * this.SpriteWidth;
            body.y = this.snakeArray[i].y * this.SpriteHeight;
        }
    }
    // 检查游戏是否结束
    checkGameEnd() {
        // 蛇头
        let x, y;
        x = this.snakeArray[0].x;
        y = this.snakeArray[0].y;
        let is_hit = false;
        // 检查是否与蛇身碰撞
        if (!is_hit) {
            for (let i = 1; i < this.snakeArray.length; i++) {
                if (x == this.snakeArray[i].x && y == this.snakeArray[i].y) {
                    is_hit = true;
                    break;
                }
            }
        }
        // 检查是否与墙碰撞
        if (!is_hit) {
            for (let i = 0; i < this.bg_border.length; i++) {
                if (x == this.bg_border[i].x && y == this.bg_border[i].y) {
                    is_hit = true;
                    break;
                }
            }
        }
        if (is_hit) {
            this.timer.stop();
            console.log('游戏结束');
        }
    }
    public static Instance: Main;
    public testInput() {
        console.log(this.bg_border);
    }
}
