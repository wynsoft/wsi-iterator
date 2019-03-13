class WsiIterator extends HTMLElement {

    constructor() {
        super();
        this._content = [];
        this._css = "";
    }

    get content() {
        return this._content;
    }

    set content(val) {
        this.setAttribute('content', val);
    }

    get css() {
        return this._css;
    }

    set css(val) {
        this.setAttribute('css', val);
    }

    createdCallback() {
        if (this.getAttribute('shadow') != "false") {
            this.createShadowRoot();
        }
    }
    static get observedAttributes() {
        return ['content', 'css'];
    }

    attachedCallback() {
        this.render();
    }
    render() {
        const content = WsiIterator.fromJson(this.getAttribute('content'));
        const element = this.getAttribute('element');
        const template = this.innerHTML;
        if (this.css == undefined) {
            this._css = `
        .list-group {
            display: -ms-flexbox;
            display: flex; 
            -ms-flex-direction: column;
            flex-direction: column;
            padding-left: 0;
            margin-bottom: 0;
        }
        .list-group-item {
            position: relative;
            display: block;
            padding: .75rem 1.25rem;
            margin-bottom: -1px;
            background-color: #fff;
            border: 1px solid rgba(0, 0, 0, .125);
        `;
            this.setAttribute("css", this.css);
        }
        let html = "<style>" + this.css + "</style>";
        html += (element !== null) ? "<" + element.toLowerCase() + " class='list-group'>" : "";
        if (Array.isArray(content)) {
            content.forEach(function (item) {
                html += WsiIterator.build(template, item);
            });
        } else {
            throw new Error("The content attribute should contain an Array of objects.");
        }
        html += (element !== null) ? "</" + element.toLowerCase() + ">" : "";
        if (this.getAttribute('shadow') != "false") {
            this.shadowRoot.innerHTML = html;
            this.innerHTML = "";
        } else {
            this.innerHTML = html;
        }
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "content":
                this._content = newVal;
                this.render();
                break;
            case "css":
                this._css = newVal;
                this.render();
                break;
        }
    }
    static build(template, obj) {
        if (typeof obj == "object") {
            for (var key in obj) {
                template = "<li class='list-group-item'>" + obj[key] + "</li>";
                delete obj[key];
            }
        }
        return template;
    }
    static fromJson(str) {
        let obj = null;
        if (typeof str == "string") {
            try {
                obj = JSON.parse(str);
            } catch (e) {
                throw new Error("The JSON string provided in the content attribute is invalid. ");
            }
        }
        return obj;
    }
}

document.registerElement("wsi-iterator", WsiIterator);