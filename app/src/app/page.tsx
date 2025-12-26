"use client";

import { AuroraBackground, ShaderAnimation } from "@/components/hand-component";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-full w-full container flex items-center justify-center">
      <Link href={"/dashboard"}>
        <Button>Dashboard</Button>
      </Link>
    </div>
  );
}
