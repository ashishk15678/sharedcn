import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import { APP_IMAGE, APP_NAME } from "@/constants";

export function AppHeader() {
  return (
    <>
      <div className="flex justify-between items-center w-full h-12 px-2">
        <Link href={"/"} className="w-full">
          <button className="w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 group text-primary dark:text-zinc-400 gap-x-2">
            <Image
              src={APP_IMAGE}
              width={32}
              height={32}
              className="rounded-full"
              alt=""
            />
            <p className=" text-2xl track-wider font-extrabold italic">
              {APP_NAME}
            </p>
          </button>
        </Link>

        <ThemeToggle />
      </div>
    </>
  );
}
