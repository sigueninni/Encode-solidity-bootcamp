import { ConfigService } from '@nestjs/config';
export declare class AppService {
    private configService;
    publicClient: any;
    walletClient: any;
    account: any;
    constructor(configService: ConfigService);
    getHello(): string;
    getTestBack(): string;
    getServerWalletAddress(): Promise<any>;
    N: any;
}
