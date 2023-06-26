import { Application, Sprite, Container, Graphics, TextStyle, Text } from 'pixi.js'
import { BlurFilter } from "pixi.js"; //, ParticleContainer, Texture
//import * as particleSettings from "./emitter.json";
//import { Emitter } from "pixi-particles";
//import particles from 'pixi-particles';
//import PIXI from 'pixi.js';
//import { Scene } from "../scenes/Scene";
import { TweenScene } from "../scenes/TweenScene";


const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1200,
	height: 800
});

const conty: Container = new Container();
conty.x = 200;
conty.y = 0;
app.stage.addChild(conty);

const containerRight: Container = new Container();
containerRight.x = 200;
containerRight.y = 100;
conty.addChild(containerRight);

const clampy: Sprite = Sprite.from("clampy.png");
clampy.x = 100;
clampy.y = 100;
containerRight.addChild(clampy);

const clampy2: Sprite = Sprite.from("clampy.png");
clampy2.x = 100;
clampy2.y = 50;
clampy.addChild(clampy2);

const cat: Sprite = Sprite.from("cat.png");
cat.x = 100;
cat.y = 100;
app.stage.addChild(cat);

cat.anchor._x = 0.5;
cat.anchor._y = 0.5;
cat.rotation = 3.14;
cat.tint = 0x00FF00;

const graphy: Graphics = new Graphics();

// we give instructions in order. begin fill, line style, draw circle, end filling
graphy.beginFill(0x12B5F1);
graphy.lineStyle(5, 0xF14612);
graphy.drawCircle(0, 0, 25); // See how I set the drawing at 0,0? NOT AT 100, 100!
graphy.endFill();

conty.addChild(graphy); //I can add it before setting position, nothing bad will happen.

// Here we set it at 100,100
graphy.x = 180;
graphy.y = 180;

const styly: TextStyle = new TextStyle({
    align: "center",
    fill: "#754c24",
    fontSize: 42
});
const texty: Text = new Text('私に気づいて先輩！', styly); // Text supports unicode!
//texty.text = "This is expensive to change, please do not abuse";

app.stage.addChild(texty);
texty.x = 100;
texty.y = 50;

// Make your filter
const myBlurFilter = new BlurFilter();

// Add it to the `.filters` array of any DisplayObject
clampy.filters = [myBlurFilter];

//Make it rain PArticles
/*
const particleContainer = new ParticleContainer();
app.stage.addChild(particleContainer);

const emitter: particles.Emitter = new particles.Emitter(particleContainer, Texture.from("mario.png"), particleSettings);
emitter.autoUpdate = true; // If you keep it false, you have to update your particles yourself.
emitter.updateSpawnPos(200, 100);
emitter.emit = true;
*/

// const sceny: Scene = new Scene(app.screen.width, app.screen.height);
// app.stage.addChild(sceny);

const sceneTween: TweenScene = new TweenScene(app.screen.width, app.screen.height);
app.stage.addChild(sceneTween);