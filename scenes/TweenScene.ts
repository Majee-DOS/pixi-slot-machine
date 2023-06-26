import { Tween, Group } from "tweedle.js";
import { Container, Sprite, Ticker } from "pixi.js";

export class TweenScene extends Container {
    private clampy: Sprite;
    constructor(screenWidth: number, screenHeight: number) {
        super();
        
        this.clampy = Sprite.from("clampy.png");

        this.clampy.anchor.set(0.5);
        this.clampy.x = screenWidth / 2;
        this.clampy.y = screenHeight / 2;
        this.addChild(this.clampy);

        Ticker.shared.add(this.update, this);

        new Tween(this.clampy.scale).to({ x: 0.5, y: 0.5 }, 1000).repeat(3).yoyo(true).start();
        new Tween(this.clampy.position).to({ x: screenWidth/2, y: screenHeight }, 1000).repeat(4).yoyo(true).start();
    }

    private update(): void {
        Group.shared.update();
    }
}