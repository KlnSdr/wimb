class Content {
    private static headlines: { [key: string]: string } = {
        settings: 'Einstellungen',
        scanner: '',
        addBag: 'Tasche hinzufügen',
    };

    private static currentContext: string = '';

    static render() {
        edom.fromTemplate({
            children: [
                {
                    tag: 'div',
                    classes: ['topbar'],
                    children: [
                        {
                            tag: 'h2',
                            id: 'headline',
                            text: '',
                        },
                        {
                            tag: 'button',
                            classes: ['fas', 'fa-ellipsis-h', 'settings'],
                            handler: [
                                {
                                    type: 'click',
                                    id: 'clickSwitchToSettings',
                                    arguments: '',
                                    body: 'Content.switchContext("settings")',
                                },
                            ],
                        },
                    ],
                },
                {
                    tag: 'div',
                    id: 'content',
                    classes: ['content'],
                },
            ],
        });
    }

    static switchContext(targetName: string, options: obj = {}) {
        // check if current context is the same as next to save ressources
        if (
            this.currentContext === targetName &&
            options.forceReload === undefined
        ) {
            return;
        }

        if (targetName !== 'scanner' && this.currentContext === 'scanner') {
            Scanner.unload();
        }

        edom.findById('content')?.clear();
        Dropdown.removeDropdowns();

        switch (targetName) {
            case 'settings':
                Settings.render();
                break;
            case 'scanner':
                Scanner.render();
                break;
            case 'addBag':
                addBag.render();
                break;
            default:
                break;
        }

        this.setHeadline(this.headlines[targetName]);
    }

    static setHeadline(text: string) {
        edom.findById('headline')?.setText(text);
    }
}
