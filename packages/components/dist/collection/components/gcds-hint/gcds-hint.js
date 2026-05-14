import { Host, h } from "@stencil/core";
/**
 * Hint provides additional information or context to help users understand the content or functionality of a related element.
 *
 * @slot default - Slot for the hint content.
 */
export class GcdsHint {
    render() {
        const { hintId } = this;
        return (h(Host, { key: '17f8d587edb3e60141a007d2bba173e6dec0d021', id: `hint-${hintId}` }, h("gcds-text", { key: '8cb2346f614ff75373ad921147ea4e02f412dc01', class: "gcds-hint", "margin-bottom": "0", part: "hint" }, h("slot", { key: 'ea689ce20d55cba6e5b940210de6b03824fd5170' }))));
    }
    static get is() { return "gcds-hint"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["gcds-hint.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["gcds-hint.css"]
        };
    }
    static get properties() {
        return {
            "hintId": {
                "type": "string",
                "attribute": "hint-id",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Id attribute for the hint."
                },
                "getter": false,
                "setter": false,
                "reflect": false
            }
        };
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=gcds-hint.js.map
