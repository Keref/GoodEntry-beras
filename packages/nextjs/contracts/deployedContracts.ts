/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    TokenController: {
      address: "0x01c1def3b91672704716159c9041aeca392ddffb",
      abi: [
        {
          type: "constructor",
          inputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "TOTAL_SUPPLY",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "balances",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "baseBalance",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "quoteBalance",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "buy",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "minBoughtTokens",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "baseAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "buyTicket",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "payout",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "strike",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "claim",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "payout",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "createToken",
          inputs: [
            {
              name: "name",
              type: "string",
              internalType: "string",
            },
            {
              name: "symbol",
              type: "string",
              internalType: "string",
            },
            {
              name: "desc",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "baseAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "dailyJackpot",
          inputs: [
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "dailyVolumeLeaders",
          inputs: [
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "depositJackpots",
          inputs: [],
          outputs: [],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "distributeDailyJackpot",
          inputs: [
            {
              name: "round",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "distributeHourlyJackpot",
          inputs: [
            {
              name: "_hhour",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "winner",
              type: "address",
              internalType: "address",
            },
            {
              name: "jackpot",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "distributeJackpots",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "getAmountSale",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "baseAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "quoteAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getBuyAmount",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "quoteAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "buyAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getDailyVolumeLeaders",
          inputs: [
            {
              name: "_day",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "leaders",
              type: "address[5]",
              internalType: "address[5]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getLastTokens",
          inputs: [],
          outputs: [
            {
              name: "lastTokens",
              type: "address[]",
              internalType: "address[]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getLotterySettings",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "round",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "strike",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "payoutPerTicket",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "totalOI",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getMcap",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "mcap",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getPrice",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "price",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getTokenDailyVolume",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "_day",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "volume",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getTokenHourlyVolume",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "_hhour",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "volume",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getTokensLength",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getUserLotteryPayout",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "round",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "userPayout",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "hhour",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "hourlyJackpot",
          inputs: [
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "hourlyVolumeLeader",
          inputs: [
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "isDistributedDailyJackpot",
          inputs: [
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "isDistributedHourlyJackpot",
          inputs: [
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "isLotteryRunning",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "lotteryThreshold",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "mcapToAmm",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "owner",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "renounceOwnership",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "sell",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "baseAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "quoteAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "setLotteryRunning",
          inputs: [
            {
              name: "isRunning",
              type: "bool",
              internalType: "bool",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "setLotteryThreshold",
          inputs: [
            {
              name: "_lotteryThreshold",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "setMcapToAmm",
          inputs: [
            {
              name: "_mcapToAmm",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "setSlope",
          inputs: [
            {
              name: "_slope",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "setTradingFees",
          inputs: [
            {
              name: "_tradingFee",
              type: "uint16",
              internalType: "uint16",
            },
            {
              name: "_treasuryFee",
              type: "uint16",
              internalType: "uint16",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "setTreasury",
          inputs: [
            {
              name: "_treasury",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "slope",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "tickers",
          inputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "today",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "tokenDailyCloses",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "tokenDailyLotterySettings",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "strike",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "payoutPerTicket",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "totalOI",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "tokenDailyLotteryUserBalances",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "tokenDailyVolume",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "tokenHourlyVolume",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
            {
              name: "",
              type: "uint32",
              internalType: "uint32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "tokens",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "tradingFee",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint16",
              internalType: "uint16",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "transferOwnership",
          inputs: [
            {
              name: "newOwner",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "treasury",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "treasuryFee",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint16",
              internalType: "uint16",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "event",
          name: "HourlyJackpot",
          inputs: [
            {
              name: "token",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "jackpot",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "volume",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "LasBuyas",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "token",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "quoteAmount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "LasCreationas",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "token",
              type: "address",
              indexed: true,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "LasSellas",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "token",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "quoteAmount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "LasTicketas",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "token",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "round",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "OwnershipTransferred",
          inputs: [
            {
              name: "previousOwner",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "newOwner",
              type: "address",
              indexed: true,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "SetLotteryThreshold",
          inputs: [
            {
              name: "lotteryThreshold",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "SetMcapToAmm",
          inputs: [
            {
              name: "mcapToAmm",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "SetSlope",
          inputs: [
            {
              name: "slope",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "SetTradingFees",
          inputs: [
            {
              name: "tradingFee",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "treasuryFee",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "SetTreasury",
          inputs: [
            {
              name: "treasury",
              type: "address",
              indexed: false,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "WinningClaim",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "token",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {
        owner: "node_modules/@openzeppelin/contracts/access/Ownable.sol",
        renounceOwnership: "node_modules/@openzeppelin/contracts/access/Ownable.sol",
        transferOwnership: "node_modules/@openzeppelin/contracts/access/Ownable.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
