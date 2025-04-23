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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, MessageSquare } from "lucide-react";
import { useUserStore } from "@/hooks/useUserStore";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardPage() {
  const { isAuthenticated, user } = useUserStore();
  const router = useRouter();
  // these stuff are temp, these are only added to get the base feature working, then the
  // improvements and the actual stuff will be implemented
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [BoardTitleBox, setBoardTitleBox] = useState("");
  const [BoardDescriptionBox, setBoardDescriptionBox] = useState("");

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <div>Redirecting</div>;

  // this should be removed on view api called
  const [boards, setBoards] = useState([
    {
      id: "board1",
      title: "ThisIsAExample",
      description: "This is a public board!",
    }
  ]);

  useEffect(() => {
    async function GetBoards() {
      var apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log(apiUrl);
      const response = await fetch(`${apiUrl}/api/v1/board/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const apiresponse = await response.json();

      if (apiresponse) {
        setBoards(apiresponse)
      }

      console.log(apiresponse);
    }

    GetBoards();
  }, []);

  const CreateBoard = async () => {
    var apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiResponse = await fetch(`${apiUrl}/api/v1/board/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: BoardTitleBox,
        description: BoardDescriptionBox,
      }),
      credentials: "include",
    });

    const JsonParsed = await apiResponse.json();
    console.log(JsonParsed);
    if (JsonParsed) {
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
            href="/settings"
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
            <h1 className="text-2xl font-bold">Confessions</h1>
            <Button
              className="px-4 py-2 "
              onClick={() => setShowCreateBoard(true)}
            >
              Add New Board
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {boards.map((board) => (
              <Link href={``} key={board.id}>
                <Card className="cursor-pointer hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle>{board.title}</CardTitle>
                    <CardDescription>{board.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Confessions
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">
          © 2025 ConfessBoard. All rights reserved.
        </p>
      </footer>

      <Dialog open={showCreateBoard} onOpenChange={setShowCreateBoard}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="relative">
              <div className="space-y-2">
                <Label>Board Name</Label>
                <Input
                  placeholder="Board Name"
                  value={BoardTitleBox}
                  onChange={(e) => setBoardTitleBox(e.target.value)}
                ></Input>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Board Name"
                  value={BoardDescriptionBox}
                  onChange={(e) => setBoardDescriptionBox(e.target.value)}
                ></Textarea>
              </div>
            </div>
          </div>

          <DialogFooter>
            {" "}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-300 hover:text-white transition"
                onClick={() => setShowCreateBoard(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition"
                onClick={() => CreateBoard()}
              >
                Create Board
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
