import { Container } from "pixi.js";
import { Sound, sound } from '@pixi/sound';

export class SoundScene extends Container {
    constructor(screenWidth: number, screenHeight: number) {
        super();

        const backgroundMusic: Sound = Sound.from('backgroundMusic');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.2;
        backgroundMusic.play();
    }
}
