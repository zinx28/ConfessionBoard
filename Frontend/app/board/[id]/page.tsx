"use client";

import type React from "react";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/hooks/useUserStore";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

type Board = {
  id: string,
  owner_id: string,
  title: string,
  description: string,
  anonymous: boolean,
  allowMultiple: boolean,
  theme: string,
  background: string
}

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, login, user } = useUserStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(true);

  const checkSession = async () => {
    var baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const accountCheck = await fetch(`${baseUrl}/api/v1/account/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
    });

    var userData = await accountCheck.json();

    if (userData && !userData.error) {
      login(userData);
    }
  };
  const { id } = use(params);
  const [Board, setBoard] = useState<Board | null>(null);
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);
  const viewBoard = async () => {
    var baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${baseUrl}/api/v1/board/user/view/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
      });

      if (!response.ok)
        return false;

      var userBoard = await response.json();

      if (userBoard && !userBoard.error) {
        // this is temp, most likely a message iont he future
        setBoard(userBoard.data);
        return true;
      } else {
        console.log(userBoard.error);
      }

     
    } catch {
      return false;
    }

  };

  useEffect(() => {
    ///api/v1/board/user/view/
    viewBoard().then((valid) => {
      if (!valid) return;
      checkSession();
    }).finally(() => {
      setIsSubmitting(false);
      setIsLoadingBoard(false);
    });
  }, []);

  useEffect(() => {
    if(!Board) return;

    const html = document.documentElement

    html.classList.remove("light", "dark")
    html.classList.add(Board.theme)
  }, [Board])
  const [confession, setConfession] = useState("");

  const boardMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    var baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${baseUrl}/api/v1/board/user/message/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        message: confession,
      }),
      credentials: "include",
    });

    var boardResponse = await response.json();

    if (boardResponse) {
      console.log(boardResponse);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-6 w-6" />
          <span>ConfessBoard</span>
        </Link>

      </header>

      <Link href="/" className="flex py-4 px-4 items-center gap-1 text-sm">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <main className="flex-1  mx-auto py-8 px-4">

        {isLoadingBoard ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading Board...</p>
          </div>
        ) : Board ? (
          <>
            <Card className="mb-8 items-center justify-center  max-w-3xl">
              <CardHeader>
                <CardTitle>{Board.title}</CardTitle>
                <CardDescription>
                  Share your thoughts anonymously with {Board.owner_id}. They won't know who you
                  are.
                </CardDescription>
                <CardDescription>{Board.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={boardMessage}>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Write your confession here..."
                      value={confession}
                      onChange={(e) => setConfession(e.target.value)}
                      className="min-h-[150px]"
                      required
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || !isAuthenticated || confession.trim() == ""}
                    >
                      {isSubmitting ? "Sending..." : "Send Confession"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="text-xs text-gray-500">
                All confessions are anonymous. The board owner will not be able to
                see who sent this message.
              </CardFooter>
            </Card>



            {user?.DiscordID === Board.owner_id ? (
              <div className="text-center">
                <p className="mb-4 text-sm">Board Owner? <Link href={`/dashboard/${Board.id}`} className="underline">View confessions</Link></p>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4">Want your own confession board?</p>
                <Link href="/login">
                  <Button variant="outline">Create Your Board</Button>
                </Link></div>
            )}

            <Dialog open={!isAuthenticated}>
              <DialogContent className="sm:max-w-[500px] [&>button]:hidden">
                <DialogHeader>
                  <DialogTitle>Login to send a confession</DialogTitle>
                  <DialogDescription>
                    To prevent spam everyone is required to connect
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                  <Button className="w-full sm:w-auto gap-2 px-6"
                    disabled={isSubmitting}
                    onClick={() =>
                      router.push(
                        `https://discord.com/oauth2/authorize?client_id=1363320877998932209&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcheck%2Flogin&scope=identify&state=board_id=${id}`
                      )
                    }
                  >
                    {/* This was grabbed from SVG library */}
                    <svg className="h-5 w-5" viewBox="0 -28.5 256 256" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
                      <g>
                        <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fillRule="nonzero">

                        </path>
                      </g>
                    </svg>
                    Connect with discord
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="flex flex-col gap-5">
            <Card className="w-full max-w-md text-center ">
              <CardHeader>
                <CardTitle>Board not found</CardTitle>
                <CardDescription>
                  This confession board doesn't exist or is no longer available.
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="text-center">
              <p className="mb-4">Want your own confession board?</p>
              <Link href="/login">
                <Button variant="outline">Create Your Board</Button>
              </Link></div>
          </div>
        )}



      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">
          © 2026 ConfessBoard. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/terms"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>


    </div>
  );
}
