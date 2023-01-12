import { Transaction } from "../types";
import { addStmt } from "./addStmt";
import { addGroupHeader } from "./groupHeader";
import { getRoot } from "./root";
import fs from 'fs'
import moment from "moment";
import path from 'path'

function checkAndCreate(createPath: string) {
    if (!fs.existsSync(createPath)) {
        fs.mkdirSync(createPath)
    }
}

function getFolder(accountIBAN: string, accountCurrency: string, date: string) {
    const year = moment(date).get('year')
    
    try {
        checkAndCreate(path.resolve('output'))        
        checkAndCreate(path.resolve('output', `${accountIBAN}-${accountCurrency}`))
        checkAndCreate(path.resolve('output', `${accountIBAN}-${accountCurrency}`, `${year}`))
    } catch(e) {
        console.log('failed to create folder', (e as Error).message)
    }

    return path.resolve('output', `${accountIBAN}-${accountCurrency}`, `${year}`)
}

function getNextIndex(accountIBAN: string, accountCurrency: string, date: string) {
    let maxIndex = 0

    const files = fs.readdirSync(getFolder(accountIBAN, accountCurrency, date))

    for (const file of files) {
        const [index] = file.split('.')

        if (+index > maxIndex) {
            maxIndex = +index
        }
    }

    return maxIndex
}

export async function saveXml(date: string, transactions: Transaction[], accountIBAN: string, accountCurrency: string) {
    const index = getNextIndex(accountIBAN, accountCurrency, date) + 1

    const {rootNode} = getRoot();

    addGroupHeader(rootNode);
    addStmt(rootNode, index, transactions, accountIBAN, accountCurrency);

    const xml = rootNode.end({ pretty: true });

    const filename = index + ".xml";
    const fullPath = path.resolve(getFolder(accountIBAN, accountCurrency, date), filename)

    fs.writeFileSync(fullPath, xml);
    fs.copyFileSync('./camt.053.001.02.xsd', path.resolve(getFolder(accountIBAN, accountCurrency, date), 'camt.053.001.02.xsd'))
}