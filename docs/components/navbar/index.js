"use strict";
class Navbar {
    static render() {
        // <footer>
        //     <button class="fas fa-satellite-dish active"></button>
        //     <button class="fab fa-connectdevelop"></button>
        //     <button class="fas fa-plus buttonCenter"></button>
        //     <button class="placeholder"></button>
        //     <button class="fas fa-rocket"></button>
        //     <button class="fas fa-chart-bar"></button>
        // </footer>
        edom.fromTemplate({
            children: [
                {
                    tag: 'footer',
                    children: [
                        {
                            tag: 'button',
                            classes: ['fas', 'fa-plus'],
                            handler: [
                                {
                                    type: 'click',
                                    id: 'clickAddBag',
                                    arguments: '',
                                    body: 'Content.switchContext("addBag")',
                                },
                            ],
                        },
                        {
                            id: 'scanner',
                            tag: 'button',
                            classes: ['fas', 'fa-qrcode', 'buttonCenter'],
                            handler: [
                                {
                                    type: 'click',
                                    id: 'clickHandlerSwitchContext',
                                    arguments: '',
                                    body: 'Content.switchContext("scanner")',
                                },
                            ],
                        },
                        {
                            tag: 'button',
                            classes: ['placeholder'],
                        },
                    ],
                },
            ],
        });
    }
    static setFocus(targetID) {
        var _a, _b;
        (_a = edom.findById(this.currentFocusedElement)) === null || _a === void 0 ? void 0 : _a.removeStyle('active');
        if (targetID !== 'scanner') {
            (_b = edom.findById(targetID)) === null || _b === void 0 ? void 0 : _b.applyStyle('active');
        }
        this.currentFocusedElement = targetID;
    }
}
Navbar.currentFocusedElement = 'missions';
