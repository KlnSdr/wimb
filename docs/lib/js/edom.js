"use strict";
// edomError ========================================================================================
class edomElementNullExeption {
    constructor(message) {
        this.message = message;
        console.error(message);
    }
}
// edom =============================================================================================
class edom {
    static init() {
        edom.allElements = [];
        edom.body = edom.fromExisting(document.body);
        edom.body.id = 'body';
    }
    static newElement(tagname) {
        switch (tagname.toLowerCase()) {
            case 'input':
                const elmnt = new edomInputElement(false, tagname);
                elmnt.addChange('onInput', (self) => {
                    self.value = self.element.value;
                });
                return elmnt;
            case 'textarea':
                const ta = new edomInputElement(false, tagname);
                ta.addChange('onInput', (self) => {
                    self.value = self.element.value;
                });
                return ta;
            case 'a':
                return new edomAnchorElement(false, tagname);
            case 'ul':
            case 'ol':
                return new edomListElement(false, tagname);
            case 'img':
                return new edomImageElement(false, tagname);
            case 'label':
                return new edomLabelElement(false, tagname);
            default:
                return new edomElement(false, tagname);
        }
    }
    static fromExisting(element) {
        edom.iterateChildren(element);
        return new edomElement(true, '', element);
    }
    static iterateChildren(element) {
        edom.getChildren(element).forEach((child) => {
            console.log(child);
        });
    }
    static getChildren(element) {
        return Array.from(element.children);
    }
    static findById(id) {
        var toReturn;
        edom.allElements.forEach((element) => {
            if (element.id === id) {
                toReturn = element;
            }
        });
        return toReturn;
    }
    static break() {
        return edom.newElement('br');
    }
    static fromTemplate(template, parent = null) {
        if (parent === null) {
            if (template.classes != undefined) {
                edom.body.applyStyle(...template.classes);
            }
            this.fromTemplate(template.children, edom.body);
        }
        else {
            for (let i = 0; i < template.length; i++) {
                const currentChild = edom.newElement(template[i].tag);
                if (template[i].id != undefined) {
                    currentChild.id = template[i].id;
                }
                if (template[i].text != undefined) {
                    currentChild.setText(template[i].text);
                }
                if (template[i].type != undefined) {
                    currentChild.setType(template[i].type);
                }
                if (template[i].classes != undefined) {
                    currentChild.applyStyle(...template[i].classes);
                }
                if (template[i].src != undefined) {
                    currentChild.setSrc(template[i].src);
                }
                if (template[i].for != undefined) {
                    currentChild.setFor(template[i].for);
                }
                if (template[i].groupID != undefined) {
                    currentChild.setGroup(template[i].groupID);
                }
                if (template[i].target != undefined) {
                    currentChild.href(template[i].target);
                }
                if (template[i].handler != undefined) {
                    template[i].handler.forEach((handler) => {
                        currentChild.addEvent(handler.type, handler.id, new Function(handler.arguments, handler.body));
                    });
                }
                parent.addChild(currentChild);
                if (template[i].children != undefined) {
                    this.fromTemplate(template[i].children, currentChild);
                }
            }
        }
    }
}
// edomElement ======================================================================================
class edomElement {
    constructor(fromExisting, tagname, existingElement = null) {
        this.children = [];
        this.text = '';
        this.classes = [];
        this.handlers = {};
        this.values = {};
        this._id = Math.random().toString() + Math.random().toString();
        if (fromExisting === true) {
            if (existingElement === null) {
                throw new edomElementNullExeption('Given Element is null');
            }
            else {
                this.element = existingElement;
                this.rawElement = this.element;
            }
        }
        else {
            this.element = document.createElement(tagname);
            this.rawElement = this.element;
        }
        edom.allElements.push(this);
        this.tag = tagname;
        return this;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
        this.element.id = id;
    }
    addChild(child) {
        this.children.push(child);
        this.element.appendChild(child.rawElement);
        child.parent = this;
    }
    setText(text) {
        this.text = text;
        this.element.innerText = this.text;
    }
    setValue(key, value) {
        this.values[key] = value;
    }
    getValue(key) {
        return this.values[key];
    }
    addClick(identifier, func) {
        this.addEvent('click', identifier, func);
    }
    doClick() {
        this.rawElement.click();
    }
    deleteClick(identifier) {
        this.deleteEvent('click', identifier);
    }
    addEvent(type, identifier, action) {
        const hdlr = () => {
            action(this);
        };
        this.handlers[identifier] = hdlr;
        this.element.addEventListener(type, hdlr);
    }
    deleteEvent(type, identifier) {
        this.element.removeEventListener(type, this.handlers[identifier]);
    }
    applyStyle(...className) {
        className.forEach((_class) => {
            this.element.classList.add(_class);
            this.classes.push(_class);
        });
    }
    removeStyle(...className) {
        className.forEach((_class) => {
            this.element.classList.remove(_class);
            const index = this.classes.indexOf(_class);
            if (index > -1) {
                this.classes.splice(index, 1);
            }
        });
    }
    hasStyle(...className) {
        var hasStyle = true;
        className.forEach((_class) => {
            if (!this.classes.includes(_class)) {
                hasStyle = false;
            }
        });
        return hasStyle;
    }
    swapStyle(oldClass, newClass) {
        this.removeStyle(oldClass);
        this.applyStyle(newClass);
    }
    clear() {
        this.element.innerHTML = '';
        this.children = [];
    }
    delete(isChild = false) {
        if (isChild === false) {
            if (this.parent !== undefined) {
                for (let i = 0; i < this.parent.children.length; i++) {
                    if (this.parent.children[i].id === this.id) {
                        this.parent.children.splice(i, 1);
                    }
                }
            }
        }
        for (let i = 0; i < edom.allElements.length; i++) {
            if (edom.allElements[i].id === this.id) {
                edom.allElements.splice(i, 1);
            }
        }
        this.children.forEach((child) => {
            child.delete(true);
        });
        this.element.remove();
        for (var key in this)
            delete this[key];
        return true;
    }
    // TODO programmatischer machen -> nicht über Klasse in css, sondern z.B Eigenschaft von element?
    enable() {
        this.swapStyle('hidden', 'visible');
    }
    // TODO programmatischer machen -> nicht über Klasse in css, sondern z.B Eigenschaft von element?
    disable() {
        this.swapStyle('visible', 'hidden');
    }
    break() {
        this.addChild(edom.break());
    }
    focus() {
        this.element.focus();
    }
}
// edomInputElement =================================================================================
class edomInputElement extends edomElement {
    constructor() {
        super(...arguments);
        this.value = '';
        this.type = 'text';
        this.groupID = '';
    }
    addChange(identifier, func) {
        this.addEvent('input', identifier, (self) => {
            func(self);
        });
    }
    deleteChange(identifier) {
        this.deleteEvent('input', identifier);
    }
    setType(_type) {
        this.type = _type;
        this.element.type = _type;
    }
    setContent(text) {
        this.element.value = text;
        this.value = text;
    }
    select() {
        this.element.select();
    }
    setGroup(_groupID) {
        this.groupID = _groupID;
        this.element.name = this.groupID;
    }
}
class edomTAElement extends edomInputElement {
    setContent(text) {
        this.element.value = text;
        this.value = text;
    }
}
// edomAnchorElement ================================================================================
class edomAnchorElement extends edomElement {
    constructor() {
        super(...arguments);
        this.target = '';
    }
    href(location) {
        this.target = location;
        this.element.href = this.target;
    }
}
// edomListElement ==================================================================================
class edomListElement extends edomElement {
    addEntry(text) {
        const anstrich = edom.newElement('li');
        anstrich.setText(text);
        this.addChild(anstrich);
    }
    addEntryLink(text, doOnClick) {
        const anstrich = edom.newElement('li');
        const link = edom.newElement('a');
        link.setText(text);
        if (typeof doOnClick === 'string') {
            link.href(doOnClick);
        }
        else if (typeof doOnClick === 'function') {
            link.addClick('', () => {
                doOnClick(link);
            });
            link.href('javascript:void(0);');
        }
        anstrich.addChild(link);
        this.addChild(anstrich);
    }
}
// edomImageElement ==================================================================================
class edomImageElement extends edomElement {
    constructor() {
        super(...arguments);
        this.src = '';
    }
    setSrc(src) {
        this.src = src;
        this.element.src = this.src;
    }
}
// edomLabelElement ==================================================================================
class edomLabelElement extends edomElement {
    constructor() {
        super(...arguments);
        this.for = '';
    }
    setFor(htmlFor) {
        this.for = htmlFor;
        this.element.htmlFor = this.for;
    }
}
