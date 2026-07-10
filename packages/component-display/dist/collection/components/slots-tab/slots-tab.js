import { Host, h } from "@stencil/core";
import DOMPurify from "dompurify";
import { assignLanguage, formatDataLabel } from "../../utils/utils";
import i18n from "./i18n/i18n";
export class SlotsTab {
    el;
    valueChecker = null;
    lastInputValue = {};
    /* ---------------------------
     * Props
     * --------------------------- */
    slotObject;
    displayElement;
    slotHistory;
    /* ---------------------------
     * Events
     * --------------------------- */
    slotValueChange;
    statusUpdate;
    /* ---------------------------
     * State
     * --------------------------- */
    lang = 'en';
    slotErrors = {};
    lastInputTimestamp = [];
    /* ---------------------------
     * Actions
     * --------------------------- */
    /*
     * Sanitize and emit slot change event
     */
    emitSlotEvent(e) {
        const sanitizedValue = DOMPurify.sanitize(e.target.value, {
            CUSTOM_ELEMENT_HANDLING: {
                tagNameCheck: /^gcds-/,
                attributeNameCheck: /.*/,
                allowCustomizedBuiltInElements: false,
            },
            ADD_ATTR: ['slot'],
        });
        const textarea = e.target;
        const name = textarea.name;
        // Prevent emitting invalid slot content for slots
        if (textarea.value.trim() !== '') {
            // Check if the slot content includes the correct slot attribute
            if (name !== 'default' && !textarea.value.includes(`slot="${name}"`)) {
                this.slotErrors = { ...this.slotErrors, [name]: i18n[this.lang].slotMissingAttribute.replaceAll('{name}', name) };
                return;
            }
            if (sanitizedValue !== textarea.value) {
                this.slotErrors = { ...this.slotErrors, [name]: i18n[this.lang].slotSanitized };
                return;
            }
        }
        // clear error for that slot
        this.slotErrors = { ...this.slotErrors, [name]: '' };
        const eventDetail = {
            name,
            value: sanitizedValue,
        };
        this.slotValueChange.emit(eventDetail);
    }
    onFocusStartInterval = (e) => {
        const element = e.target.shadowRoot.querySelector(`[name="${e.target.name}"]`);
        const value = element.value;
        const name = element.name;
        // Start value checking on input
        this.valueChecker = window.setInterval(() => {
            if (Date.now() - 500 >= this.lastInputTimestamp[name]) {
                if (value !== this.lastInputValue[name] && this.slotErrors[name] === '') {
                    this.statusUpdate.emit({ name: name, type: 'slot' });
                    clearInterval(this.valueChecker);
                }
            }
        }, 1000);
    };
    onBlurClearInterval = () => {
        if (this.valueChecker) {
            window.clearInterval(this.valueChecker);
        }
    };
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
        return (h(Host, { key: '3d94137d0158791a3f2206606b636bc10b50a159', role: "tabpanel", tabindex: "0" }, h("table", { key: '9d8cb73e235d2a64c1127d7c98dd6771db40c9ec', class: "slots" }, h("tr", { key: '7a5cb95dd9f89e091010f8feff0f696a5b5b3e7c' }, h("th", { key: '806ebfaab39667d709e3b2f6d875dedbe1a0c756' }, i18n[lang].name), h("th", { key: 'ecf0e503e95138324b8ce697e947c54cdcdf85a2' }, i18n[lang].description), h("th", { key: '207b80d57adfa0af91a6e306b7a1072abe1b5e80' }, i18n[lang].control)), this.slotObject.map(slot => {
            this.lastInputValue = { ...this.lastInputValue, [slot.name]: this.slotHistory[slot.name] };
            const control = (h("gcds-textarea", { label: slot.name, textareaId: slot.name, name: slot.name, hideLabel: true, value: this.slotHistory[slot.name], "error-message": this.slotErrors[slot.name], "validate-on": "other", onChange: e => this.emitSlotEvent(e), onFocus: e => this.onFocusStartInterval(e), onBlur: this.onBlurClearInterval, lang: this.lang }));
            return (h("tr", null, h("td", { "data-label": formatDataLabel(i18n[lang].name, lang) }, slot.name), h("td", { "data-label": formatDataLabel(i18n[lang].description, lang) }, slot.description), h("td", null, control)));
        }))));
    }
    static get is() { return "slots-tab"; }
    static get originalStyleUrls() {
        return {
            "$": ["slots-tab.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["slots-tab.css"]
        };
    }
    static get properties() {
        return {
            "slotObject": {
                "type": "unknown",
                "attribute": "slot-object",
                "mutable": false,
                "complexType": {
                    "original": "Array<SlotType>",
                    "resolved": "SlotType[]",
                    "references": {
                        "Array": {
                            "location": "global",
                            "id": "global::Array"
                        },
                        "SlotType": {
                            "location": "import",
                            "path": "../../utils/utils",
                            "id": "src/utils/utils.ts::SlotType"
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
            },
            "displayElement": {
                "type": "unknown",
                "attribute": "display-element",
                "mutable": false,
                "complexType": {
                    "original": "Element",
                    "resolved": "Element",
                    "references": {
                        "Element": {
                            "location": "import",
                            "path": "@stencil/core",
                            "id": "node_modules::Element"
                        }
                    }
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            },
            "slotHistory": {
                "type": "unknown",
                "attribute": "slot-history",
                "mutable": false,
                "complexType": {
                    "original": "Object",
                    "resolved": "Object",
                    "references": {
                        "Object": {
                            "location": "global",
                            "id": "global::Object"
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
            "lang": {},
            "slotErrors": {},
            "lastInputTimestamp": {}
        };
    }
    static get events() {
        return [{
                "method": "slotValueChange",
                "name": "slotValueChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Object",
                    "resolved": "Object",
                    "references": {
                        "Object": {
                            "location": "global",
                            "id": "global::Object"
                        }
                    }
                }
            }, {
                "method": "statusUpdate",
                "name": "statusUpdate",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Object",
                    "resolved": "Object",
                    "references": {
                        "Object": {
                            "location": "global",
                            "id": "global::Object"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=slots-tab.js.map
