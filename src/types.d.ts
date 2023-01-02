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
    Id:  { IBAN: string }, Ccy?: string
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
            InstdAmt: number
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