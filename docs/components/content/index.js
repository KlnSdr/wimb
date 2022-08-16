"use strict";
class Content {
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
    static switchContext(targetName, options = {}) {
        var _a;
        // check if current context is the same as next to save ressources
        if (this.currentContext === targetName &&
            options.forceReload === undefined) {
            return;
        }
        if (targetName !== 'scanner' && this.currentContext === 'scanner') {
            Scanner.unload();
        }
        (_a = edom.findById('content')) === null || _a === void 0 ? void 0 : _a.clear();
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
    static setHeadline(text) {
        var _a;
        (_a = edom.findById('headline')) === null || _a === void 0 ? void 0 : _a.setText(text);
    }
}
Content.headlines = {
    settings: 'Einstellungen',
    scanner: '',
    addBag: 'Tasche hinzufügen',
};
Content.currentContext = '';
