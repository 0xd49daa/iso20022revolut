import {getCurrentDateTime, getStrippedId} from './common';
import {XMLElement} from "xmlbuilder";

export function addGroupHeader(node: XMLElement) {
    return node
        .ele('GrpHdr')
            .ele('MsgId', getStrippedId()).up()
            .ele('CreDtTm', getCurrentDateTime()).up()
        .up();
}
