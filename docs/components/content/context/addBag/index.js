"use strict";
class addBag {
    static render() {
        if (this.isModify) {
            this.itemList = this.bagData.contents;
        }
        else {
            this.bagData = { id: '', name: '', contents: [] };
            this.itemList = [];
        }
        edom.fromTemplate([
            Input.instruction('Name der Tasche', 'nameOfBag'),
            {
                tag: 'hr',
            },
            Input.instruction('Gepäckstück', 'inGepack'),
            {
                tag: 'button',
                text: 'hinzufügen',
                classes: ['floatRight'],
                handler: [
                    {
                        type: 'click',
                        id: 'clickAddItem',
                        arguments: '',
                        body: 'addBag.addItem()',
                    },
                ],
            },
            {
                tag: 'table',
                id: 'tblItems',
                children: this.generateItemList(this.itemList),
            },
            {
                tag: 'button',
                text: 'Tasche speichern',
                classes: ['bttnFullWidth'],
                handler: [
                    {
                        type: 'click',
                        id: 'saveBag',
                        arguments: '',
                        body: 'addBag.save()',
                    },
                ],
            },
        ], edom.findById('content'));
        edom.findById('nameOfBag').setContent(this.bagData.name);
    }
    static generateItemList(items) {
        return items.map((item) => {
            return {
                tag: 'tr',
                children: [
                    {
                        tag: 'td',
                        children: [
                            {
                                tag: 'button',
                                classes: ['fas', 'fa-minus', 'deleteItem'],
                                handler: [
                                    {
                                        type: 'click',
                                        id: 'clickRemoveItem',
                                        arguments: '',
                                        body: `addBag.itemList.splice(addBag.itemList.indexOf('${item}'), 1); addBag.updateListView()`,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        tag: 'td',
                        text: item,
                    },
                ],
            };
        });
    }
    static updateListView() {
        var _a;
        (_a = edom.findById('tblItems')) === null || _a === void 0 ? void 0 : _a.clear();
        edom.fromTemplate(this.generateItemList(this.itemList), edom.findById('tblItems'));
    }
    static addItem() {
        var _a;
        this.itemList.push(edom.findById('inGepack').value || '');
        this.updateListView();
        edom.findById('inGepack').setContent('');
        (_a = edom.findById('inGepack')) === null || _a === void 0 ? void 0 : _a.focus();
    }
    static save() {
        const name = edom.findById('nameOfBag').value || '';
        if (name === '') {
            return;
        }
        const data = {
            name: name,
            contents: this.itemList,
        };
        const id = !this.isModify
            ? Datahandler.remote.create(data)
            : this.bagData.id;
        Datahandler.local.set(id, data);
        if (this.isModify) {
            Datahandler.remote.update(id, data).then((result) => {
                Content.switchContext('scanner');
            });
        }
        else {
            qrcode.gen(id, name);
            Content.switchContext('addBag', { forceReload: true });
        }
    }
}
addBag.itemList = [];
addBag.isModify = false;
addBag.bagData = {
    id: '',
    name: '',
    contents: [],
};
