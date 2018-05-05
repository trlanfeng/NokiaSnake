class Point extends egret.Sprite {
    private grid_x;
    private grid_y;
    private grid_arr = [];
    // x,y 为模拟像素位置
    constructor() {
        super();
        let p_up = new Pixel();
        p_up.x = 0;
        p_up.y = -6;
        this.addChild(p_up);
        let p_down = new Pixel();
        p_down.x = 0;
        p_down.y = 6;
        this.addChild(p_down);
        let p_left = new Pixel();
        p_left.x = -6;
        p_left.y = 0;
        this.addChild(p_left);
        let p_right = new Pixel();
        p_right.x = 6;
        p_right.y = 0;
        this.addChild(p_right);
    }
}