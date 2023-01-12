import { XMLNode } from "xmlbuilder";

export function addTxDtls(node: XMLNode, reference: string, description: string, name: string, IBAN: string): XMLNode {
    // should be internal ref, or incoming ref
    if (reference) {
        node
            .ele('Refs')
            .ele('EndToEndId', reference).up()
            .up();
    }

    node.ele('RltdPties')
        .ele('Cdtr')
        .ele('Nm', name).up()
        .up()
        .ele('CdtrAcct')
        .ele('Id').ele('IBAN', IBAN || 'LT999999999999999999').up().up()
        .up()
        .up()

    if (description) {
        node
            .ele('RmtInf')
            .ele('Ustrd', description || '').up()
            .up()
    }

    return node;
}