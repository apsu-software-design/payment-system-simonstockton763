import readlineSync = require('readline-sync'); //for easier repeated prompts

export class PaymentSystemExecutor {
    private readd: () => string[];
    private validate: (creds: string[]) => boolean;
    private psc !: PaymentSystemContext;

    constructor(engine: () => string[],
        payload: (creds:string[]) => boolean) {
        this.readd = engine;
        this.validate = payload;
    }
    build(): void {
        this.psc = new PaymentSystemContext(this.readd,this.validate);
    }
    getPSC(): PaymentSystemContext {
        return this.psc;
    }
}

export class PaymentSystemContext {
    private paymentCreds: () => string[];
    private validation: (creds:string[]) => boolean;

    constructor(engine: () => string[],
        payload: (creds: string[]) => boolean) {
        this.paymentCreds = engine;
        this.validation = payload;
    }

    encryptandrun(): void {
        if (this.validation(this.paymentCreds())) {
            console.log("Your payment information is being encrypted.");
            console.log("The payment is being processed.");
        }
        else {
            console.log('The payment is invalid.');
        }
    }

}
export function strategy(payType: string): void {
    let payment !: PaymentSystemExecutor;

    switch (payType) {
        case "CreditCard" :  payment = new PaymentSystemExecutor( CreditCardreadData, CreditCardvalidate); break;
        case "BankDraft"  :  payment = new PaymentSystemExecutor( BankDraftreadData , BankDraftvalidate) ; break;
        case "Online"     :  payment = new PaymentSystemExecutor( OnlinereadData    , Onlinevalidate)    ; break;
        case "Offline"    :  payment = new PaymentSystemExecutor( OfflinereadData   , Offlinevalidate)   ; break;
        default: console.log('Code Error!!!');
    }
    payment.build();
    payment.getPSC().encryptandrun();
}




function CreditCardreadData(): string[] {
    let paymentCreds: string[] = [];
    paymentCreds.push( readlineSync.question('  Name: '));
    paymentCreds.push( readlineSync.question('  Credit Card Number: '));
    paymentCreds.push( readlineSync.question('  Credit Card Expiration Date (MM/DD): '));
    return paymentCreds;
}

function CreditCardvalidate(paymentCreds: string[]): boolean {
    return (/^[\w.' ]+$/.test(paymentCreds[0]) && /\d{15,16}/.test(paymentCreds[1]) && /\d\d\/\d\d/.test(paymentCreds[2]));
}



function BankDraftreadData(): string[] {
    let paymentCreds: string[] = [];
    paymentCreds.push( readlineSync.question('  Name: '));
    paymentCreds.push( readlineSync.question('  Bank Routing Number: '));
    paymentCreds.push( readlineSync.question('  Bank Account Number: '));
    return paymentCreds;
}

function BankDraftvalidate(paymentCreds: string[]): boolean {
    return (/^[\w.' ]+$/.test(paymentCreds[0]) && /\d{9}/.test(paymentCreds[1]) && /\d{6,12}/.test(paymentCreds[2]));
}



function OnlinereadData(): string[] {
    let paymentCreds: string[] = [];
    paymentCreds.push( readlineSync.question('  Enter Your Email Address: '));
    paymentCreds.push(readlineSync.question('  Enter Your Payment Password: '));
    return paymentCreds;
}

function Onlinevalidate(paymentCreds: string[]): boolean {
    return (/^[\w@.]+$/.test(paymentCreds[0]) && /\w+/.test(paymentCreds[1]));
}


function OfflinereadData(): string[]{
    let paymentCreds: string[] = [];
    paymentCreds.push( readlineSync.question('  Name: '));
    paymentCreds.push(readlineSync.question('  Enter Your Billing Address: '));
    return paymentCreds;
}

function Offlinevalidate(paymentCreds: string[]): boolean {
    return (/^[\w.' ]+$/.test(paymentCreds[0]) && /^[\w.' ]+$/.test(paymentCreds[1]));
}


