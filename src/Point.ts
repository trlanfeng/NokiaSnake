class Point extends egret.Sprite {
    private grid_x;
    private grid_y;
    private grid_arr;
    // x,y 为网格位置，非像素位置
    constructor(x: number, y: number) {
        super();
        this.grid_x = x;
        this.grid_y = y;
        this.grid_arr.push({
            x: x - 1, y
        });
        this.grid_arr.push({
            x: x + 1, y
        });
        this.grid_arr.push({
            x, y: y - 1
        });
        this.grid_arr.push({
            x, y: y + 1
        });
        for (let i = 0; i < this.grid_arr.length; i++) {
            let p = new Pixel();
            p.x = this.grid_arr[i].x;
            p.y = this.grid_arr[i].y;
            this.addChild(p);
        }
    }
}