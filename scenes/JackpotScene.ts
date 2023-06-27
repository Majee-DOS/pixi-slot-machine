import { Tween, Group } from "tweedle.js";
import { Container, Sprite, Ticker, Point } from "pixi.js";

export class JackpotScene extends Container {
    private marios: Sprite[] = [];
    private screenWidth: number;
    private screenHeight: number;

    constructor(screenWidth: number, screenHeight: number) {
        super();
        
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        
        for (let i = 0; i < 12; i++) {
            let mario = Sprite.from("mario.png");

            mario.anchor.set(0.5);
            mario.x = Math.random() * this.screenWidth; // Random x position
            mario.y = 0 - ( Math.random() * this.screenHeight );
            mario.scale.set(0.25);
            this.addChild(mario);
            
            this.marios.push(mario);
            
            new Tween<Point>(mario.position).to({ x: mario.x, y: this.screenHeight }, (Math.random() * 1500)).repeat(Infinity).start();
        }

        Ticker.shared.add(this.update, this);
    }

    private update(): void {
        Group.shared.update();
    }
}
