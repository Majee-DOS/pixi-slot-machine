import { Application, Sprite, Container, Graphics, TextStyle, Text, Assets, Texture } from 'pixi.js'
import { BlurFilter } from "pixi.js"; //, ParticleContainer, Texture
//import * as particleSettings from "./emitter.json";
//import { Emitter } from "pixi-particles";
//import particles from 'pixi-particles';
//import PIXI from 'pixi.js';
//import { Scene } from "../scenes/Scene";
import { TweenScene } from "../scenes/TweenScene";
import { TickerScene } from "../scenes/TickerScene";
import { LoaderScene } from "../scenes/LoaderScene";


const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1200,
	height: 800
});

const sceneLoader : LoaderScene = new LoaderScene(app.screen.width, app.screen.height);
app.stage.addChild(sceneLoader);

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

const sceneTick: TickerScene = new TickerScene(app.screen.width, app.screen.height);
app.stage.addChild(sceneTick);

const sceneTween: TweenScene = new TweenScene(app.screen.width, app.screen.height);
app.stage.addChild(sceneTween);

//const mar: Sprite = Sprite.from("mario coin");


//const mario = Assets.get("mario coin");
// const mar: Sprite = Sprite.from(mario); // Adjust this line to match your actual code
// mar.x = 100;
// mar.y = 100;
// app.stage.addChild(mar);

// LoaderScene.emitter.on('loaded', () => {
// 	const mar: Sprite = Sprite.from('mario coin');
// 	mar.x = 100;
// 	mar.y = 100;
// 	app.stage.addChild(mar);
// });


Assets.load("mario coin").then(lol => {
	const superSprite = Sprite.from(lol);
	superSprite.x = 100;
	superSprite.y = 100;
	superSprite.scale.set(0.5);
	app.stage.addChild(superSprite);
})

const REEL_WIDTH = 150;
const SYMBOL_SIZE = 150;
const NUM_REELS = 5;

LoaderScene.emitter.on('loaded', () => {
	onAssetsLoaded();
});

function createSlotTextures() {
  return [
    Texture.from("zero"),
    Texture.from("one"),
    Texture.from("two"),
    Texture.from("three"),
    Texture.from("four"),
    Texture.from("five"),
    Texture.from("six"),
  ];
}

function createReelContainer(i: number) {
  const rc = new Container();
  rc.x = i * REEL_WIDTH;
  return rc;
}

function createReel(rc: Container, reelStrip: number[]) {
  return {
    container: rc,
    strip: reelStrip,
    symbols: [] as Sprite[], 
    position: 0,
    previousPosition: 0,
  };
}

function createAndScaleSymbol(slotTextures: Texture[], textureIndex: number) {
  const symbol = new Sprite(slotTextures[textureIndex]);
  symbol.scale.x = symbol.scale.y =
    Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height) * 0.95;
  symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
  return symbol;
}

// onAssetsLoaded handler builds the slot machine
function onAssetsLoaded() {
  const slotTextures = createSlotTextures();

  const reelStrips = [
    [5, 4, 1, 3, 3, 5, 4, 0, 4, 3],
    [5, 5, 1, 4, 2, 0, 2, 3, 5, 5, 3, 1, 2, 4, 0],
    [3, 6, 4, 5, 2, 5, 5, 6],
    [3, 5, 4, 6, 2, 5, 2, 6, 1, 0],
    [1, 1, 6, 4, 1, 3, 2, 0, 3, 3],
  ];
  
  const reels = [];
  const reelContainer = new Container();
  
  for (let i = 0; i < NUM_REELS; i++) {
    const rc = createReelContainer(i);
    reelContainer.addChild(rc);

    const reel = createReel(rc, reelStrips[i]);
    
    for (let j = 0; j < reel.strip.length; j++) {
      const texturesIndex = reel.strip[j];
      const symbol = createAndScaleSymbol(slotTextures, texturesIndex);
      symbol.y = j * SYMBOL_SIZE;
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);
}