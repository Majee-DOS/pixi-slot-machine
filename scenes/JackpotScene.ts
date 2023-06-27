import { Tween, Group } from "tweedle.js";
import { Container, Sprite, Ticker, Point } from "pixi.js";

export class JackpotScene extends Container {
    private mario: Sprite;
    private screenWidth: number;
    private screenHeight: number;

    constructor(screenWidth: number, screenHeight: number) {
        super();
        
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        
        this.mario = Sprite.from("mario.png");

        this.mario.anchor.set(0.5);
        this.mario.x = this.screenWidth / 2;
        this.mario.y = 0;
        this.mario.scale.set(0.25);
        this.addChild(this.mario);

        Ticker.shared.add(this.update, this);

        new Tween<Point>(this.mario.position).to({ x: this.screenWidth / 2, y: this.screenHeight }, 800).repeat(Infinity).start();
    }

    private update(): void {
        Group.shared.update();
    }
}
