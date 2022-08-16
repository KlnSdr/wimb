"use strict";
class Scanner {
    static onScanSuccess(decodedText, decodedResult) {
        const localData = Datahandler.local.get(decodedText);
        Details.show(localData.name, [], [
            {
                tag: 'ul',
                children: localData.contents.map((item) => {
                    return {
                        tag: 'li',
                        text: item,
                    };
                }),
            },
        ], () => {
            Scanner.stopReading();
            // get data from firebase
            Datahandler.remote.get(decodedText).then((remoteData) => {
                var _a, _b;
                console.log(remoteData);
                (_a = edom.findById('modal-headline')) === null || _a === void 0 ? void 0 : _a.setText(remoteData.name);
                (_b = edom.findById('modal-body')) === null || _b === void 0 ? void 0 : _b.clear();
                edom.fromTemplate([
                    {
                        tag: 'ul',
                        children: remoteData.contents.map((item) => {
                            return {
                                tag: 'li',
                                text: item,
                            };
                        }),
                    },
                ], edom.findById('modal-body'));
            });
        }, () => {
            Scanner.initScanner();
        });
    }
    static render() {
        edom.fromTemplate([
            {
                tag: 'div',
                id: 'scannerContainer',
            },
        ], edom.findById('content'));
        this.initScanner();
    }
    static unload() {
        this.stopReading();
    }
    static initScanner() {
        this.reader = new Html5Qrcode('scannerContainer');
        this.reader.start({ facingMode: 'environment' }, this.qrConfig, this.onScanSuccess);
    }
    static stopReading() {
        this.reader
            .stop()
            .then(() => { })
            .catch(() => {
            console.error('could not stop');
        });
    }
}
Scanner.qrConfig = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0,
};
