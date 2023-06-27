import { Application, Sprite, Container, Texture } from 'pixi.js'
//import * as particleSettings from "./emitter.json";
//import { Emitter } from "pixi-particles";
//import particles from 'pixi-particles';
//import PIXI from 'pixi.js';
//import { Scene } from "../scenes/Scene";
import { TweenScene } from "../scenes/TweenScene";
// import { TickerScene } from "../scenes/TickerScene";
import { LoaderScene } from "../scenes/LoaderScene";


const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1200,
	height: 800
});

const sceneTween: TweenScene = new TweenScene(app.screen.width, app.screen.height);
app.stage.addChild(sceneTween);

const sceneLoader : LoaderScene = new LoaderScene(app.screen.width, app.screen.height);
app.stage.addChild(sceneLoader);

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