"use client";
import { AuroraBackground } from "../hand-component";
import { Button } from "./button";

export const GlobaErrorBoundary = ({
  message = "Some error occured in the page you were visiting. Rest asssured the issue is from our side , not yours.",
}: {
  message?: string;
}) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-full absolute -z-1 blur-xl  opacity-30">
        <AuroraBackground />
      </div>
      <div className="border border-border p-2  rounded-3xl max-w-md bg-white">
        <div className="p-4 md:p-12 rounded-3xl bg-secondary ">
          <p className="text-xl font-bold">ERROR </p>
          <p className="text-xl text-muted-foreground">{message}</p>
          <div
            className="relative mt-4 inset-0"
            onClick={() => window.location.reload()}
          >
            <Button variant={"outline"} className="w-full ">
              Refresh page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
