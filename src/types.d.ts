export interface PostalAddress {
    StrtNm: string;
    BldgNb: string;
    PstCd: string;
    TwnNm: string;
    Ctry: string;
}

export interface PartyDefinition {
    Nm: string
    PstlAdr: PostalAddress;
}

export interface GrpHdrJSON {
    MsgId: string
    CreDtTm: string
    NbOfTxs: number
    CtrlSum: number
    InitgPty: PartyDefinition
}

export interface Account {
    Id:  { IBAN: string }, Ccy: string
}

export interface CounterParty {
    Nm: string
    Acct: Account
}

export interface PmtInfJSON {
    PmtInfId?: any;
    PmtMtd: 'TRF' | 'TRA' | 'CHK';
    BtchBookg?: boolean;
    ReqdExctnDt?: string
    Dbtr: PartyDefinition;
    DbtrAcct: Account;
    DbtrAgt: { FinInstnId: { BIC: string } }
    CdtTrfTxInf: {
        PmtId: {
            EndToEndId: string
        },
        Amt: {
            InstdAmt: string
        }
        Purp: {
            Cd: string
        }
        CdtrAgt: {
            FinInstnId: {
                BIC: string
            }
        }
        Cdtr: PartyDefinition
        CdtrAcct: Account
        RmtInf: {
            Strd: {
                CdtrRefInf: {
                    Ref: string
                },
                AddtlRmtInf: string
            }
        }
    }
}

export interface CstmrCdtTrfInitnJSON {
    GrpHdr: GrpHdrJSON
    PmtInf: PmtInfJSON[]
}

export interface DocumentJSON {
    CstmrCdtTrfInitn: CstmrCdtTrfInitnJSON
}

export interface ISO20022JSON {
    Document: DocumentJSON
}

export interface PlainPaymentInput {
    name: string
    recipientType: 'INDIVIDUAL' | 'COMPANY'
    IBAN: string
    BIC: string
    bankCountry: string
    currency: string
    amount: string
    reference: string
    date: string
    internalReference: string
}

export interface PlainTransaction {
    id: string,
    index?: number,
    type: TransactionType,
    request_id: string,
    state: TransactionState,
    created_at: string;
    updated_at: string;
    completed_at?: string;
    reference: string,
    account_id: string,
    amount: number,
    currency: string,
    description: string,
    balance: number,
    leg_id: string,
    exported: boolean,
    exported_at?: string;
}

export interface CompletedPlainTransaction extends PlainTransaction {
    completed_at: string;
    index: number;
}

export interface Transaction {
    balance: number
    amount: number
    completed_at: string
    currency: string
    ID: string
    reference: string
    description: string
    IBAN: string
    name: string
}

export interface Row {
    [key: string]: string
}

export interface GrouppedRow {
    [key: string]: Row[]
}