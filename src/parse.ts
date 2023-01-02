import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import { ISO20022JSON, PmtInfJSON } from "./types";
import * as csv from '@fast-csv/format';
import { strict as assert } from 'node:assert';

const HEADER = {
  NAME: 'Name',
  RECIPIENT_TYPE: 'Recipient type',
  IBAN: 'IBAN',
  BIC: 'BIC',
  COUNTRY: 'Recipient bank country',
  CURRENCY: 'Currency',
  AMOUNT: 'Amount',
  REF: 'Payment reference'
}

async function run() {
  const filename = process.argv[2]

  if (!filename) {
    assert(!!filename, 'yarn run parse input.xml')
  }

  const json = await parseFile(filename);

  await processPayments(filename, json)
}

async function parseFile(filename: string): Promise<ISO20022JSON> {
  const parser = new XMLParser();
  const data = await fs.promises.readFile(filename);
  return parser.parse(data) as ISO20022JSON;
}

async function processPayments(filename: string, json: ISO20022JSON): Promise<void> {
  return new Promise(async (resolve, reject) => {
    console.log('json', json)

    const payments = json.Document.CstmrCdtTrfInitn.PmtInf;

    const csvStream = csv.format({ headers: true });
    const fStream = fs.createWriteStream(filename + '.csv')

    csvStream.pipe(fStream)
      .on('error', reject)
      .on('end', () => { 
        fStream.end()
        resolve() 
      });
  
    for (const payment of payments) {
      csvStream.write(await csvRow(payment));
    }
  
    csvStream.end();
  })
}

async function csvRow(payment: PmtInfJSON) {
  const name = payment.CdtTrfTxInf.Cdtr.Nm
  const recipientType = ['SALA', 'PRCP', 'RENT'].includes(payment.CdtTrfTxInf.Purp.Cd) ?
    'INDIVIDUAL': 'COMPANY'
  const IBAN = payment.CdtTrfTxInf.CdtrAcct.Id.IBAN
  const BIC = payment.CdtTrfTxInf.CdtrAgt.FinInstnId.BIC
  const bankCountry = payment.CdtTrfTxInf.Cdtr.PstlAdr.Ctry
  const currency = payment.DbtrAcct.Ccy || "EUR";

  const amount = payment.CdtTrfTxInf.Amt.InstdAmt
  const reference = ['SALA', 'PRCP', 'RENT'].includes(payment.CdtTrfTxInf.Purp.Cd) ?
    payment.CdtTrfTxInf.RmtInf.Strd.AddtlRmtInf:
    payment.CdtTrfTxInf.RmtInf.Strd.CdtrRefInf.Ref

  return {
    [HEADER.NAME]: name,
    [HEADER.RECIPIENT_TYPE]: recipientType,
    [HEADER.IBAN]: IBAN,
    [HEADER.BIC]: BIC,
    [HEADER.COUNTRY]: bankCountry,
    [HEADER.CURRENCY]: currency,
    [HEADER.AMOUNT]: amount,
    [HEADER.REF]: reference
  }
}

run();
