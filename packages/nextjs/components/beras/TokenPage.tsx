import {
  useState,
  /*, useEffect*/
} from "react";
// import { TokenCard } from "~~/components/beras/TokenCard";
import { TokenDetailsCard } from "~~/components/beras/TokenDetailsCard";
import { BuyLotteryTickets } from "~~/components/beras/tokenDetails/BuyLotteryTickets";
import { ChartLWC } from "~~/components/beras/tokenDetails/ChartLWC";
import { Swap } from "~~/components/beras/tokenDetails/Swap";
import { TransactionHistory } from "~~/components/beras/tokenDetails/TransactionHistory";

export const TokenPage = ({ tokenAddress }: { tokenAddress: string }) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <>
      <div role="tablist" className="md:hidden tabs tabs-boxed border-[1px] bg-base-100 rounded-[4px]">
        <a
          role="tab"
          className={`tab !rounded-[4px] border-[1px]   ${
            activeTab == 0 ? "tab-active !text-accent !border-accent" : "text-neutral !border-primary"
          }`}
          onClick={() => {
            setActiveTab(0);
          }}
        >
          Chart
        </a>
        <a
          role="tab"
          className={`tab !rounded-[4px] border-[1px] ${
            activeTab == 1 ? "tab-active !text-accent !border-accent" : "text-neutral !border-primary"
          }`}
          onClick={() => {
            setActiveTab(1);
          }}
        >
          Trade
        </a>
      </div>
      <div className="flex flex-row min-h-full w-full">
        <div className={`${activeTab == 0 ? "block" : "hidden"} md:block md:w-2/3 w-full min-h-full md:pl-5 md:pt-5`}>
          <ChartLWC tokenAddress={tokenAddress} />
          <TransactionHistory tokenAddress={tokenAddress} />
        </div>
        <div className={`${activeTab == 1 ? "block" : "hidden"} w-full max-w-[400px] md:block md:pt-5 md:p-4`}>
          <Swap tokenAddress={tokenAddress} />
          <BuyLotteryTickets tokenAddress={tokenAddress} />
          <TokenDetailsCard tokenAddress={tokenAddress} />
        </div>
      </div>
    </>
  );
};
