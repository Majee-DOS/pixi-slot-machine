import { Application, Sprite, Container, Texture, Graphics } from 'pixi.js'
//import { TweenScene } from "../scenes/TweenScene";
import { LoaderScene } from "../scenes/LoaderScene";
import TWEEN from "@tweenjs/tween.js";
import { sound } from "@pixi/sound";
import { JackpotScene } from "../scenes/JackpotScene";

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x6495ed,
  width: window.innerWidth,
  height: window.innerHeight,
});

//const sceneTween: TweenScene = new TweenScene(app.screen.width, app.screen.height);
//app.stage.addChild(sceneTween);

const sceneLoader: LoaderScene = new LoaderScene(app.screen.width, app.screen.height);
app.stage.addChild(sceneLoader);

const sceneJackpot: JackpotScene = new JackpotScene(app.screen.width, app.screen.height);

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
  //rc.x = (app.screen.width - (NUM_REELS * REEL_WIDTH)) / 2 + i * REEL_WIDTH;
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
  sound.play("backgroundMusic");
  sound.volume("backgroundMusic", 0.2);

  const backgroundTexture = Texture.from('background');

  // Create a sprite with the backgroundtexture and set it as the background
  const background = new Sprite(backgroundTexture);
  background.width = app.screen.width;
  background.height = app.screen.height;
  app.stage.addChild(background);

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
      new TWEEN.Tween(r)
        .to({ position: target }, time)
        .onComplete(() => {
          if (i === reels.length - 1) {
            running = false;
            logFinalState(reels);
            //matrixFinalState(reels);
            const matrix = matrixFinalState(reels);
            const winningSpin = hasConsecutiveNums(matrix);
            console.log(winningSpin);
            if (winningSpin) {
              sound.play("jackpot");
              sound.volume("jackpot", 0.4);
              console.log("YOU WON!");
              app.stage.addChild(sceneJackpot);
              setTimeout(() => {
                app.stage.removeChild(sceneJackpot);
              }, 2000);
            }
          }
        })
        .start();
    }
  }

  // Listen for animate update
  app.ticker.add(() => {
    // Update the slots
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      r.previousPosition = r.position;
      // Update symbol positions on reel
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
      }
    }
    // Update tweens group
    TWEEN.update();
  });

  startPlay();

  const button: Sprite = new Sprite(Texture.from("startButton.png"));
  button.scale.set(0.25);
  button.anchor.set(0.5, 0);
  button.position.set(app.screen.width / 2, 0);
  //app.stage.addChild(button);

  button.interactive = true;
  button.on("pointerdown", () => {
    const buttonTween = new TWEEN.Tween(button.scale).to({ x: 0.20, y: 0.20 }, 200).start();
    buttonTween.onComplete(() => {
      new TWEEN.Tween(button.scale).to({ x: 0.25, y: 0.25 }, 200).start();
    })
    startPlay();
    console.log("play");
  });


  // Build top and bottom covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 4) / 2;
  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5) / 2;

  const top = new Graphics();
  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin - 5);

  const bottom = new Graphics();
  bottom.beginFill(0, 1);
  bottom.drawRect(
    0,
    SYMBOL_SIZE * 4 + margin - 5,
    app.screen.width,
    margin + 5
  );

  app.stage.addChild(top);
  app.stage.addChild(bottom);
  top.addChild(button);


  function logFinalState(reels: Reel[]) {
    const bufferSymbols = Math.floor((app.screen.height - SYMBOL_SIZE * 4) / (2 * SYMBOL_SIZE));

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const symbolsToLog: { symbol: Sprite, position: number }[] = [];

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const position = ((r.position + j + bufferSymbols) % r.symbols.length);

        // Store the symbols that are within the visible area, pushed down by one
        if (position >= 1 && position < 5) {
          symbolsToLog.push({ symbol: s, position: position });
        }
      }

      // Sort the symbols by their position and log them
      console.log(`Reel ${i + 1}:`);
      symbolsToLog.sort((a, b) => a.position - b.position).forEach(({ symbol, position }) => {
        console.log(`  Symbol ${position + 1}: ${symbol.texture.textureCacheIds}`);
      });
    }
  }

  function matrixFinalState(reels: Reel[]) {
    const bufferSymbols = Math.floor((app.screen.height - SYMBOL_SIZE * 4) / (2 * SYMBOL_SIZE));
    let matrix: number[][] = [];

    // Create a map of symbol names to their corresponding numerical values
    const symbolValueMap = {
      'zero': 0,
      'one': 1,
      'two': 2,
      'three': 3,
      'four': 4,
      'five': 5,
      'six': 6
    };

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const symbolsToLog: { symbol: Sprite, position: number }[] = [];
      let column: number[] = [];

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const position = ((r.position + j + bufferSymbols) % r.symbols.length);

        // Store the symbols that are within the visible area, pushed down by one
        if (position >= 1 && position < 5) {
          symbolsToLog.push({ symbol: s, position: position });
        }
      }

      // Sort the symbols by their position and store them in column
      symbolsToLog.sort((a, b) => a.position - b.position).forEach(({ symbol }) => {
        // Extract the number from textureCacheIds and convert it to a number
        const numStr = symbol.texture.textureCacheIds[1].split('.')[0]; // "zero.png" -> "zero"
        const num = symbolValueMap[numStr as keyof typeof symbolValueMap];
        column.push(num);
      });

      matrix.push(column); // Add the column to the matrix
    }

    console.table(matrix); // Log the matrix as a table
    return matrix;
  }


  function hasConsecutiveNums(matrix: number[][]): boolean {
    const n = matrix.length;
    const m = matrix[0].length;

    // Check rows for consecutive numbers
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m - 2; j++) {
        if (matrix[i][j] === matrix[i][j + 1] && matrix[i][j + 1] === matrix[i][j + 2]) {
          return true;
        }
      }
    }

    // Check columns for consecutive numbers
    for (let j = 0; j < m; j++) {
      for (let i = 0; i < n - 2; i++) {
        if (matrix[i][j] === matrix[i + 1][j] && matrix[i + 1][j] === matrix[i + 2][j]) {
          return true;
        }
      }
    }

    // If no consecutive numbers found, return false
    return false;
  }

}