class Main extends eui.UILayer {

    // 模拟像素点数量
    public static MapWidth = 81;
    public static MapHeight = 71;
    // 每个模拟像素点的宽高
    public static PixelWidth = 5;
    public static PixelHeight = 6;
    // UI设计像素
    public static DesignWidth = 1080;
    public static DesignHeight = 1920;
    // 游戏区域格子
    public static GridColumn = 20;
    public static GridRow = 11;
    // 点宽高
    public static PointWidth = Main.PixelWidth * 3;
    public static PointHeight = Main.PixelHeight * 3;

    // 蛇移动速度
    private SnakeSpeed = 5;
    // 蛇身数组
    private snakeArray = [];
    private snakeDirection = 0;
    private snakeDefaultLength = 5;
    // 纵向偏移量
    private OffsetY = 0;
    // 点位
    private PointGridPosition;
    private point: Point;
    private snake: egret.Sprite;
    private bg_border = [];
    // 游戏容器（带边框）
    private GameContainer: egret.Sprite;
    // 游戏区域，移动区域
    private GameArea: egret.Sprite;
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
        this.GameContainer = new egret.Sprite();
        this.GameArea = new egret.Sprite();
        this.snake = new egret.Sprite();
        this.point = new Point();

        this.GameContainer.addChild(this.GameArea);
        this.GameArea.x = 3 * Main.PixelWidth;
        this.GameArea.y = 3 * Main.PixelHeight;
        this.GameArea.width = Main.MapWidth * Main.PixelWidth;
        this.GameArea.height = Main.MapHeight * Main.PixelHeight;


        this.GameArea.addChild(this.snake);
        this.GameArea.addChild(this.point);

        this.timer = new egret.Timer(1000, 0);
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
        this.GameContainer.width = (Main.MapWidth + 2) * Main.PixelWidth;
        this.GameContainer.height = (Main.MapHeight + 2) * Main.PixelHeight;
        this.GameContainer.x = Math.round((Main.DesignWidth - this.GameContainer.width) / 2);
        this.GameContainer.y = 450 + this.OffsetY;
        this.stage.addChild(this.GameContainer);
    }
    // 创建地图
    createMap() {
        for (let i = 0; i < (Main.MapWidth + 2) * Main.MapHeight; i++) {
            if (i < (Main.MapWidth + 2)) {
                this.createWall(i);
            } else if (i > (Main.MapWidth + 2) * (Main.MapHeight - 1) && i < (Main.MapWidth + 2) * Main.MapHeight) {
                this.createWall(i);
            } else {
                if (i % (Main.MapWidth + 2) == 0) {
                    this.createWall(i);
                }
                if (i % (Main.MapWidth + 2) == ((Main.MapWidth + 2) - 1)) {
                    this.createWall(i);
                }
            }
        }
    }
    // 创建具体墙
    createWall(index) {
        let pos_x = index % (Main.MapWidth + 2);
        let x = pos_x * Main.PixelWidth;
        let pos_y = Math.floor(index / (Main.MapWidth + 2));
        let y = pos_y * Main.PixelHeight;
        let wall = new Pixel();
        wall.x = x;
        wall.y = y;
        this.GameContainer.addChild(wall);
        this.bg_border.push({ x: pos_x, y: pos_y });
    }
    // 创建点
    createPoint() {
        this.point = new Point();
        this.PointGridPosition = this.generatePointIndex();
        // this.setPointPosition(this.pointPosition.x, this.pointPosition.y);
        this.setPointPosition(19, 9);
    }
    setPointPosition(grid_x, grid_y) {
        this.point.x = grid_x * (Main.PointWidth + Main.PixelWidth);
        this.point.y = grid_y * (Main.PointHeight + Main.PixelHeight);
    }
    // 生成点位，并检测是否重叠
    generatePointIndex() {
        let x, y;
        let is_hit = false;
        do {
            is_hit = false;
            x = Math.floor(Math.random() * Main.GridColumn);
            y = Math.floor(Math.random() * Main.GridRow);
            for (let i = 0; i < this.snakeArray.length; i++) {
                if (x == this.snakeArray[i].x && y == this.snakeArray[i].y) {
                    is_hit = true;
                    break;
                }
            }
        } while (is_hit)
        return { x, y };
    }
    // 创建蛇，默认5节:snakeDefaultLength
    createSnake() {
        // body
        for (let i = 0; i < this.snakeDefaultLength; i++) {
            this.snakeArray.push({
                x: Math.floor(Main.GridColumn / 2 - i),
                y: Math.floor(Main.GridRow / 2),
                dir: 4,
            });
        }
        this.snakeArray[this.snakeArray.length - 1].dir = 0;
        for (let i = 0; i < this.snakeArray.length; i++) {
            let x = this.snakeArray[i].x * Main.PointWidth + this.snakeArray[i].x * Main.PixelWidth - 1;
            let y = this.snakeArray[i].y * Main.PointHeight + this.snakeArray[i].y * Main.PixelHeight - 1;
            let body = new SnakeBody(this.snakeArray[i].dir);
            body.x = x;
            body.y = y;
            this.snake.addChild(body);
        }
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
                    dir: 1,
                });
                break;
            case 2:
                this.snakeArray.unshift({
                    x: old_snake[0].x,
                    y: old_snake[0].y + 1,
                    dir: 2,
                });
                break;
            case 3:
                this.snakeArray.unshift({
                    x: old_snake[0].x - 1,
                    y: old_snake[0].y,
                    dir: 3,
                });
                break;
            case 4:
                this.snakeArray.unshift({
                    x: old_snake[0].x + 1,
                    y: old_snake[0].y,
                    dir: 4,
                });
                break;
        }
        this.snakeArray.pop();
        this.snakeArray[this.snakeArray.length - 1].dir = 0;
    }
    // 更新蛇位置
    updateSnake() {
        // // 如果蛇数组长度大于实际长度，补全
        // if (this.snake.numChildren !== this.snakeArray.length) {
        //     for (let i = this.snake.numChildren; i < this.snakeArray.length; i++) {
        //         this.snake.addChild(new SnakeBody(this.snakeArray[i].dir));
        //     }
        // }
        // for (let i = 0; i < this.snakeArray.length; i++) {
        //     let body: SnakeBody = this.snake.getChildAt(i) as SnakeBody;
        //     body.x = this.snakeArray[i].x * Main.PointWidth + this.snakeArray[i].x * Main.PixelWidth - 1;
        //     body.y = this.snakeArray[i].y * Main.PointHeight + this.snakeArray[i].y * Main.PixelHeight - 1;
        //     body.changeDir(this.snakeArray[i].dir);
        // }
        this.snake.removeChildren();
        for (let i = 0; i < this.snakeArray.length; i++) {
            let body = new SnakeBody(this.snakeArray[i].dir);
            body.x = this.snakeArray[i].x * Main.PointWidth + this.snakeArray[i].x * Main.PixelWidth - 1;
            body.y = this.snakeArray[i].y * Main.PointHeight + this.snakeArray[i].y * Main.PixelHeight - 1;
            this.snake.addChild(body);
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
        // // 检查是否与墙碰撞
        // if (!is_hit) {
        //     for (let i = 0; i < this.bg_border.length; i++) {
        //         if (x == this.bg_border[i].x && y == this.bg_border[i].y) {
        //             is_hit = true;
        //             break;
        //         }
        //     }
        // }
        if (!is_hit) {
            if (this.snakeArray[0].x < 0 || this.snakeArray[0].y < 0 || this.snakeArray[0].x >= Main.GridColumn || this.snakeArray[0].y >= Main.GridRow) {
                is_hit = true;
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
