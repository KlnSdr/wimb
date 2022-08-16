"use strict";
class Dropdown {
    static instruction(headline, options, defaultValue = -1) {
        this.dropdowns[headline] = new DropdownCode(headline, options, defaultValue);
        return this.dropdowns[headline].instruction();
    }
    static getThis(id) {
        return this.dropdowns[id];
    }
    static removeDropdowns() {
        this.dropdowns = new Object();
    }
}
Dropdown.dropdowns = {};
(function (Dropdown) {
    let State;
    (function (State) {
        State[State["open"] = 0] = "open";
        State[State["closed"] = 1] = "closed";
    })(State = Dropdown.State || (Dropdown.State = {}));
})(Dropdown || (Dropdown = {}));
class DropdownCode {
    constructor(_headline, _options, _defaultValue = -1) {
        this.state = Dropdown.State.closed;
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
                            text: `${this.value > -1
                                ? ' - ' + this.options[this.value]
                                : ''}`,
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
    createInputs() {
        return this.options.map((option, index) => {
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
    setValue(newValue) {
        var _a;
        this.value = newValue;
        (_a = edom.findById(`${this.headline}LabelValue`)) === null || _a === void 0 ? void 0 : _a.setText(` - ${this.options[this.value]}`);
        this.setDropdownState(Dropdown.State.closed);
    }
    setDropdownState(state) {
        var _a, _b, _c, _d;
        this.state = state;
        switch (state) {
            case Dropdown.State.open:
                (_a = edom.findById(`${this.headline}dropdownContent`)) === null || _a === void 0 ? void 0 : _a.applyStyle('active');
                (_b = edom.findById(`${this.headline}StateSymbol`)) === null || _b === void 0 ? void 0 : _b.swapStyle('fa-caret-right', 'fa-caret-down');
                break;
            case Dropdown.State.closed:
                (_c = edom.findById(`${this.headline}dropdownContent`)) === null || _c === void 0 ? void 0 : _c.removeStyle('active');
                (_d = edom.findById(`${this.headline}StateSymbol`)) === null || _d === void 0 ? void 0 : _d.swapStyle('fa-caret-down', 'fa-caret-right');
                break;
        }
    }
    switchState() {
        this.setDropdownState(this.state === Dropdown.State.open
            ? Dropdown.State.closed
            : Dropdown.State.open);
    }
}
