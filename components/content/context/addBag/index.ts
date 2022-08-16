class addBag {
    private static itemList: string[] = [];

    public static render() {
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

        const id: string = Datahandler.remote.create(data);

        Datahandler.local.set(id, data);

        qrcode.gen(id, name);

        this.itemList = [];

        Content.switchContext('addBag', { forceReload: true });
    }
}
