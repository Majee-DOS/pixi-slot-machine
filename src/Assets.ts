import type { ResolverManifest } from 'pixi.js';

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: 'slotBundle',
            assets:
            {
                'mario coin' : 'mario.png',
                'camo': 'camo.png',
            }
        },
    ]
}