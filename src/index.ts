import { Application, Sprite, Container, Texture, Ticker } from 'pixi.js'
import { TweenScene } from "../scenes/TweenScene";
import { LoaderScene } from "../scenes/LoaderScene";
import { Tween, Group } from 'tweedle.js'


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
interface Reel {
	container: Container;
	strip: number[];
	symbols: Sprite[];
	position: number;
	previousPosition?: number;
  }

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

function update(): void {
	Group.shared.update();
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
  
  const reels: Reel[] = [];
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


  let running = false;

  // Function to start playing
  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2000 + i * 250;
      new Tween(r)
        .to({ position: target }, time)
        .onComplete(() => {
          if (i === reels.length - 1) {
            running = false;
			update();
          }
        })
        .start();
    }
  }

  startPlay();

  Ticker.shared.add(() => {
    update();
    //app.ticker.update(); // Add this line to update the ticker
  });

  const button: Sprite = new Sprite(Texture.from("startButton.png"));
  button.scale.set(0.25);
  button.position.set(500, 0);
  app.stage.addChild(button);

  button.interactive = true;
  button.on("pointerdown", () => {
	startPlay();
	console.log("play");
});



}

