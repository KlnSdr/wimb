"use strict";
class Scanner {
    static onScanSuccess(decodedText, decodedResult) {
        Scanner.stopReading();
        const localData = Datahandler.local.get(decodedText);
        localData.id = decodedText;
        console.log(localData);
        addBag.bagData = localData;
        Details.show(localData.name, [
            {
                tag: 'button',
                text: 'bearbeiten',
                classes: ['bttnFullWidth'],
                handler: [
                    {
                        type: 'click',
                        id: 'clickEditBag',
                        arguments: '',
                        body: 'addBag.isModify = true; Content.switchContext("addBag"); Details.close(true)',
                    },
                ],
            },
        ], [
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
            // get data from firebase
            Datahandler.remote.get(decodedText).then((remoteData) => {
                var _a, _b;
                remoteData.id = decodedText;
                console.log(remoteData);
                addBag.bagData = remoteData;
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
            console.log('exec onClose');
            Scanner.initScanner();
        });
    }
    static render() {
        console.log('render scanner');
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
        console.log('scanner start');
        // @ts-expect-error no type Html5Qrcode 'cause include via js
        this.reader = new Html5Qrcode('scannerContainer');
        this.reader.start({ facingMode: 'environment' }, this.qrConfig, this.onScanSuccess);
    }
    static stopReading() {
        this.reader
            .stop()
            .then(() => {
            console.log('scanner stopped');
        })
            .catch(() => {
            console.error('could not stop');
        });
    }
}
Scanner.qrConfig = {
    fps: 10,
    qrbox: { width: 256, height: 256 },
    aspectRatio: 1.0,
};
