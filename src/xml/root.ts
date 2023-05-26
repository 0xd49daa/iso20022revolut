import * as xmlbuilder from 'xmlbuilder'

export function getRoot() {
    return {
        rootNode: xmlbuilder.create('Document', {})
            .att('xmlns', 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.02')
            .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
            .att('xsi:schemaLocation', 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.02 ./camt.053.001.02.xsd')
            .ele('BkToCstmrStmt')
    }
}
