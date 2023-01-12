import {XMLNode} from "xmlbuilder";

export function addBalance(node: XMLNode, code: string, currency: string, balance: number, date: string) {
    try {
    node
        .ele('Bal')
        .ele('Tp')
        .ele('CdOrPrtry')
        .ele('Cd', code).up() // book balance at the beginning of the account reporting period
        .up()
        .up()
        .ele('Amt', {'Ccy': currency}, (balance || 0).toFixed(2)).up()
        .ele('CdtDbtInd', 'CRDT').up()
        .ele('Dt').ele('Dt', date).up().up()
        .up()
    } catch(e) {
        console.log('ERROR', currency, balance)
    }
}
