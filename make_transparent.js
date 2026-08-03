import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jimpModule = require('jimp');
const Jimp = jimpModule.Jimp || jimpModule.default || jimpModule;

async function makeTransparent() {
    const imagePath = 'C:\\Users\\ACER\\.gemini\\antigravity-cli\\brain\\46240fc8-2d12-418b-89d7-380f81746ee6\\aurora_bb_logo_notext_1785727446173.jpg';
    try {
        const image = await Jimp.read(imagePath);
        
        // Replace near-white pixels with transparent
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            
            if (red > 230 && green > 230 && blue > 230) {
                this.bitmap.data[idx + 3] = 0;
            }
        });
        
        if (typeof image.writeAsync === 'function') {
            await image.writeAsync('public/logo.png');
        } else {
            await image.write('public/logo.png');
        }
        console.log('Successfully created transparent logo!');
    } catch (err) {
        console.error('Error:', err);
    }
}

makeTransparent();
