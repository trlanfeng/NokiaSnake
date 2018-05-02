var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.SnakeSpeed = 1;
        _this.MapWidth = 26;
        _this.MapHeight = 15;
        _this.SpriteWidth = 8;
        _this.SpriteHeight = 8;
        _this.snake = [];
        _this.point = { x: 0, y: 0 };
        _this.snakeDirection = 0;
        _this.bg_border = [];
        return _this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        this.stage.width = this.MapWidth * this.SpriteWidth;
        this.stage.height = this.MapHeight * this.SpriteHeight;
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 加载资源
                    return [4 /*yield*/, this.loadResource()
                        // 创建地图
                    ];
                    case 1:
                        // 加载资源
                        _a.sent();
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
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 创建地图
    Main.prototype.createMap = function () {
        for (var i = 0; i < this.MapWidth * this.MapHeight; i++) {
            if (i < this.MapWidth) {
                this.bg_border.push(i);
            }
            else if (i > this.MapWidth * (this.MapHeight - 1) && i < this.MapWidth * this.MapHeight) {
                this.bg_border.push(i);
            }
            else {
                if (i % this.MapWidth == 0) {
                    this.bg_border.push(i);
                }
                if (i % this.MapWidth == (this.MapWidth - 1)) {
                    this.bg_border.push(i);
                }
            }
        }
    };
    // 渲染地图
    Main.prototype.renderMap = function () {
        var bg = new egret.Sprite();
        bg.graphics.beginFill(0xffffff);
        bg.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
        bg.graphics.endFill();
        for (var i = 0; i < this.bg_border.length; i++) {
            var x = this.bg_border[i] % this.MapWidth * this.SpriteHeight;
            var y = Math.floor(this.bg_border[i] / this.MapWidth) * this.SpriteHeight;
            var wall = new Wall();
            wall.x = x;
            wall.y = y;
            this.stage.addChild(wall);
        }
    };
    // 渲染按钮
    Main.prototype.renderInput = function () {
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
    };
    // 创建蛇，5节
    Main.prototype.createSnake = function () {
        // head
        this.snake.push({
            x: Math.floor(this.MapWidth / 2),
            y: Math.floor(this.MapHeight / 2),
        });
        // body
        for (var i = 1; i < 5; i++) {
            this.snake.push({
                x: Math.floor(this.MapWidth / 2 - i),
                y: Math.floor(this.MapHeight / 2),
            });
        }
    };
    // 创建点
    Main.prototype.createPoint = function () {
        var is_hit = false;
        this.point = new Point();
        // 生成点位，并检测是否重叠
        do {
            this.point = this.generatePointIndex();
            for (var i = 0; i < this.snake.length; i++) {
                if (this.point.x == this.snake[i].x && this.point.y == this.snake[i].y) {
                    is_hit = true;
                }
            }
        } while (is_hit);
    };
    // 渲染点
    Main.prototype.renderPoint = function () {
        var x = this.point.x * this.SpriteWidth;
        var y = this.point.y * this.SpriteHeight;
        var point = new Point();
        point.x = x;
        point.y = y;
        this.stage.addChild(point);
    };
    // 生成点位
    Main.prototype.generatePointIndex = function () {
        var x = (Math.floor(Math.random() * (this.MapWidth - 2)) + 1);
        var y = (Math.floor(Math.random() * (this.MapHeight - 2)) + 1);
        return { x: x, y: y };
    };
    // 根据方向移动蛇
    Main.prototype.moveSnake = function () {
        var old_snake = this.snake.slice();
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
    };
    // 渲染蛇
    Main.prototype.renderSnake = function () {
        for (var i = 0; i < this.snake.length; i++) {
            var x = this.snake[i].x * this.SpriteWidth;
            var y = this.snake[i].y * this.SpriteHeight;
            var snake = new Snake();
            snake.x = x;
            snake.y = y;
            this.stage.addChild(snake);
        }
    };
    // 清理canvas用于重绘
    Main.prototype.clearCanvas = function () {
        var x = this.SpriteWidth;
        var y = this.SpriteHeight;
        var width = (this.MapWidth - 2) * this.SpriteWidth;
        var height = (this.MapHeight - 2) * this.SpriteHeight;
        // ctx.fillStyle = 'white';
        // ctx.fillRect(x, y, width, height);
    };
    // 渲染
    Main.prototype.render = function () {
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
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map