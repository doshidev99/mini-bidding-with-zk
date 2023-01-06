import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { goerli, fantomTestnet, polygonMumbai, bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const getTestNetChain = () => {
  return [
    {
      id: 97,
      name: "Binance Smart Chain Testnet",
      network: "bsc-testnet",
      nativeCurrency: {
        name: "BNB Testnet",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: {
        default: "https://bsc-testnet.public.blastapi.io",
        public: "https://bsc-testnet.public.blastapi.io",
      },
      blockExplorers: {
        etherscan: {
          name: "BSCscan",
          url: "https://testnet.bscscan.com",
        },
        default: {
          name: "BSCscan",
          url: "https://testnet.bscscan.com",
        },
      },
      multicall: {
        address: "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C",
        blockCreated: 10299530,
      },
      testnet: true,
    },

    {
      id: 5,
      name: "Goerli test networkt",
      network: "Goerli-testnet",
      nativeCurrency: {
        name: "GoerliETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: "https://goerli.infura.io/v3/",
        public: "https://goerli.infura.io/v3/",
      },
      blockExplorers: {
        etherscan: {
          name: "etherscan",
          url: "https://goerli.etherscan.io",
        },
        default: {
          name: "etherscan",
          url: "https://goerli.etherscan.io",
        },
      },
      multicall: {
        address: "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C",
        blockCreated: 10299530,
      },
      testnet: true,
    },
  ];
};

const { chains, provider, webSocketProvider } = configureChains(
  [
    // @ts-ignore
    ...[bscTestnet, fantomTestnet, polygonMumbai],
    // ...(process.env.NODE_ENV === "development" ? [bscTestnet] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Mini game",
  chains,
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export { chains };
