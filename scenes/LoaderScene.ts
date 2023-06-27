import { Container, Graphics, Assets } from "pixi.js";
import { manifest } from "../src/Assets";
import { EventEmitter } from "events";

export class LoaderScene extends Container {

    // for making our loader graphics...
    public static emitter = new EventEmitter(); // Declare the EventEmitter
    private loaderBar: Container;
    private loaderBarBoder: Graphics;
    private loaderBarFill: Graphics;
    constructor(screenWidth: number, screenHeight: number) {
        super();

        // lets make a loader graphic:
        const loaderBarWidth = screenWidth * 0.8; // just an auxiliar variable
        // the fill of the bar.
        this.loaderBarFill = new Graphics();
        this.loaderBarFill.beginFill(0x008800, 1)
        this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 50);
        this.loaderBarFill.endFill();
        this.loaderBarFill.scale.x = 0; // we draw the filled bar and with scale we set the %

        // The border of the bar.
        this.loaderBarBoder = new Graphics();
        this.loaderBarBoder.lineStyle(10, 0x0, 1);
        this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 50);

        // Now we keep the border and the fill in a container so we can move them together.
        this.loaderBar = new Container();
        this.loaderBar.addChild(this.loaderBarFill);
        this.loaderBar.addChild(this.loaderBarBoder);
        //Looks complex but this just centers the bar on screen.
        this.loaderBar.position.x = (screenWidth - this.loaderBar.width) / 2;
        this.loaderBar.position.y = (screenHeight - this.loaderBar.height) / 2;
        this.addChild(this.loaderBar);

        // Start loading!
        this.initializeLoader().then(() => {
            // Remember that constructors can't be async, so we are forced to use .then(...) here!
            this.gameLoaded();
        })
    }

    private async initializeLoader(): Promise<void> {
        await Assets.init({ manifest: manifest });

        const bundleIds = manifest.bundles.map(bundle => bundle.name);

        // The second parameter for `loadBundle` is a function that reports the download progress!
        await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
    }

    private downloadProgress(progressRatio: number): void {
        // progressRatio goes from 0 to 1, so set it to scale
        this.loaderBarFill.scale.x = progressRatio;
    }

    private gameLoaded(): void {
        // Our game finished loading!

        // Let's remove our loading bar
        this.removeChild(this.loaderBar);

        // all your assets are ready! I would probably change to another scene
        // ...but you could build your entire game here if you want
        // (pls don't)

        LoaderScene.emitter.emit('loaded');
        // const mar: Sprite = Sprite.from('mario coin'); // Adjust this line to match your actual code
        // mar.x = 100;
        // mar.y = 100;
        // this.addChild(mar);
    }
}