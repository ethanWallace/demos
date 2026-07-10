import { p as proxyCustomElement, H, h, a as Host } from './index.js';
import { a as assignLanguage, f as formatDataLabel } from './p-BbO8WzMW.js';

const I18N = {
  en: {
    name: 'Event name',
    description: 'Description',
    details: 'Details',
  },
  fr: {
    name: "Nom de l'événement",
    description: 'Description',
    details: 'Details (TODO FR)',
  },
};

const eventsTabCss = ":host{display:block}";

const EventsTab = /*@__PURE__*/ proxyCustomElement(class EventsTab extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    get el() { return this; }
    /* ---------------------------
     * Props
     * --------------------------- */
    eventObject;
    /* ---------------------------
     * State
     * --------------------------- */
    lang = 'en';
    /* ---------------------------
     * Lifecycle
     * --------------------------- */
    async componentWillLoad() {
        // Define lang attribute
        this.lang = assignLanguage(this.el);
    }
    /* ---------------------------
     * Render
     * --------------------------- */
    render() {
        const { lang } = this;
        return (h(Host, { key: '4b015db9dd12f16f48699f73aec4eb63f65adcba', role: "tabpanel", tabindex: "0" }, h("table", { key: 'f54004f5e4860fbde92018d9b117d0c3205de365', class: "events" }, h("tr", { key: '06b96aab7f4f05076dbf66e802b334d53bf5d4b6' }, h("th", { key: 'c066e37b4f2d28d4b5442eeba6a1f73a969121b3' }, I18N[lang].name), h("th", { key: 'a9a3db86e1ec327a4e4bd2643bb372e555879076' }, I18N[lang].description), h("th", { key: '65d00eb23bd5cdcdd01218216a4a55249b652e6e' }, I18N[lang].details)), this.eventObject.map(event => {
            return (h("tr", { class: event.name }, h("td", { "data-label": formatDataLabel(I18N[lang].name, lang) }, event.name), h("td", { "data-label": formatDataLabel(I18N[lang].description, lang) }, event.description), h("td", { "data-label": formatDataLabel(I18N[lang].details, lang) }, event.details)));
        }))));
    }
    static get style() { return eventsTabCss; }
}, [0, "events-tab", {
        "eventObject": [16, "event-object"],
        "lang": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["events-tab"];
    components.forEach(tagName => { switch (tagName) {
        case "events-tab":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, EventsTab);
            }
            break;
    } });
}
defineCustomElement();

export { EventsTab as E, defineCustomElement as d };
//# sourceMappingURL=p-DjbN7xht.js.map

//# sourceMappingURL=p-DjbN7xht.js.map