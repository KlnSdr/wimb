"use strict";
class qrcode {
    static gen(content, headline = '') {
        Details.show('', [
            {
                tag: 'button',
                text: 'herunterladen',
                handler: [
                    {
                        type: 'click',
                        id: 'downloadQr',
                        arguments: '',
                        body: `qrcode.downloadCurrent('${headline}')`,
                    },
                ],
            },
        ], [
            {
                tag: 'div',
                id: 'qrContainer',
            },
        ], () => {
            this.addLable(`https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(content)}&choe=UTF-8&chs=256x256`, headline);
        });
    }
    static addLable(qrSrc, text) {
        var _a;
        // Create an image object.
        let img = new Image();
        img.setAttribute('crossorigin', 'anonymous');
        img.src = qrSrc;
        // Create a canvas object.
        let canvas = document.createElement('canvas');
        canvas.id = 'canvasQRCode';
        (_a = document.getElementById('qrContainer')) === null || _a === void 0 ? void 0 : _a.appendChild(canvas);
        // Wait till the image is loaded.
        img.onload = function () {
            drawImage();
        };
        // Draw the image on the canvas.
        let drawImage = () => {
            let ctx = canvas.getContext('2d'); // Create canvas context.
            // Assign width and height.
            canvas.width = img.width;
            canvas.height = img.height;
            // Draw the image.
            ctx.drawImage(img, 0, 0);
            // Assign text properties to the context.
            const fntSize = 22;
            ctx.font = `${fntSize}px monospace`;
            ctx.fillStyle = 'black';
            // ctx.textAlign = txtAlign;
            const offset = 256 / 2 - (text.length * (fntSize / 1.5)) / 2;
            /*
            // Now, we need the coordinates of the text.
            let x = 0; // coordinate.
            if (txtAlign === 'right') {
                x = right + parseInt(paddingRight) - 11;
            }
            if (txtAlign === 'left') {
                x = left + parseInt(paddingLeft);
            }
            if (txtAlign === 'center') {
                x = center + left;
            }*/
            // finally, draw the text using Canvas fillText() method.
            for (let i = 0; i <= text.length - 1; i++) {
                ctx.fillText(text[i]
                    .replace('</div>', '')
                    .replace('<br>', '')
                    .replace(';', ''), offset + i * (fntSize / 1.5), 40 / 2 + fntSize / 2);
            }
        };
    }
    static downloadCurrent(tasche) {
        let a = document.createElement('a');
        let canvas = document.getElementById('canvasQRCode');
        a.href = canvas.toDataURL();
        a.download = tasche + '.png';
        a.click();
    }
}
