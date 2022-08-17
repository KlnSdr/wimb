class Scanner {
    // @ts-expect-error implicitly typeof any
    private static reader;

    private static qrConfig = {
        fps: 10,
        qrbox: { width: 256, height: 256 },
        aspectRatio: 1.0,
    };

    private static onScanSuccess(decodedText: string, decodedResult: Object) {
        Scanner.stopReading();
        const localData: { name: string; id: string; contents: string[] } =
            Datahandler.local.get(decodedText) as {
                name: string;
                id: string;
                contents: string[];
            };
        localData.id = decodedText;
        console.log(localData);
        addBag.bagData = localData;
        Details.show(
            localData.name,
            [
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
            ],
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
                // get data from firebase
                Datahandler.remote.get(decodedText).then((remoteData: obj) => {
                    remoteData.id = decodedText;
                    console.log(remoteData);
                    addBag.bagData = remoteData as {
                        name: string;
                        id: string;
                        contents: string[];
                    };
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
                console.log('exec onClose');
                Scanner.initScanner();
            }
        );
    }

    public static render() {
        console.log('render scanner');
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
        console.log('scanner start');
        // @ts-expect-error no type Html5Qrcode 'cause include via js
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
            .then(() => {
                console.log('scanner stopped');
            })
            .catch(() => {
                console.error('could not stop');
            });
    }
}
