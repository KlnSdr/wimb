class Details {
    static _onClose: () => void = () => {};

    static show(
        header: string = '',
        footer: obj = [],
        content: obj = [],
        onShow: () => void = () => {},
        onClose: () => void = () => {}
    ) {
        Details.close();
        edom.fromTemplate(
            [
                {
                    tag: 'div',
                    id: 'myModal',
                    classes: ['modal'],
                    children: [
                        {
                            tag: 'div',
                            classes: ['modal-content'],
                            children: [
                                {
                                    tag: 'div',
                                    classes: ['modal-header'],
                                    children: [
                                        {
                                            tag: 'span',
                                            classes: [
                                                'close',
                                                'fa',
                                                'fa-times',
                                            ],
                                            id: 'closeModal',
                                            handler: [
                                                {
                                                    type: 'click',
                                                    id: 'closeModal',
                                                    arguments: '',
                                                    body: 'Details.close();',
                                                },
                                            ],
                                        },
                                        {
                                            tag: 'h3',
                                            id: 'modal-headline',
                                            text: header,
                                        },
                                    ],
                                },
                                {
                                    tag: 'div',
                                    classes: ['modal-body'],
                                    id: 'modal-body',
                                    children: content,
                                },
                                {
                                    tag: 'div',
                                    classes: ['modal-footer'],
                                    children: [
                                        {
                                            tag: 'h3',
                                            children: footer,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            edom.body
        );

        this._onClose = onClose;

        const modal: edomElement = edom.findById('myModal')!;
        modal.element.style.display = 'block';

        onShow();

        edom.body.rawElement.style.overflow = 'hidden';
    }

    static close(suppressCustom: boolean = false) {
        edom.findById('myModal')?.delete();
        edom.body.rawElement.style.overflow = '';
        if (!suppressCustom) {
            this._onClose();
        }
        this._onClose = () => {};
    }
}
