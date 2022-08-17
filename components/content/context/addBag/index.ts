class addBag {
    private static itemList: string[] = [];

    public static isModify: boolean = false;
    public static bagData: { id: string; name: string; contents: string[] } = {
        id: '',
        name: '',
        contents: [],
    };

    public static render() {
        if (this.isModify) {
            this.itemList = this.bagData.contents;
        } else {
            this.bagData = { id: '', name: '', contents: [] };
            this.itemList = [];
        }

        edom.fromTemplate(
            [
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
            ],
            edom.findById('content')
        );

        (edom.findById('nameOfBag') as edomInputElement).setContent(
            this.bagData.name
        );
    }

    private static generateItemList(items: string[]): edomObj {
        return items.map((item: string) => {
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

    private static updateListView() {
        edom.findById('tblItems')?.clear();
        edom.fromTemplate(
            this.generateItemList(this.itemList),
            edom.findById('tblItems')
        );
    }

    public static addItem() {
        this.itemList.push(
            (edom.findById('inGepack') as edomInputElement).value || ''
        );
        this.updateListView();
        (edom.findById('inGepack') as edomInputElement).setContent('');
        edom.findById('inGepack')?.focus();
    }

    public static save() {
        const name: string =
            (edom.findById('nameOfBag') as edomInputElement).value || '';

        if (name === '') {
            return;
        }

        const data: obj = {
            name: name,
            contents: this.itemList,
        };

        const id: string = !this.isModify
            ? Datahandler.remote.create(data)
            : this.bagData.id;

        Datahandler.local.set(id, data);

        if (this.isModify) {
            Datahandler.remote.update(id, data).then((result) => {
                Content.switchContext('scanner');
            });
        } else {
            qrcode.gen(id, name);
            Content.switchContext('addBag', { forceReload: true });
        }
    }
}
