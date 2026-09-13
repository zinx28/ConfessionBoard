"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Copy, LayoutGrid, MessageSquare, Minimize2, Sparkles } from "lucide-react";
import { useUserStore } from "@/hooks/useUserStore";
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageType } from "@/types/message";

function getMessageFontSize(message: string) {
  const len = message.length;

  const size = Math.max(1.25, Math.min(6, 6 - len / 80));
  return `${size}rem`
}

function BookView({ title, messages, onClose }: {
  title: string, messages: MessageType[], onClose: () => void
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight")
        setCurrent((value) => (value + 1) % messages.length)
      else if (e.key === "ArrowLeft")
        setCurrent((value) => (value - 1 + messages.length) % messages.length)
      //else if (e.key === "Escape")
      //  onClose();
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [messages.length, onclose])

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col bg-background p-6 sm:p-10 lg:p-16">
      <div className="grid grid-cols-3 items-center text-m text-muted-foreground">
        <span className="justify-self-start">{title}</span>
        <span className="justify-self-center flex items-center gap-2 font-medium tracking-[0.2em] text-primary">
          <Sparkles className="size-4" />Message {current + 1}/{messages.length}
        </span>
        <Button variant="ghost" size="sm" onClick={() => onClose()} className="justify-self-end">
          <Minimize2></Minimize2>
          Exit presentation
        </Button>
      </div>


      {messages.length == 0 ? (<div className="relative flex flex-1 items-center justify-center w-full">This board has no confessions</div>)
        : (
          <div className="relative flex flex-1 items-center justify-center w-full">
            <Button
              size="lg"
              variant="ghost"
              className="absolute left-4 md:left-12 rounded-full h-12 w-12"
              onClick={() => setCurrent((value) => (value - 1 + messages.length) % messages.length)}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div className="max-w-7xl w-full px-16 py-8">
              <p className="text-balance font-semibold leading-tight tracking-tight text-center"
              style={{ fontSize: getMessageFontSize(messages[current]?.message ?? "")}}>
                {messages[current]?.message}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {messages[current]?.username == "anonymous" ? "" : messages[current]?.username}
              </p>

            </div>

            <Button
              size="lg"
              variant="ghost"
              className="absolute right-4 md:right-12 rounded-full h-12 w-12"
              onClick={() => setCurrent((value) => (value + 1) % messages.length)}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div >
        )
      }
    </div >
  )
}

export default function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, user } = useUserStore();
  const { id } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState("grid")

  const [Board, setBoard] = useState({
    title: "none",
    description: "none",
    messages: [] as MessageType[],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      const next = encodeURIComponent(
        pathname
      );
      router.push(`/login?next=${next}`);
    };
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) return <div className="flex min-h-screen items-center justify-center">
    <Spinner className="h-8 w-8" />
  </div>;

  useEffect(() => {
    async function GetBoards() {
      var baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${baseUrl}/api/v1/board/view/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const apiresponse = await response.json();

      if (apiresponse) {
        setBoard(apiresponse);
      }
    }

    GetBoards();
  }, []);

  return (
    <main>
      {mode === "grid" ? (
        <div className="flex flex-col min-h-screen">
          <header className="px-4 lg:px-6 h-16 flex items-center border-b">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <MessageSquare className="h-6 w-6" />
              <span>ConfessBoard</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Settings
              </Link>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://cdn.discordapp.com/avatars/${user.DiscordID}/${user.Avatar}.webp`}
                    alt="U"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </nav>
          </header>
          <main className="flex-1 py-8 px-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">{Board.title} | {Board.description}</h1>
                <p className="inline-flex items-center text-gray-500 gap-1">
                  <Link href="/dashboard" className="inline-flex items-center gap-1"><ArrowLeft className="size-4" /> Go back</Link>
                  <span> | Viewing a confession</span>
                </p>
                <p className="text-gray-500">Messages | {Board.messages.length}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  className="rounded-full">
                  Grid
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => setMode("book")}>
                  <BookOpen /> Book View
                </Button>
              </div>

              {Board.messages?.map((e) => (
                <Card key={e.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500 mb-1">{e.username}</p>
                      <p className="text-sm text-gray-500 mb-1">{e.timestamp}</p>
                    </div>
                    <p>{e.message}</p>

                  </CardContent>
                </Card>

              ))}
            </div>
          </main>

          <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
            <p className="text-xs text-gray-500">
              © 2026 ConfessBoard. All rights reserved.
            </p>
          </footer>
        </div>
      ) : (
        <BookView
          title={Board.description}
          messages={Board.messages}
          onClose={() => setMode("grid")}
        />
      )}
    </main>

  );
}
