import { XMLNode } from "xmlbuilder";
import { Transaction } from "../types";
import { addAccount } from "./addAccount";
import { addBalance } from "./addBalance";
import { addEntry } from "./addEntry";
import { getStrippedId } from "./common";
import moment from "moment";

export async function addStmt(
  node: XMLNode,
  index: number,
  data: Transaction[],
  accountIBAN: string,
  accountCurrency: string,
) {
  const stmt = node.ele("Stmt");

  const { balance: startBalance } = data[data.length - 1];
  const { balance: endBalance, amount, completed_at: completedAt } = data[0];

  stmt
    .ele("Id", getStrippedId())
    .up()
    .ele("ElctrncSeqNb", index)
    .up()
    .ele("LglSeqNb", index)
    .up()
    .ele("CreDtTm", moment(completedAt).toISOString())
    .up();

  addAccount(stmt, accountIBAN || "", accountCurrency);
  addBalance(stmt, "OPBD", accountCurrency, endBalance + amount, completedAt);
  addBalance(stmt, "CLAV", accountCurrency, startBalance, completedAt);

  for (const item of data) {
    addEntry(stmt, item);
  }
}
