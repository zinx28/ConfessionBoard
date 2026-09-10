"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Copy, MessageSquare } from "lucide-react";
import { useUserStore } from "@/hooks/useUserStore";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, user } = useUserStore();
  const { id } = use(params);
  const router = useRouter();

  const pathname = usePathname();
  useEffect(() => {
    if (!isAuthenticated) {
      const next = encodeURIComponent(
        pathname
      );
      router.push(`/login?next=${next}`);
    };
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <div className="flex min-h-screen items-center justify-center">
    <Spinner className="h-8 w-8" />
  </div>;

  // this should be removed on view api called
  type MessageType = {
    boardId: "";
    id: "";
    image: null;
    message: "";
    timestamp: "";
    userId: "";
    username: "";
  };
  const [Board, setBoard] = useState({
    title: "none",
    messages: [] as MessageType[],
  });

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

      console.log(apiresponse);
    }

    GetBoards();
  }, []);

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
            <h1 className="text-3xl font-bold">{Board.title}</h1>
            <p className="inline-flex items-center text-gray-500 gap-1">
              <Link href="/dashboard" className="inline-flex items-center gap-1"><ArrowLeft className="size-4" /> Go back</Link>
              <span> | Viewing a confession</span>
            </p>
            <p className="text-gray-500">Messages | {Board.messages.length}</p>
          </div>

          {Board.messages?.map((e) => (
            <div key={e.id} className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-1">
                {e.timestamp}
              </p>
              <p>{e.message}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">
          © 2026 ConfessBoard. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
