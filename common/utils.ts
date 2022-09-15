import { HardhatNetworkConfig, NetworkConfig, HardhatNetworkAccountConfig } from 'hardhat/types';

export const Sleep = (ms: number) => {
    return new Promise(resole => setTimeout(resole, ms));
}

export const NetworkAccounts = (config: NetworkConfig): string[] => {
    const accounts = ((config as HardhatNetworkConfig).accounts as HardhatNetworkAccountConfig[]);
    return accounts as any as string[];
}

export const Contracts = (network: string) => {
    let ContractAddress, NFTAddress;
    switch (network) {
        case 'mainnet':
            ContractAddress = '0';
            NFTAddress = '0x2B09d47D550061f995A3b5C6F0Fd58005215D7c8'
            break;
        default:
            ContractAddress = '0';
            NFTAddress = '0';
    }
    return { ContractAddress, NFTAddress };
}