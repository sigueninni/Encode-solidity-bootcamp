import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, http, formatUnits, createWalletClient, parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
  publicClient;
  walletClient;
  account;

  constructor(private configService: ConfigService) {

    const deployerPrivateKey = this.configService.get<string>('PRIVATE_KEY');

    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
    });

    this.account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    this.walletClient = createWalletClient({
      account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });
  }

  getHello(): string {
    return 'Hello There!';
  }


  getTestBack(): string {
    return 'Hello Group4/5!';
  }

  async getServerWalletAddress() {
    console.log(this.walletClient.account.address);
    return this.walletClient.account.address;
  }
  N

}
