class SnakeBody extends egret.Sprite {

    // private spriteWidth = 3;
    // private spriteHeight = 4;
    private grid_arr: Object[];
    private dir;
    private grid_x;
    private grid_y;

    constructor(dir: number, x: number, y: number) {
        super();
        this.dir = dir;
        this.grid_x = x;
        this.grid_y = y;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                this.grid_arr.push({
                    x: x + i,
                    y: y + i,
                });
            }
        }
        switch (dir) {
            case 1:
                // 上
                for (let i = -1; i < 2; i++) {
                    this.grid_arr.push({
                        x: x + i,
                        y: y + 2,
                    })
                }
                break;
            case 2:
                // 下
                for (let i = -1; i < 2; i++) {
                    this.grid_arr.push({
                        x: x + i,
                        y: y - 2,
                    })
                }
                break;
            case 3:
                // 左
                for (let i = -1; i < 2; i++) {
                    this.grid_arr.push({
                        x: x + 2,
                        y: y + i,
                    })
                }
                break;
            case 4:
                // 右
                for (let i = -1; i < 2; i++) {
                    this.grid_arr.push({
                        x: x - 2,
                        y: y + i,
                    })
                }
                break;
        }
        // this.texture = RES.getRes('snake_png');
    }
}