"use client";

import { useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Copy, MessageSquare, Shield, Users } from "lucide-react";
import { useUserStore } from "@/hooks/useUserStore";
import { useRouter } from "next/navigation";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Spinner } from "@/components/ui/spinner";
import { CreateBoardDialog } from "@/components/create-board-dialog";
import { BoardSettings, BoardView } from "@/types/board";


function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    catch (err) {
      console.error("Failed to copy", err);
    }
  }

  return (
    <Button size="icon" variant="ghost" onClick={handleCopy}>
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useUserStore();
  const router = useRouter();

  // these stuff are temp, these are only added to get the base feature working, then the
  // improvements and the actual stuff will be implemented
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [boards, setBoards] = useState<BoardView[]>([]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function GetBoards() {
      var baseUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        const response = await fetch(`${baseUrl}/api/v1/board/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          credentials: "include",
        });

        const apiresponse = await response.json();

        if (response.ok && apiresponse) {
          setBoards(apiresponse)
        }
      } catch (err) {
        console.error("Failed fetching board:", err)
      }


      //console.log(apiresponse);
    }

    GetBoards();
  }, [isAuthenticated]);

  if (!isAuthenticated) return (<div className="flex min-h-screen items-center justify-center">
    <Spinner className="h-8 w-8" />
  </div>);

  const handleCreateBoard = async (boardSettings: BoardSettings) => {
    var baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const apiResponse = await fetch(`${baseUrl}/api/v1/board/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({
          title: boardSettings.title,
          description: boardSettings.description,
          theme: boardSettings.theme,
          allowAnonymous: boardSettings.allowAnonymous,
          allowMultiple: boardSettings.allowMultiple
        }),
        credentials: "include",
      });

      const JsonParsed = await apiResponse.json();

      if (JsonParsed) {
        console.log(JsonParsed);
        if (!JsonParsed.error) {
          setShowCreateBoard(false);
          setBoards(prevBoards => [
            ...prevBoards,
            {
              id: JsonParsed.id,
              title: boardSettings.title,
              description: boardSettings.description,
              message_count: 0
            }
          ]);
        }
      }
    } catch (err) {
      console.error("Failed creating board:", err);
    }
  };

  return (
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
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </header>
      <main className="flex-1 py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">
              Manage your confession board and view confessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border">
              <h3 className="text-gray-400 text-sm font-medium">
                Total Boards
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {boards.length}
              </p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="text-gray-400 text-sm font-medium">
                Total Confessions
              </h3>
              <p className="text-3xl font-bold text-white mt-2">-1</p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="text-gray-400 text-sm font-medium">
                Anonymous Boards
              </h3>
              <p className="text-3xl font-bold text-white mt-2">-1</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your Boards</h1>
            <Button
              className="px-4 py-2 "
              onClick={() => setShowCreateBoard(true)}
            >
              Add New Board
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {boards.map((board) => (
              <Card className="hover:shadow-lg transition" key={board.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">  <MessageSquare className="h-5 w-5 text-primary" /> {board.title}</CardTitle>
                  <CardDescription>{board.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{board.message_count} messages</span>
                    <span>Active</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full items-center gap-4">
                    <Link href={`/dashboard/view/${board.id}`} key={board.id} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Confessions
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>

                    <CopyLinkButton url={
                      typeof window !== "undefined" ? `${window.location.origin}/board/${board.id}` : ""
                    } />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">
          © 2026 ConfessBoard. All rights reserved.
        </p>
      </footer>

      <CreateBoardDialog
        open={showCreateBoard}
        onOpenChange={setShowCreateBoard}
        onCreate={handleCreateBoard}
      />

    </div>
  );
}
