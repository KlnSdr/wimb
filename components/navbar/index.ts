class Navbar {
    private static currentFocusedElement: string = 'missions';
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

    static setFocus(targetID: string) {
        edom.findById(this.currentFocusedElement)?.removeStyle('active');
        if (targetID !== 'scanner') {
            edom.findById(targetID)?.applyStyle('active');
        }
        this.currentFocusedElement = targetID;
    }
}
