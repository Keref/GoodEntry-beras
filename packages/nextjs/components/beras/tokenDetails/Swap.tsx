"use client";

import { useState } from "react";
import { formatEther, maxUint256, parseEther } from "viem";
import { useAccount } from "wagmi";
import { BugAntIcon } from "@heroicons/react/24/outline";
import { Card } from "~~/components/Card";
import { useWatchBalance } from "~~/hooks/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const Swap = ({ tokenAddress }: { tokenAddress: string }) => {
  const { targetNetwork } = useTargetNetwork();
  const [activeTab, setActiveTab] = useState<string>("buy");
  const { address: connectedAddress } = useAccount();
  const [amount, setAmount] = useState("0");
  const { data: balance } = useWatchBalance({ address: connectedAddress });
  const formattedBalance = balance ? Number(formatEther(balance.value)) : 0;

  const { data: tokenSymbol } = useScaffoldReadContract({
    contractName: "Token",
    functionName: "symbol",
    address: tokenAddress,
  });

  const { data: tokenBalance } = useScaffoldReadContract({
    contractName: "Token",
    functionName: "balanceOf",
    address: tokenAddress,
    args: [connectedAddress],
    watch: true,
  });

  const { data: tokenControllerData } = useDeployedContractInfo("TokenController");
  const { writeContractAsync: tokenController, isMining: isTxing } = useScaffoldWriteContract("TokenController");
  const { writeContractAsync: token, isMining: isApproving } = useScaffoldWriteContract("Token", tokenAddress);

  const { data: tokenAllowance } = useScaffoldReadContract({
    contractName: "Token",
    functionName: "allowance",
    address: tokenAddress,
    args: [connectedAddress, tokenControllerData?.address],
    watch: true,
  });

  return (
    <>
      <div className="flex flex-grow items-center flex-col">
        <Card title="Swap" className="flex-grow w-96">
          <div className="flex flex-col justify-center gap-4 ">
            <div className="flex flex-row">
              <button
                className={`w-2/4 p-2 ${activeTab == "buy" ? "bg-green-200" : ""}`}
                onClick={() => {
                  setActiveTab("buy");
                }}
              >
                Buy
              </button>
              <button
                className={`w-2/4 p-2 ${activeTab == "sell" ? "bg-red-200" : ""}`}
                onClick={() => {
                  setActiveTab("sell");
                }}
              >
                Sell
              </button>
            </div>
            <div className="float-right">
              {activeTab == "buy" ? (
                <>
                  {formattedBalance.toFixed(4)} {targetNetwork.nativeCurrency.symbol}
                </>
              ) : (
                <>
                  {formatEther(tokenBalance || BigInt(0))} {tokenSymbol}
                </>
              )}
            </div>

            <input type="text" className="grow" value={amount} onChange={e => setAmount(e.target.value)} />

            <button
              className="h-10 btn btn-secondary btn-sm px-2 w-full"
              onClick={async () => {
                if (activeTab == "buy")
                  await tokenController({
                    functionName: "buy",
                    args: [tokenAddress, BigInt(0)],
                    value: parseEther(amount),
                  });
                else {
                  if (!tokenAllowance || tokenAllowance < parseEther(amount)) {
                    await token({
                      functionName: "approve",
                      args: [tokenControllerData?.address || "0x", maxUint256],
                    });
                  }
                  await tokenController({
                    functionName: "sell",
                    args: [tokenAddress, parseEther(amount)],
                  });
                }
              }}
              disabled={isTxing || isApproving}
            >
              {!isTxing ? (
                <BugAntIcon className="h-4 w-4" />
              ) : (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              <span>
                {activeTab == "buy"
                  ? "Buy"
                  : !tokenAllowance || tokenAllowance < parseEther(amount)
                  ? "Approve"
                  : "Sell"}
              </span>
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};