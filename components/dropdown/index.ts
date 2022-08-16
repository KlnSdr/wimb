class Dropdown {
    static dropdowns: edomObj = {};

    static instruction(
        headline: string,
        options: string[],
        defaultValue: number = -1
    ): edomObj {
        this.dropdowns[headline] = new DropdownCode(
            headline,
            options,
            defaultValue
        );
        return this.dropdowns[headline].instruction();
    }

    static getThis(id: string): DropdownCode {
        return this.dropdowns[id];
    }

    static removeDropdowns() {
        this.dropdowns = new Object();
    }
}

namespace Dropdown {
    export enum State {
        open,
        closed,
    }
}

class DropdownCode {
    headline: string;
    options: string[];
    value: number;
    state: Dropdown.State = Dropdown.State.closed;

    constructor(
        _headline: string,
        _options: string[],
        _defaultValue: number = -1
    ) {
        this.headline = _headline;
        this.options = _options;
        this.value = _defaultValue;
    }

    instruction() {
        // <div class="dropdown">
        //     <div class="dropdownHead">
        //         <i class="fas fa-caret-right"></i>
        //         <p>launch vehicle</p>
        //         <label for=""> - Jupiter IV</label>
        //     </div>
        //     <div class="dropdownContent active">
        //         <label for="test"
        //             ><input type="radio" name="vehicles" id="test" />Seth</label
        //         >
        //         <label for="test2"
        //             ><input type="radio" name="vehicles" id="test2" />Jupiter
        //             IV</label
        //         >
        //     </div>
        // </div>
        return {
            tag: 'div',
            classes: ['dropdown'],
            children: [
                {
                    tag: 'div',
                    classes: ['dropdownHead'],
                    handler: [
                        {
                            type: 'click',
                            id: 'clickHandlerOpenCloseDropdown',
                            arguments: '',
                            body: `Dropdown.getThis('${this.headline}').switchState()`,
                        },
                    ],
                    children: [
                        {
                            tag: 'i',
                            id: `${this.headline}StateSymbol`,
                            classes: ['fas', 'fa-caret-right'],
                        },
                        {
                            tag: 'p',
                            text: this.headline,
                        },
                        {
                            tag: 'label',
                            id: `${this.headline}LabelValue`,
                            text: `${
                                this.value > -1
                                    ? ' - ' + this.options[this.value]
                                    : ''
                            }`,
                        },
                    ],
                },
                {
                    tag: 'div',
                    id: `${this.headline}dropdownContent`,
                    classes: ['dropdownContent'],
                    children: this.createInputs(),
                },
            ],
        };
    }

    private createInputs(): edomObj {
        return this.options.map((option: string, index: number) => {
            return {
                tag: 'div',
                classes: ['inputContainer'],
                children: [
                    {
                        tag: 'input',
                        type: 'radio',
                        id: this.headline + option,
                        groupID: this.headline,
                        handler: [
                            {
                                type: 'click',
                                id: 'clickHandlerSetValue',
                                arguments: '',
                                body: `Dropdown.getThis('${this.headline}').setValue(${index})`,
                            },
                        ],
                    },
                    {
                        tag: 'label',
                        text: option,
                        for: this.headline + option,
                    },
                ],
            };
        });
    }

    setValue(newValue: number) {
        this.value = newValue;
        edom.findById(`${this.headline}LabelValue`)?.setText(
            ` - ${this.options[this.value]}`
        );
        this.setDropdownState(Dropdown.State.closed);
    }

    private setDropdownState(state: Dropdown.State) {
        this.state = state;
        switch (state) {
            case Dropdown.State.open:
                edom.findById(`${this.headline}dropdownContent`)?.applyStyle(
                    'active'
                );
                edom.findById(`${this.headline}StateSymbol`)?.swapStyle(
                    'fa-caret-right',
                    'fa-caret-down'
                );
                break;
            case Dropdown.State.closed:
                edom.findById(`${this.headline}dropdownContent`)?.removeStyle(
                    'active'
                );
                edom.findById(`${this.headline}StateSymbol`)?.swapStyle(
                    'fa-caret-down',
                    'fa-caret-right'
                );
                break;
        }
    }

    private switchState() {
        this.setDropdownState(
            this.state === Dropdown.State.open
                ? Dropdown.State.closed
                : Dropdown.State.open
        );
    }
}
