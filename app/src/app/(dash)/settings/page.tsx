"use client";
import { unstable_ViewTransition as ViewTransition } from "react";
export default function Page() {
  return (
    <div>
      <ViewTransition name="comp-name">
        <p className="text-2xl absolute right-0">Settings</p>
      </ViewTransition>
    </div>
  );
}
