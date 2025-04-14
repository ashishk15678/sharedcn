import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, DeleteIcon, Home, Menu, MessageSquare, Settings, User, X, XCircle } from "lucide-react";
import { Suspense, useState, useEffect, useCallback } from "react";
import { cn } from "./lib/utils";
const HoldToDeleteButton = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const HOLD_DURATION = 1000; // 1 second to complete
  const ANIMATION_INTERVAL = 10; // Update every 10ms

  useEffect(() => {
    // @ts-ignore
    let intervalId;
    if (isHolding && progress < 100) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (ANIMATION_INTERVAL / HOLD_DURATION) * 100;
          if (newProgress >= 100) {
            setIsComplete(true);
            // @ts-ignore
            clearInterval(intervalId);
            return 100;
          }
          return newProgress;
        });
      }, ANIMATION_INTERVAL);
    } else if (!isHolding && progress !== 0) {
      setProgress(0);
      setIsComplete(false);
    }

    return () => {
      // @ts-ignore
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHolding]);

  const handleComplete = useCallback(() => {
    // Handle delete action here
    console.log("Deleted!");
    setProgress(0);
    setIsComplete(false);
  }, []);

  return (
    <button
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      onTouchStart={() => setIsHolding(true)}
      onTouchEnd={() => setIsHolding(false)}
      onClick={() => isComplete && handleComplete()}
      className="relative overflow-hidden text-red-600 px-6 text-md rounded-3xl flex flex-row items-center justify-center gap-x-2 py-2 bg-zinc-50 transition-colors"
    >
      <div
        className="absolute left-0 top-0 bottom-0 bg-red-500 transition-all duration-75"
        style={{ width: `${progress}%`, opacity: 0.2 }}
      />
      <span className="relative z-10 flex items-center gap-2">
        <DeleteIcon size={20} />
        {isComplete ? "Release to delete" : "Hold to delete"}
      </span>
    </button>
  );
};

function FluidMenuAnimation() {
  const [clicked, setClicked] = useState<boolean>(false);
  return (

    <div className="w-full h-[200px] flex flex-col items-center ">
      <button
        className="transition-all duration-300 bg-zinc-100 rounded-full p-4 relative"
        onClick={() => setClicked(!clicked)}

      >
        {clicked ? <X className="  active:opacity-0 active:text-zinc-100 transition-all duration-700" /> :
          <Menu className=" active:opacity-0 active:text-zinc-100 active:scale-110 transition-all duration-700" />}
      </button>
      {clicked ? <>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className=" ">
            <div className="flex flex-col gap-[-1px] relative">
              <div className="w-full hover:text-zinc-700 text-zinc-400 bg-zinc-100 rounded-full p-4 bg-zinc-100">
                <Home />
              </div>
              <div className="w-full hover:text-zinc-700 text-zinc-400 bg-zinc-100 rounded-full p-4 bg-zinc-100">
                <MessageSquare />
              </div>
              <div className="w-full hover:text-zinc-700 text-zinc-400 bg-zinc-100 rounded-full p-4 bg-zinc-100">
                <User />
              </div>
              <div className="w-full hover:text-zinc-700 text-zinc-400 bg-zinc-100 rounded-full p-4 bg-zinc-100">
                <Settings />
              </div>

            </div>
          </div>
        </motion.div>
      </> : <>
        {/* <motion.div
          initial={{ opacity: 1, y: -10 }}
          animate={{ opacity: 0.5, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="bg-zinc-100 h-[100px] transition-all duration-700 rounded-full">
          </div>
        </motion.div> */}
      </>}
    </div>
  );
}

function TransactionChecker() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [state, setState] = useState<"success" | "failed" | "analyzing">("analyzing");

  const shakeAnimation = {
    failed: {
      x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <>
      <div className="inline-flex justify-center">
        <motion.button
          animate={state === "failed" ? "failed" : ""}
          variants={shakeAnimation}
          // @ts-ignore
          onClick={() => {
            setIsAnalyzing(true);
            setTimeout(() => setIsAnalyzing(false), 3000);
          }}
          className={cn(
            "px-6 py-2 rounded-full text-xl font-medium hover:opacity-90 cursor-pointer",
            "transition-all duration-500 ease-in-out h-12",
            "flex items-center justify-center relative overflow-hidden",
            state === "analyzing" ? "w-[280px]" : state === "success" ? "w-[220px]" : "w-[240px]",
            state === "analyzing" ? "bg-blue-100" : state === "success" ? "bg-green-100" : "bg-red-100",
            state === "analyzing" ? "text-blue-600" : state === "success" ? "text-green-600" : "text-red-600",
          )}
        >
          <motion.div
            key={state}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            // @ts-ignore
            className="flex items-center gap-2"
          >
            {state === "analyzing" && <div className="w-7 h-7 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />}
            {state === "success" && <CheckCircle className="w-7 h-7 text-green-500" />}
            {state === "failed" && <AlertCircle className="w-7 h-7 text-red-500" />}
            <span>{state === "analyzing" ? "Analyzing Transaction" : state === "success" ? "Success" : "Failed"}</span>
          </motion.div>
        </motion.button>
      </div>

      <div className="flex flex-row items-center justify-center gap-x-4 mt-8">
        <button className="bg-green-100 text-green-700 px-4 py-2 rounded-full" onClick={() => setState("success")}>Success</button>
        <button className="bg-red-100 text-red-700 px-4 py-2 rounded-full" onClick={() => setState("failed")}>Failed</button>
        <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full" onClick={() => setState("analyzing")}>Analyzing</button>
      </div>
    </>
  );
}

// All the compo
export const components = [
  {
    id: "1",
    title: "Gradient Button",
    description: "A beautiful gradient button with hover effects",
    tags: ["Buttons", "Animation"],
    component: (
      <Suspense
        fallback={
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
        }
      >
        <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity">
          Gradient Button
        </button>
      </Suspense>
    ),
    code: `const GradientButton = () => (
  <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity">
    Gradient Button
  </button>
);`,
  },
  {
    id: "2",
    title: "Mode Toggler",
    description: "A beautiful mode toggler with hover effects",
    tags: ["Buttons", "Animation"],
    component: (
      <Suspense
        fallback={
          <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
        }
      >
        <button className="p-2 rounded-full transition-colors bg-yellow-400">
          ☀️
        </button>
      </Suspense>
    ),
    code: `const ModeToggler = () => {
  const [isDark, setIsDark
            ] = useState(false);
  return (
    <button
      onClick={() => setIsDark(!isDark)
            }
      className={\`p-2 rounded-full transition-colors \${
        isDark ? "bg-slate-800": "bg-yellow-400"
                }\`
            }
    >
      {isDark ? "🌙": "☀️"
            }
    </button>
  );
        };`,
  },
  {
    id: "4",
    title: "Hold to delete",
    description: "Hold to delete button with progress animation",
    tags: ["Buttons", "Animation", "Other"],
    component: (
      <Suspense
        fallback={
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
        }
      >
        <HoldToDeleteButton />
      </Suspense>
    ),
    code: `const HoldToDeleteButton = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const HOLD_DURATION = 1000; // 1 second to complete
  const ANIMATION_INTERVAL = 10; // Update every 10ms
  
  useEffect(() => {
    let intervalId;
    if (isHolding && progress < 100) {
      intervalId = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (ANIMATION_INTERVAL / HOLD_DURATION) * 100;
          if (newProgress >= 100) {
            setIsComplete(true);
            clearInterval(intervalId);
            return 100;
          }
          return newProgress;
        });
      }, ANIMATION_INTERVAL);
    } else if (!isHolding && progress !== 0) {
      setProgress(0);
      setIsComplete(false);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHolding]);

  const handleComplete = useCallback(() => {
    // Handle delete action here
    console.log('Deleted!');
    setProgress(0);
    setIsComplete(false);
  }, []);

  return (
    <button
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      onTouchStart={() => setIsHolding(true)}
      onTouchEnd={() => setIsHolding(false)}
      onClick={() => isComplete && handleComplete()}
      className="relative overflow-hidden hover:bg-red-100 text-red-600 px-6 text-md rounded-lg flex flex-row items-center justify-center gap-x-2 py-2 bg-zinc-50 transition-colors"
    >
      <div
        className="absolute left-0 top-0 bottom-0 bg-red-500 transition-all duration-75"
        style={{ width: \`\${progress}%\`, opacity: 0.2 }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {isComplete ? 'Release to delete' : 'Hold to delete'} 
        <DeleteIcon size={20} />
      </span>
    </button>
  );
};`,
  },

  {
    id: 5,
    title: "Feedback",
    description: "A modern feedback form",
    tags: ["Feedback", "Other"],
    component: (
      <Suspense
        fallback={
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
        }
      >
        <div className="bg-zinc-100 p-2 rounded-2xl border-2 border-zinc-300 scale-0.5 inset-shadow-2xs">
          <div className="bg-white rounded-2xl">
            {" "}
            <textarea
              className="resize-none p-2 bg-white rounded-xl  outline-none"
              cols={35}
              rows={8}
            />
            <div className="border-dashed border-t-2 border-zinc-200" />
            <div className="w-full flex justify-end items-center p-4">
              <button className="bg-blue-500 text-white px-4 py-1 rounded-lg">
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      </Suspense>
    ),
    code: `
    const lol = works,
    `,
  },
  {
    id: 6,
    title: "Fluid Menu Animation",
    description: "A fluid menu animation",
    tags: ["Animation", "Other", "Peerlist"],
    component: (
      <Suspense
        fallback={
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
        }
      >
        <FluidMenuAnimation />
      </Suspense>
    ),
    code: "will upload after challenge , if i forget mail me at hi@ashish.services"
    //     code: `
    //     const [clicked, setClicked] = useState<boolean>(false);
    //       return (

    //         <div className="w-full h-[200px] flex flex-col items-center ">
    //           <button
    //             className="transition-all duration-300 bg-zinc-100 rounded-full p-4 relative"
    //             onClick={() => setClicked(!clicked)}

    //           >
    //             {clicked ? <X className="  active:opacity-0 active:text-zinc-100 transition-all duration-700" /> :
    //               <Menu className=" active:opacity-0 active:text-zinc-100 active:scale-110 transition-all duration-700" />}
    //           </button>
    //           {clicked ? <>
    //             <motion.div
    //               initial={{ opacity: 0, y: -10 }}
    //               animate={{ opacity: 1, y: 0 }}
    //               exit={{ opacity: 0, y: -10 }}
    //               transition={{ type: "spring", stiffness: 300, damping: 30 }}
    //             >
    //               <div className=" ">
    //                 <div className="flex flex-col gap-[-1px] relative">
    //                   <div className="w-full hover:text-zinc-700 text-zinc-400 bg-zinc-100 rounded-full p-4 bg-zinc-100">
    //                     <Home />
    //                   </div>
    //                   <div className="w-full hover:text-zinc-700 text-zinc-400 bg-zinc-100 rounded-full p-4 bg-zinc-100">
    //                     <MessageSquare />
    //                   </div>
    //                   <div className="w-full hover:text-zinc-700 text-zinc-400 bg-zinc-100 rounded-full p-4 bg-zinc-100">
    //                     <User />
    //                   </div>
    //                   <div className="w-full hover:text-zinc-700 text-zinc-400 bg-zinc-100 rounded-full p-4 bg-zinc-100">
    //                     <Settings />
    //                   </div>

    //                 </div>
    //               </div>
    //             </motion.div>
    //           </> : <>
    //             {/* <motion.div
    //               initial={{ opacity: 1, y: -10 }}
    //               animate={{ opacity: 0.5, y: 0 }}
    //               exit={{ opacity: 0, y: -10 }}
    //               transition={{ type: "spring", stiffness: 300, damping: 30 }}
    //             >
    //               <div className="bg-zinc-100 h-[100px] transition-all duration-700 rounded-full">
    //               </div>
    //             </motion.div> */}
    //           </>}
    //         </div>
    //       );
    // }
    //     `,
  },

  {
    id: 7,
    title: "Animated Button",
    description: "A Transaction Checker",
    tags: ["Animation", "Other", "Peerlist"],
    component: (
      <Suspense
        fallback={
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
        }
      >
        <TransactionChecker />
      </Suspense>
    ),
    code: `Will upload after challenge , if i forget mail me at hi@ashish.services`
  }
];

// Add the HoldToDeleteButton component definition
