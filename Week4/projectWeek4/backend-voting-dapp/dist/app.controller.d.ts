import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getTestBack(): {
        result: string;
    };
    getServerWalletAddress(): {
        result: Promise<any>;
    };
}
