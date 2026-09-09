"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/useUserStore";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserStore();

  const checkSession = async () => {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const accountCheck = await fetch(`${baseUrl}/api/v1/account/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
    });

    var userData = await accountCheck.json();

    if (userData && !userData.error) {
      // we only want to auto re-direct if they aren't a temp user
      if (!userData.Temp) {
        login(userData);
        router.push("/dashboard");
      }
    }

  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <main className="flex flex-1 items-center mx-auto w-full max-w-md ">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="size-5" />
            </div>
            <CardTitle className="text-2xl">Connect with Discord</CardTitle>
            <CardDescription>
              Sign in with your Discord account to create or manage your
              confession board.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <Button
              className="w-full text-gray bg-[#5865F2] hover:bg-[#4752c4] white"
              onClick={() =>
                router.push(
                  "https://discord.com/oauth2/authorize?client_id=1363320877998932209&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcheck%2Flogin&scope=identify"
                )
              }
            >
              {/* This was grabbed from SVG library */}
              <svg className="h-5 w-5" viewBox="0 -28.5 256 256" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
                <g>
                  <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#e4e4eb" fillRule="nonzero">

                  </path>
                </g>
              </svg>
              Continue with Discord
            </Button>
          </CardContent>
        </Card>
      </main>
      <footer className="gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">
          © 2026 ConfessBoard. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
