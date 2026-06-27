declare module 'midtrans-client' {
  interface SnapConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }

  interface TransactionParameter {
    transaction_details: TransactionDetails;
    credit_card?: { secure: boolean };
    customer_details?: CustomerDetails;
    [key: string]: any;
  }

  interface TransactionResult {
    token: string;
    redirect_url?: string;
    [key: string]: any;
  }

  class Snap {
    constructor(config: SnapConfig);
    createTransaction(parameter: TransactionParameter): Promise<TransactionResult>;
    transaction: {
      notification(body: any): Promise<any>;
    };
  }

  class CoreApi {
    constructor(config: SnapConfig);
    transaction: {
      notification(body: any): Promise<any>;
    };
  }
}
