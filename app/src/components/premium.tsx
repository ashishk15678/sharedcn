import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCheck, Plus, Star } from "lucide-react";
import { ColorfulBorderBox } from "@/components";

export default function PremiumPlanSelector() {
  const [isToggled, setIsToggled] = useState(false);
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="flex flex-col gap-4  h-full w-full justify-center ">
      <div className="flex flex-col rounded-3xl">
        <div
          className={`flex flex-row rounded-3xl items-center z-100 justify-between w-full  h-[320px] aspect-9/4 transition-all duration-300 ${
            isOn ? "translate-y-[-100px]" : "translate-y-0"
          }`}
        >
          <div className="flex flex-col gap-4 bg-gradient-to-b from-zinc-100 to-zinc-300 z-100 shadow shadow-xl  rounded-4xl h-full w-full px-8 py-6 items-center justify-center">
            <div className="p-2 border border-dashed border-zinc-500 w-full rounded-4xl">
              <div className="flex flex-row items-center justify-between w-full">
                <div
                  className="relative flex items-center w-30 h-14 items-center justify-center rounded-full cursor-pointer bg-gradient-to-b from-zinc-700 to-zinc-500"
                  // style={{
                  //   background: isOn
                  //     ? "linear-gradient(90deg, #222 60%, #2563eb 100%)"
                  //     : "#444",
                  //   // boxShadow: "0 2px 8px 0 rgba(0,0,0,0.18)",
                  //   // transition: "background 0.3s",
                  // }}
                  onClick={() => setIsOn(!isOn)}
                >
                  {/* Blue glow when ON */}
                  <div
                    className={`absolute left-2 right-4 top-2 bottom-2 rounded-full transition-all duration-300 ${
                      isOn
                        ? "bg-gradient-to-b from-zinc-700 to-blue-700 opacity-100"
                        : "bg-zinc-600 "
                    }`}
                  />
                  {/* Dial */}
                  <div
                    className="absolute top-2 left-2 transition-all duration-300"
                    style={{
                      transform: isOn ? "translateX(56px)" : "translateX(0px)",
                    }}
                  >
                    <div className="relative w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
                      {/* Dots around the dial */}
                      {[...Array(12)].map((_, i) => (
                        <span
                          key={i}
                          className="absolute w-1 h-1 bg-zinc-300 rounded-full"
                          style={{
                            left: "50%",
                            top: "50%",
                            transform: `rotate(${i * 30}deg) translate(16px)`,
                            transformOrigin: "center",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-zinc-500 text-xl  transition-all duration-300 px-6 py-2 bg-gradient-to-b from-white to-zinc-100 rounded-xl ring-zinc-300 ring-2 flex flex-row items-center gap-2">
                  <CheckCheck
                    className={`w-6 h-6 ${
                      isOn ? "text-green-500" : "text-zinc-500"
                    }`}
                  />
                  {isOn ? "Premium plan" : "Standard plan"}
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full p-8">
                <div className="flex flex-row items-center w-full justify-between">
                  <span className="text-zinc-500 text-xl font-bold w-1/3">
                    What's included
                  </span>
                  <div className="h-0.5 w-2/3 bg-zinc-300"></div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-2">
                    {/* {[
                      {
                        title: "Webpage",
                        description: "Unlimited access to all features",
                        color: "green",
                      },
                      {
                        title: "Landing pages",
                        description: "Unlimited access to all features",
                        color: "amber",
                      },
                    ].map((item) => ( */}
                    <div
                      className={`flex flex-row items-center gap-2 bg-green-200 border-1 border-green-600 border-dashed px-2 py-1 rounded-full`}
                    >
                      <span className="text-green-600 text-xl flex flex-row items-center gap-2 rounded-full px-2">
                        <Plus className="w-4 h-4" /> Webpage
                      </span>
                    </div>

                    <div
                      className={`flex flex-row items-center gap-2 bg-amber-100 border-1 border-amber-600 border-dashed px-2 py-1 rounded-full`}
                    >
                      <span className="text-amber-600 text-xl  flex flex-row items-center gap-2 rounded-full px-2">
                        <Plus className="w-4 h-4" /> Landing pages
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    {[
                      {
                        title: "Something else",
                      },
                      {
                        title: "Something else as well",
                      },
                    ].map((item) => (
                      <div
                        className={`flex flex-row items-center gap-2 bg-zinc-200  border-1 border-zinc-400 border-dashed px-2 py-1 rounded-full`}
                      >
                        <span className="text-zinc-300 text-xl font-bold flex flex-row items-center gap-2 rounded-full px-2">
                          <Plus className="w-4 h-4" /> {item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <div className="flex flex-col gap-4  rounded-3xl h-full w-full px-8 py-4 items-center justify-center"></div>
        {/* 3D Colorful Border Effect */}
        <div className="relative w-full flex justify-center -mt-10">
          {isOn ? (
            <div
              className="absolute left-1/2 -translate-x-1/2 w-[110%] h-16 rounded-b-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, #60a5fa 0%, #a78bfa 15%, #f472b6 35%, #facc15 60%, #4ade80 80%, #38bdf8 100%)",
                filter: "blur(32px) brightness(2)",
                opacity: 0.9,
                zIndex: 1,
                transform: "translateY(0)",
                transition: "transform 0.5s ease-in-out",
              }}
            />
          ) : (
            <div
              className="absolute left-1/2 -translate-x-1/2 w-[110%] h-16 rounded-b-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, #60a5fa 0%, #a78bfa 15%, #f472b6 35%, #facc15 60%, #4ade80 80%, #38bdf8 100%)",
                filter: "blur(32px) brightness(2)",
                opacity: 0.9,
                zIndex: 1,
                transform: "translateY(-100%)",
                transition: "transform 0.5s ease-in-out",
              }}
            />
          )}
        </div>
      </div>
      <div
        className="absolute z-99 h-40 bottom-0 flex flex-row items-center justify-center w-[650px] "
        style={{
          background:
            "linear-gradient(90deg, #60a5fa 0%, #a78bfa 15%, #f472b6 35%, #facc15 60%, #fff 80%, #4ade80 80%, #38bdf8 100%, rgba(255, 255, 255, 0.8) 100%)",
          filter: " brightness(1.5)",
          boxShadow:
            "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(60, 165, 250, 0.6), 0 0 60px rgba(167, 139, 250, 0.4), 0 0 80px rgba(244, 114, 182, 0.2), 0 0 100px rgba(250, 204, 21, 0.1), 0 0 120px rgba(74, 222, 128, 0.1), 0 0 140px rgba(56, 189, 248, 0.1)",
          borderRadius: "0 0 32px 32px",
        }}
      >
        <div className="absolute z-99 w-full h-40 bottom-0 left-0 pointer-events-none">
          <div className="w-full flex flex-row h-full items-center justify-center gap-4">
            <div className="rounded-full bg-zinc-100/50 p-1 ring-1 ring-zinc-200/30 ">
              <Star className="text-zinc-500" />
            </div>
            <div className="text-zinc-500 text-md font-bold bg-zinc-100/50 rounded-4xl py-1 px-4 ring-1 ring-zinc-200/30">
              3 spots left
            </div>
            <div className="text-zinc-500 text-md font-bold bg-zinc-100/90 rounded-4xl py-1 px-4 ring-1 ring-zinc-300">
              $100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRandomBlobs(count = 7) {
  const palette = [
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
    "#facc15",
    "#4ade80",
    "#38bdf8",
    "#fff",
  ];
  return Array.from({ length: count }).map((_, i) => ({
    key: i,
    color: palette[Math.floor(Math.random() * palette.length)],
    left: `${Math.random() * 80 + 5}%`,
    top: `${Math.random() * 60 + 20}%`,
    size: `${Math.random() * 80 + 60}px`,
    blur: `${Math.random() * 24 + 24}px`,
    opacity: Math.random() * 0.5 + 0.5,
  }));
}
