/// <reference path="../node_modules/office-ui-fabric-js/dist/js/fabric.d.ts" />

declare const fabric: any;

import * as officeuifabric from "office-ui-fabric-js/dist/js/fabric.js";

function isHTMLElement(element: any): asserts element is HTMLElement {
    if (!(element instanceof HTMLElement)) {
        throw new Error("Element is not a HTMLElement");
    }
}

export function instantiateTables() {
    var TableElements = document.querySelectorAll(".ms-Table");
    for (var i = 0; i < TableElements.length; i++) {
        var element = TableElements[i];
        isHTMLElement(element);
        new fabric.Table(element);
    }
}