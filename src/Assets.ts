import type { ResolverManifest } from 'pixi.js';

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: 'slotBundle',
            assets:
            {
                'mario coin' : 'mario.png',
                'camo': 'camo.png',
                'background': 'background.jpg',
                'zero': 'zero.png',
                'one': 'one.png',
                'two': 'two.png',
                'three': 'three.png',
                'four': 'four.png',
                'five': 'five.png',
                'six': 'six.png',
            }
        },
        {
            name: 'soundBundle',
            assets:
            {
                'backgroundMusic': 'background music.mp3',
            }
        }
    ]
}