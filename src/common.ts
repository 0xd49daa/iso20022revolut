import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import { ISO20022JSON, PlainPaymentInput, PmtInfJSON } from "./types";

function plainPayment(payment: PmtInfJSON): PlainPaymentInput {
  const name = payment.CdtTrfTxInf.Cdtr.Nm;
  const recipientType = ["SALA", "PRCP", "RENT"].includes(
    payment.CdtTrfTxInf.Purp.Cd
  )
    ? "INDIVIDUAL"
    : "COMPANY";
  const IBAN = payment.CdtTrfTxInf.CdtrAcct.Id.IBAN;
  const BIC = payment.CdtTrfTxInf.CdtrAgt.FinInstnId.BIC;
  const bankCountry = payment.CdtTrfTxInf.Cdtr.PstlAdr.Ctry;
  const currency = payment.DbtrAcct.Ccy || "EUR";

  const amount = payment.CdtTrfTxInf.Amt.InstdAmt;
  const reference = ["SALA", "PRCP", "RENT"].includes(
    payment.CdtTrfTxInf.Purp.Cd
  )
    ? payment.CdtTrfTxInf.RmtInf.Strd.AddtlRmtInf
    : payment.CdtTrfTxInf.RmtInf.Strd.CdtrRefInf.Ref;
  const date = payment.ReqdExctnDt || "no-date";
  const internalRef = payment.CdtTrfTxInf.PmtId.EndToEndId;

  return {
    name,
    recipientType,
    IBAN,
    BIC,
    bankCountry,
    currency,
    amount,
    reference,
    date,
    internalReference: internalRef,
  };
}

export async function processPayments(
  filename: string
): Promise<PlainPaymentInput[]> {
    console.log('Process file: ', filename)

    const json = await parseFile(filename)
    const payments = json.Document.CstmrCdtTrfInitn.PmtInf;
    const output: PlainPaymentInput[] = []

    for (const payment of payments) {
      output.push(plainPayment(payment));
    }

    return output
}

async function parseFile(filename: string): Promise<ISO20022JSON> {
  const parser = new XMLParser();
  const data = await fs.promises.readFile(filename);
  return parser.parse(data) as ISO20022JSON;
}
