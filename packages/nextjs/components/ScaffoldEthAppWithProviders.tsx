"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import {
  ChatBubbleBottomCenterIcon,
  ChatBubbleLeftIcon,
  FaceSmileIcon,
  HomeIcon,
  PlusCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";
import { Header } from "~~/components/Header";
import { AuthenticatedChat } from "~~/components/beras/chat/AuthenticatedChat";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  // @ts-ignore
  const address = session?.address;

  const [showChat, setShowChat] = useState<boolean>(false);
  const [hideWebChat, setHideWebChat] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <>
      <div className="relative flex flex-col min-h-screen bg-primary">
        <div className="fixed top-0 left-0 right-0 z-[100] border-b-[1px] border-base-100 mb-1 bg-primary">
          <Header />
        </div>
        <div className="fixed top-0 left-0 right-0 z-[100] border-b-[1px] border-base-100 mb-1 bg-primary">
          <Header />
          <div className="md:hidden w-full h-14 px-2 mb-1">
            <div className=" flex justify-between items-center w-full z-10 bottom-0 left-0 right-0 pointer-events-none ">
              <div className="flex flex-row w-full pointer-events-auto h-14">
                <Link
                  href="/"
                  passHref
                  className={`flex flex-col w-1/5 basis-1/5 text-base-300 items-center py-1 px-6 ${
                    pathname == "/" && !showChat
                      ? "card bg-base-100 !text-accent border-[1px] border-accent rounded-[4px]"
                      : ""
                  }`}
                  onClick={() => {
                    setShowChat(false);
                  }}
                >
                  <HomeIcon className=" mb-1" />
                  <span className="text-xs font-bold">Home</span>
                </Link>
                <Link
                  href="/create"
                  passHref
                  className={`flex flex-col w-1/5 basis-1/5 text-base-300 items-center py-1 px-6 ${
                    pathname == "/create" && !showChat
                      ? "card bg-base-100 !text-accent border-[1px] border-accent rounded-[4px]"
                      : ""
                  }`}
                  onClick={() => {
                    setShowChat(false);
                  }}
                >
                  <PlusCircleIcon className="mb-1" />
                  <span className="text-xs font-bold">Create</span>
                </Link>
                <Link
                  href="/jackpot"
                  className={`flex flex-col w-1/5 basis-1/5 text-base-300 items-center py-1 px-6 ${
                    pathname == "/jackpot" && !showChat
                      ? "card bg-base-100 !text-accent border-[1px] border-accent rounded-[4px]"
                      : ""
                  } `}
                >
                  <TrophyIcon className="mb-1" />
                  <span className="text-xs font-bold">Jackpot</span>
                </Link>
                <Link
                  href={`/profile/${address}`}
                  className={`flex flex-col w-1/5 basis-1/5 text-base-300 items-center py-1 px-6 ${
                    pathname.includes("/profile") && !showChat
                      ? "card bg-base-100 !text-accent border-[1px] border-accent rounded-[4px]"
                      : ""
                  }`}
                  onClick={() => {
                    setShowChat(false);
                  }}
                >
                  <FaceSmileIcon className="mb-1" />
                  <span className="text-xs font-bold">Profile</span>
                </Link>
                <div
                  onClick={() => {
                    setShowChat(true);
                  }}
                  className={`flex flex-col w-1/5 basis-1/5 text-base-300 items-center py-1 px-6 ${
                    showChat ? "card bg-base-100 !text-accent border-[1px] border-accent rounded-[4px]" : ""
                  }`}
                >
                  <ChatBubbleBottomCenterIcon className="mb-1" />
                  <span className="text-xs font-bold">Chat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <main
          className={`relative flex flex-row flex-1 md:mt-14 mt-28 mb-14 ${
            hideWebChat ? "md:w-full" : "md:w-[calc(100vw-330px)]"
          } md:p-5`}
        >
          <div
            className={`${showChat ? "hidden" : ""} mx-auto max-w-screen-2xl md:block w-full flex flex-col md:p-0 p-2`}
          >
            {children}
          </div>
          {!hideWebChat ? (
            <div
              className={`${
                showChat ? "" : "hidden"
              } md:block fixed top-14 bg-base-100 right-0 h-[calc(100vh-56px)] md:w-[320px] w-full`}
            >
              <div className="md:flex hidden flex-row h-8 w-full pl-2 py-1 bg-primary">
                <button
                  onClick={() => {
                    setHideWebChat(true);
                  }}
                  title="Hide Chat"
                  className="hover:bg-base-100 text-base-300 px-2 rounded-[1rem] flex flex-row items-center"
                >
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                  <span>Enough of this nonsense</span>
                </button>
              </div>
              <AuthenticatedChat />
            </div>
          ) : (
            <div
              title="Click to show chat"
              className="w-8 h-8 border-[1px] border-accent rounded-[1rem] p-2 cursor-pointer"
            >
              <ChatBubbleLeftIcon
                onClick={() => {
                  setHideWebChat(false);
                }}
                className="text-accent"
              />
            </div>
          )}
        </main>
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to GoodEntry",
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <ProgressBar />
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider
              avatar={BlockieAvatar}
              theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
            >
              <ScaffoldEthApp>{children}</ScaffoldEthApp>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
};
