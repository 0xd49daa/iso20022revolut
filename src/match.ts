import fs from "fs";
import { processPayments } from "./common";
import { groupBy } from "lodash";
import * as csv from "@fast-csv/parse";
import path from "path";
import { saveXml } from "./xml/file";
import { GrouppedRow, Row, Transaction } from "./types";
import { STATEMENT_FIELDS } from "./constants";
import assert from "node:assert";

const XML_DIR = "./input/xml/";
const CSV_DIR = "./input/csv/";
const HELP_MESSAGE =
  "Provide required arguments `yarn run match SI56...12 EUR`";

export async function matchPayments() {
  const accountIBAN = process.argv[2];
  const accountCurrency = process.argv[3];

  assert.ok(accountIBAN, HELP_MESSAGE);
  assert.ok(accountCurrency, HELP_MESSAGE);

  const payments = await loadAndGroupPayments();
  const statementItems = await proccessStatements();

  let failedToMatch = 0;
  let matched = 0;

  for (const [date, items] of Object.entries(statementItems)) {
    const transactions = [];

    for (const item of items) {
      const balance = Number.parseFloat(item[STATEMENT_FIELDS.BALANCE]);
      const amount = Number.parseFloat(item[STATEMENT_FIELDS.AMOUNT]);

      const payment = payments?.[date]?.find(
        (p) =>
          p.IBAN === item[STATEMENT_FIELDS.IBAN] &&
          Math.abs(Number.parseFloat(p.amount)) === Math.abs(amount)
      );

      if (amount === -61.2) {
        console.log(item, payment)
      }

      if (!item[STATEMENT_FIELDS.AMOUNT]) {
        continue;
      }

      transactions.push({
        balance,
        amount,
        completed_at: item[STATEMENT_FIELDS.DATE_COMPLETED],
        currency: item[STATEMENT_FIELDS.CURRENCY],
        ID: item[STATEMENT_FIELDS.ID],
        reference: payment?.internalReference,
        description: item[STATEMENT_FIELDS.REFERENCE],
        IBAN: item[STATEMENT_FIELDS.IBAN],
        name: item[STATEMENT_FIELDS.DESCRIPTION],
      } as Transaction);

      if (!payment) {
        failedToMatch++;
        continue;
      }

      matched++;
    }
    
    if (date && transactions.length) {
      saveXml(date, transactions, accountIBAN, accountCurrency);
    }
  }

  console.log("Matched: ", matched, " failed to match: ", failedToMatch);

  // payments
  // {
  //   "date": [
  //       {
  //         "name": "Alesia Abramova",
  //         "recipientType": "INDIVIDUAL",
  //         "IBAN": "SI56020413818062298",
  //         "BIC": "LJBASI2X",
  //         "bankCountry": "SI",
  //         "currency": "EUR",
  //         "amount": 1131.02,
  //         "reference": "Placa (11/22) Alesia Abramova",
  //         "date": "2022-12-05",
  //         "internalReference": "RF60512510"
  //     }
  //   ]
  // }

  // statement
  // {
  //   "Date started (UTC)": "2022-01-03",
  //   "Date completed (UTC)": "2022-01-03",
  //   "ID": "61d2c9de-5937-a705-913d-e9c0c7b53fa1",
  //   "Type": "TRANSFER",
  //   "Description": "To RS PREHODNI DAVČNI PODRAČUN",
  //   "Reference": "SI1988305848-44008",
  //   "Payer": "Ivan Selchenkov",
  //   "Card number": "",
  //   "Orig currency": "EUR",
  //   "Orig amount": "669.08",
  //   "Payment currency": "EUR",
  //   "Amount": "-669.08",
  //   "Fee": "0.00",
  //   "Balance": "20893.57",
  //   "Account": "EUR Main",
  //   "Beneficiary account number": "",
  //   "Beneficiary sort code or routing number": "",
  //   "Beneficiary IBAN": "SI56011008882000003",
  //   "Beneficiary BIC": "BSLJSI2XXXX"
  // }

  // console.log(JSON.stringify(payments, null, 4))
}

async function loadAndGroupPayments() {
  const files = await fs.promises.readdir(XML_DIR);
  const payments = await Promise.all(
    files.map((file) => processPayments(path.resolve(XML_DIR, file)))
  );
  const flat = payments.flat();

  return groupBy(flat, (payment) => payment.date);
}

async function proccessStatements(): Promise<GrouppedRow> {
  const files = await fs.promises.readdir(CSV_DIR);

  const items = await Promise.all(
    files.map((file): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        const rows: Row[] = [];

        fs.createReadStream(path.resolve(CSV_DIR, file))
          .pipe(csv.parse({ headers: true }))
          .on("error", (error) => reject(error))
          .on("data", (row) => rows.unshift(row))
          .on("end", () => resolve(rows));
      });
    })
  );

  const flat = items.flat();
  return groupBy(flat, (payment) => payment[STATEMENT_FIELDS.DATE_COMPLETED]);
}

matchPayments();
