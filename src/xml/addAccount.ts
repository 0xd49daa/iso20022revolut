import {XMLNode} from "xmlbuilder";

export function addAccount(node: XMLNode, iban: string, currency: string) {
    node
        .ele('Acct')
        .ele('Id')
        .ele('IBAN', iban.replace(/\s/g, "")).up()
        .up()
        .ele('Ccy', currency).up()
        .up()
}
