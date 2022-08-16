"use strict";
class Details {
    static show(header = '', footer = [], content = [], onShow = () => { }, onClose = () => { }) {
        Details.close();
        edom.fromTemplate([
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
        ], edom.body);
        this._onClose = onClose;
        const modal = edom.findById('myModal');
        modal.element.style.display = 'block';
        onShow();
        edom.body.rawElement.style.overflow = 'hidden';
    }
    static close() {
        var _a;
        (_a = edom.findById('myModal')) === null || _a === void 0 ? void 0 : _a.delete();
        edom.body.rawElement.style.overflow = '';
        this._onClose();
        this._onClose = () => { };
    }
}
Details._onClose = () => { };
