"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const config_1 = require("@nestjs/config");
const accounts_1 = require("viem/accounts");
let AppService = class AppService {
    constructor(configService) {
        this.configService = configService;
        const deployerPrivateKey = this.configService.get('PRIVATE_KEY');
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: chains_1.sepolia,
            transport: (0, viem_1.http)(this.configService.get('RPC_ENDPOINT_URL')),
        });
        this.account = (0, accounts_1.privateKeyToAccount)(`0x${deployerPrivateKey}`);
        this.walletClient = (0, viem_1.createWalletClient)({
            account: (0, accounts_1.privateKeyToAccount)(`0x${process.env.PRIVATE_KEY}`),
            chain: chains_1.sepolia,
            transport: (0, viem_1.http)(process.env.RPC_ENDPOINT_URL),
        });
    }
    getHello() {
        return 'Hello There!';
    }
    getTestBack() {
        return 'Hello Group4/5!';
    }
    async getServerWalletAddress() {
        console.log(this.walletClient.account.address);
        return this.walletClient.account.address;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map