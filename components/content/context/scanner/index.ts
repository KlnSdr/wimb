class Scanner {
    private static reader: Html5Qrcode | undefined;

    private static qrConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
    };

    private static onScanSuccess(decodedText: string, decodedResult: Object) {
        const localData: obj = Datahandler.local.get(decodedText);
        Details.show(
            localData.name,
            [],
            [
                {
                    tag: 'ul',
                    children: localData.contents.map((item: string) => {
                        return {
                            tag: 'li',
                            text: item,
                        };
                    }),
                },
            ],
            () => {
                Scanner.stopReading();

                // get data from firebase
                Datahandler.remote.get(decodedText).then((remoteData: obj) => {
                    console.log(remoteData);
                    edom.findById('modal-headline')?.setText(remoteData.name);
                    edom.findById('modal-body')?.clear();
                    edom.fromTemplate(
                        [
                            {
                                tag: 'ul',
                                children: remoteData.contents.map(
                                    (item: string) => {
                                        return {
                                            tag: 'li',
                                            text: item,
                                        };
                                    }
                                ),
                            },
                        ],
                        edom.findById('modal-body')
                    );
                });
            },
            () => {
                Scanner.initScanner();
            }
        );
    }

    public static render() {
        edom.fromTemplate(
            [
                {
                    tag: 'div',
                    id: 'scannerContainer',
                },
            ],
            edom.findById('content')
        );

        this.initScanner();
    }

    public static unload() {
        this.stopReading();
    }

    private static initScanner() {
        this.reader = new Html5Qrcode('scannerContainer');

        this.reader.start(
            { facingMode: 'environment' },
            this.qrConfig,
            this.onScanSuccess
        );
    }

    public static stopReading() {
        this.reader
            .stop()
            .then(() => {})
            .catch(() => {
                console.error('could not stop');
            });
    }
}
