"use client";

import Image from "next/image";
import Link from "next/link";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className=" navbar bg-primary h-14 md:border-b-[1px] md:border-b-base-200 min-h-0 flex-shrink-0 justify-between z-20 px-0 md:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <Link href="/" passHref className="lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="pepetuals logo" className="cursor-pointer" fill src="/goodentry.png" />
          </div>
        </Link>
      </div>
      <div className="navbar-end md:pr-8 pr-4">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
