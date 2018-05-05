class SnakeBody extends egret.Sprite {

    private grid_arr = [];
    private dir;

    constructor(dir: number) {
        super();
        this.dir = dir;
        this.create();
    }

    changeDir(dir: number) {
        this.dir = dir;
        this.create();
    }

    create() {
        this.removeChildren();
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                this.grid_arr.push({
                    x: i,
                    y: j,
                });
            }
        }
        switch (this.dir) {
            case 1:
                // 上
                for (let i = -1; i < 2; i++) {
                    this.grid_arr.push({
                        x: i,
                        y: 2,
                    })
                }
                break;
            case 2:
                // 下
                for (let i = -1; i < 2; i++) {
                    this.grid_arr.push({
                        x: i,
                        y: -2,
                    })
                }
                break;
            case 3:
                // 左
                for (let i = -1; i < 2; i++) {
                    this.grid_arr.push({
                        x: 2,
                        y: i,
                    })
                }
                break;
            case 4:
                // 右
                for (let i = -1; i < 2; i++) {
                    this.grid_arr.push({
                        x: - 2,
                        y: i,
                    })
                }
                break;
        }
        for (let i = 0; i < this.grid_arr.length; i++) {
            let p = new Pixel();
            p.x = this.grid_arr[i].x * Main.PixelWidth;
            p.y = this.grid_arr[i].y * Main.PixelHeight;
            this.addChild(p);
        }
    }
}