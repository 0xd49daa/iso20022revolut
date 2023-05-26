import * as csv from '@fast-csv/format';
import fs from "fs";
import { strict as assert } from 'node:assert';
import { processPayments } from "./common";
import { PlainPaymentInput } from "./types";

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

  await convertToCsv(filename)
}

function mapToCsv(input: PlainPaymentInput) {
  return {
    [HEADER.NAME]: input.name,
    [HEADER.RECIPIENT_TYPE]: input.recipientType,
    [HEADER.IBAN]: input.IBAN,
    [HEADER.BIC]: input.BIC,
    [HEADER.COUNTRY]: input.bankCountry,
    [HEADER.CURRENCY]: input.currency,
    [HEADER.AMOUNT]: input.amount,
    [HEADER.REF]: input.reference
  }
}

async function convertToCsv(filename: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const csvStream = csv.format({ headers: true });
    const fStream = fs.createWriteStream(filename + '.csv')

    csvStream.pipe(fStream)
      .on('error', reject)
      .on('end', () => { 
        fStream.end()
        resolve() 
      });
  
    const plainPayments = await processPayments(filename)

    for (const payment of plainPayments) {
      csvStream.write(mapToCsv(payment));
    }
  
    csvStream.end();
  })
}

run();
