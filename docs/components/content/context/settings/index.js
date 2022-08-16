"use strict";
class Settings {
    static render() {
        edom.fromTemplate([
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
                                                text: `v${this.versionNumbers[this.versionNumbers
                                                    .length - 1]} - ${this.rlab[this.rlab.length - 1]}`,
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
        ], edom.findById('content'));
    }
    static generateLog() {
        let changelog = [];
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
                        children: this.changes[i].map((change) => {
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
Settings.versionNumbers = ['0.0.1', '1.0.0'];
Settings.rlab = ['just a test', "and that's the way the news goes"];
Settings.changes = [
    ['boilerplate testen'],
    [
        'QR-Scanner',
        'QR-Code generieren',
        'neue Taschen erstellen',
        'Daten lokal und remote speichern',
    ],
];
