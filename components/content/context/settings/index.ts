class Settings {
    static versionNumbers: string[] = ['0.0.1', '1.0.0', '1.0.1'];

    static rlab: string[] = [
        'just a test',
        "and that's the way the news goes",
        "and that's the way the news goes",
    ];

    static changes: string[][] = [
        ['boilerplate testen'],
        [
            'QR-Scanner',
            'QR-Code generieren',
            'neue Taschen erstellen',
            'Daten lokal und remote speichern',
        ],
        [
            'Anstriche werden in der PopUp-Ansicht dargestellt',
            'Tascheninhalte können nachträglich verändert werden',
        ],
    ];

    static render() {
        edom.fromTemplate(
            [
                {
                    tag: 'div',
                    classes: ['settingsContainer'],
                    children: [
                        {
                            tag: 'img',
                            src: './favicon.svg',
                        },
                        {
                            tag: 'table',
                            children: [
                                {
                                    tag: 'tr',
                                    children: [
                                        {
                                            tag: 'td',
                                            children: [
                                                {
                                                    tag: 'label',
                                                    text: `v${
                                                        this.versionNumbers[
                                                            this.versionNumbers
                                                                .length - 1
                                                        ]
                                                    } - ${
                                                        this.rlab[
                                                            this.rlab.length - 1
                                                        ]
                                                    }`,
                                                },
                                            ],
                                        },
                                        {
                                            tag: 'td',
                                            children: [
                                                {
                                                    tag: 'a',
                                                    text: 'code auf GitHub',
                                                    target: 'https://github.com/KlnSdr/wimb',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    tag: 'div',
                    children: [
                        {
                            tag: 'details',
                            classes: ['settingsContainer'],
                            children: [
                                {
                                    tag: 'summary',
                                    text: 'Änderungsprotokoll',
                                    classes: ['headlineChangelog'],
                                },
                                {
                                    tag: 'ul',
                                    children: this.generateLog(),
                                },
                            ],
                        },
                    ],
                },
            ],
            edom.findById('content')
        );
    }

    private static generateLog(): edomObj {
        let changelog: edomObj = [];

        for (let i = this.versionNumbers.length - 1; i >= 0; i--) {
            changelog.push({
                tag: 'li',
                children: [
                    {
                        tag: 'p',
                        text: `v${this.versionNumbers[i]} - ${this.rlab[i]}`,
                    },
                    {
                        tag: 'ul',
                        children: this.changes[i].map((change: string) => {
                            return {
                                tag: 'li',
                                text: change,
                                classes: ['change'],
                            };
                        }),
                    },
                ],
            });
        }

        return changelog;
    }
}
