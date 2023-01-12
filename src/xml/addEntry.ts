import { XMLNode } from "xmlbuilder";
import { Transaction } from "../types";
import { addTxDtls } from "./addTxDtls";
import { stripDashes } from "./common";

export function getCreditDebitIndicator(amount: number) {
    return amount >= 0 ? 'CRDT' : 'DBIT';
}

export async function addEntry(node: XMLNode, data: Transaction) {
    const {currency, amount, completed_at, ID, reference, description, name, IBAN} = data;

    const txDtls = node
        .ele('Ntry')
        .ele('Amt', {'Ccy': currency}, Math.abs(amount)).up()
        .ele('CdtDbtInd', getCreditDebitIndicator(amount)).up()
        .ele('Sts', 'BOOK').up()
        .ele('BookgDt').ele('Dt', completed_at).up().up()
        .ele('ValDt').ele('Dt', completed_at).up().up()
        .ele('BkTxCd')
        .ele('Prtry')
        .ele('Cd', stripDashes(ID)).up()
        .ele('Issr', stripDashes(ID)).up()
        .up()
        .up()
        .ele('NtryDtls')
        .ele('TxDtls');

    const txDtlsNode = addTxDtls(txDtls, reference, description, name, IBAN);

    txDtlsNode
        .up()
        .up()
        .up()
}