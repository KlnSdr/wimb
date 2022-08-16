"use strict";
class Input {
    static instruction(text, id, type = 'text') {
        return {
            tag: 'div',
            classes: ['textInput'],
            children: [
                {
                    tag: 'label',
                    text: text,
                },
                {
                    tag: 'br',
                },
                {
                    tag: 'input',
                    type: type,
                    id: id,
                },
            ],
        };
    }
}
