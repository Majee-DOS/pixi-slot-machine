import { Tween, Group } from "tweedle.js";
import { Container, Sprite, Ticker, Point } from "pixi.js";

export class TweenScene extends Container {
    private clampy: Sprite;
    private screenWidth: number;
    private screenHeight: number;
    private tween: Tween<Point>;
    private startButton: Sprite;

    constructor(screenWidth: number, screenHeight: number) {
        super();
        
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        
        this.clampy = Sprite.from("clampy.png");

        this.clampy.anchor.set(0.5);
        this.clampy.x = this.screenWidth / 2;
        this.clampy.y = 0;
        this.addChild(this.clampy);

        Ticker.shared.add(this.update, this);

        this.tween = new Tween<Point>(this.clampy.position).to({ x: this.screenWidth / 2, y: this.screenHeight }, 800).repeat(Infinity).start();
        
        // add button
        this.startButton = Sprite.from("startButton.png");
        this.startButton.scale.set(0.25);
        this.startButton.position.set(0, 0);
        this.addChild(this.startButton);

        // Make the sprite interactive
        this.startButton.interactive = true;

        // Add a pointerdown event to stop the tween on click
        this.startButton.on("pointerdown", () => {
            this.tween.stop();
        });

    }

    private update(): void {
        Group.shared.update();
    }
}
