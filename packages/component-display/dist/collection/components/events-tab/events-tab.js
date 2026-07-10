import { Host, h } from "@stencil/core";
import { assignLanguage, formatDataLabel } from "../../utils/utils";
import i18n from "./i18n/i18n";
export class EventsTab {
    el;
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
        return (h(Host, { key: '4b015db9dd12f16f48699f73aec4eb63f65adcba', role: "tabpanel", tabindex: "0" }, h("table", { key: 'f54004f5e4860fbde92018d9b117d0c3205de365', class: "events" }, h("tr", { key: '06b96aab7f4f05076dbf66e802b334d53bf5d4b6' }, h("th", { key: 'c066e37b4f2d28d4b5442eeba6a1f73a969121b3' }, i18n[lang].name), h("th", { key: 'a9a3db86e1ec327a4e4bd2643bb372e555879076' }, i18n[lang].description), h("th", { key: '65d00eb23bd5cdcdd01218216a4a55249b652e6e' }, i18n[lang].details)), this.eventObject.map(event => {
            return (h("tr", { class: event.name }, h("td", { "data-label": formatDataLabel(i18n[lang].name, lang) }, event.name), h("td", { "data-label": formatDataLabel(i18n[lang].description, lang) }, event.description), h("td", { "data-label": formatDataLabel(i18n[lang].details, lang) }, event.details)));
        }))));
    }
    static get is() { return "events-tab"; }
    static get originalStyleUrls() {
        return {
            "$": ["events-tab.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["events-tab.css"]
        };
    }
    static get properties() {
        return {
            "eventObject": {
                "type": "unknown",
                "attribute": "event-object",
                "mutable": false,
                "complexType": {
                    "original": "Array<EventType>",
                    "resolved": "EventType[]",
                    "references": {
                        "Array": {
                            "location": "global",
                            "id": "global::Array"
                        },
                        "EventType": {
                            "location": "import",
                            "path": "../../utils/utils",
                            "id": "src/utils/utils.ts::EventType"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            }
        };
    }
    static get states() {
        return {
            "lang": {}
        };
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=events-tab.js.map
