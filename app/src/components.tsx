import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  DeleteIcon,
  Grid,
  Home,
  List,
  Menu,
  MessageSquare,
  Package,
  Settings,
  User,
  View,
  X,
  XCircle,
} from "lucide-react";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { cn } from "./lib/utils";
import Image from "next/image";
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
        {clicked ? (
          <X className="  active:opacity-0 active:text-zinc-100 transition-all duration-700" />
        ) : (
          <Menu className=" active:opacity-0 active:text-zinc-100 active:scale-110 transition-all duration-700" />
        )}
      </button>
      {clicked ? (
        <>
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
        </>
      ) : (
        <>
          {/* <motion.div
          initial={{ opacity: 1, y: -10 }}
          animate={{ opacity: 0.5, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="bg-zinc-100 h-[100px] transition-all duration-700 rounded-full">
          </div>
        </motion.div> */}
        </>
      )}
    </div>
  );
}

function TransactionChecker() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [state, setState] = useState<"success" | "failed" | "analyzing">(
    "analyzing"
  );

  const shakeAnimation = {
    failed: {
      x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
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
            state === "analyzing"
              ? "w-[280px]"
              : state === "success"
              ? "w-[220px]"
              : "w-[240px]",
            state === "analyzing"
              ? "bg-blue-100"
              : state === "success"
              ? "bg-green-100"
              : "bg-red-100",
            state === "analyzing"
              ? "text-blue-600"
              : state === "success"
              ? "text-green-600"
              : "text-red-600"
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
            {state === "analyzing" && (
              <div className="w-7 h-7 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
            )}
            {state === "success" && (
              <CheckCircle className="w-7 h-7 text-green-500" />
            )}
            {state === "failed" && (
              <AlertCircle className="w-7 h-7 text-red-500" />
            )}
            <span>
              {state === "analyzing"
                ? "Analyzing Transaction"
                : state === "success"
                ? "Success"
                : "Failed"}
            </span>
          </motion.div>
        </motion.button>
      </div>

      <div className="flex flex-row items-center justify-center gap-x-4 mt-8">
        <button
          className="bg-green-100 text-green-700 px-4 py-2 rounded-full"
          onClick={() => setState("success")}
        >
          Success
        </button>
        <button
          className="bg-red-100 text-red-700 px-4 py-2 rounded-full"
          onClick={() => setState("failed")}
        >
          Failed
        </button>
        <button
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
          onClick={() => setState("analyzing")}
        >
          Analyzing
        </button>
      </div>
    </>
  );
}

function AnimatedToggle() {
  const [toggled, setToggled] = useState<"free" | "month" | "year">("free");
  return (
    <div className="relative mx-auto  w-[400px] overflow-hidden h-14 ring-2 ring-zinc-200 shadow-md rounded-full p-2">
      <motion.div
        // @ts-ignore
        className="absolute w-1/2 bg-zinc-800 h-10 rounded-full"
        animate={{
          x: toggled === "free" ? "0%" : "100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <button
        onClick={() => setToggled("free")}
        className={`relative z-10 w-1/2 text-center py-2 rounded-full transition-all duration-300 font-extrabold ${
          toggled === "free"
            ? "text-white scale-100"
            : "text-black scale-95 opacity-70"
        }`}
      >
        Free
      </button>
      <div className="absolute right-0 top-0  w-1/2 flex flex-col items-center justify-center">
        {toggled == "free" ? (
          <div className="w-full rounded-full font-bold items-center justify-center flex transition-all duration-300">
            Premium
          </div>
        ) : (
          <>
            <motion.div
              // @ts-ignore
              className="w-3/7 bg-white absolute h-8 rounded-full transition-all duration-300"
              style={{
                left: toggled === "year" ? "10%" : "50%",
              }}
            />
          </>
        )}
        <div
          className={cn(
            "flex flex-row items-center justify-center h-full",
            toggled == "free" ? "p-0 " : "p-2 w-full"
          )}
        >
          <button
            onClick={() => setToggled("year")}
            className={`w-full  text-center z-10 rounded-full transition-all duration-300
               ${
                 toggled === "year"
                   ? "text-black py-2 text-lg font-bold"
                   : toggled === "month"
                   ? "text-white py-2 text-lg"
                   : "text-black "
               }`}
          >
            Year
          </button>
          <button
            onClick={() => setToggled("month")}
            className={`w-full  text-center z-10 rounded-full transition-all duration-300 
              ${
                toggled === "month"
                  ? "text-black py-2 text-lg font-bold"
                  : toggled === "year"
                  ? "text-white py-2 text-lg"
                  : "text-black ml-4"
              }`}
          >
            Month
          </button>
        </div>
      </div>
    </div>
  );
}
function CollectibleItem({
  id,
  name,
  price,
  image,
  view,
}: {
  id: number;
  name: string;
  price: string;
  image: string;
  view: string;
}) {
  // Tailwind classes for each view
  const containerClass =
    view === "list"
      ? "flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg"
      : "flex flex-col items-center p-4 bg-gray-50 border border-gray-200 rounded-lg";

  const infoClass = view === "list" ? "ml-4 text-left" : "mt-2 text-center";

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      transition={{ duration: 0.5 }}
      // @ts-ignore
      className={containerClass}
    >
      {/* --- Animated Image --- */}
      <motion.img
        // @ts-ignore
        src={image}
        alt={name}
        className="w-20 h-20 object-cover rounded-full"
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <div className={infoClass}>
        {/* --- Show detailed info except in "pack" view --- */}
        {view !== "pack" && (
          <>
            <h4 className="font-semibold text-lg">{name}</h4>
            <p className="text-gray-600">{price}</p>
          </>
        )}
        <p className="mt-1 font-bold text-gray-800">#{id}</p>
      </div>
    </motion.div>
  );
}

function Collectibles() {
  // Below code was generateed by chatgpt , chatgpt sucks
  // I repeat Chatgpt sucks
  //
  // const views = ['List view', 'Card view', 'Pack view'];

  const mockCollectibles = [
    {
      id: 209,
      name: "Skilled Fingers Series",
      price: "0.855 ETH",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 808,
      name: "Vibrant Vibes Series",
      price: "0.209 ETH",
      image: "https://picsum.photos/seed/picsum/200/300",
    },
  ];
  // const [activeView, setActiveView] = useState('List view');
  // const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  // const buttonsRef = useRef([]);

  // useEffect(() => {
  //   const index = views.indexOf(activeView);
  //   const button = buttonsRef.current[index];
  //   if (button) {
  //     setIndicatorStyle({
  //       left: button.offsetLeft,
  //       width: button.offsetWidth,
  //     });
  //   }
  // }, [activeView]);

  // return (
  //   <div className="max-w-md mx-auto p-6 font-sans text-black bg-white min-h-screen">
  //     <h2 className="text-xl font-semibold mb-4">Collectibles</h2>

  //     {/* Toggle Buttons */}
  //     <div className="relative flex bg-gray-100 rounded-full p-1 mb-6 w-fit">
  //       {views.map((view, idx) => (
  //         <button
  //           key={view}
  //           ref={(el) => (buttonsRef.current[idx] = el)}
  //           onClick={() => setActiveView(view)}
  //           className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeView === view ? 'text-white' : 'text-gray-700'
  //             }`}
  //         >
  //           {view}
  //         </button>
  //       ))}
  //       <motion.div
  //         className="absolute top-0 bottom-0 bg-blue-500 rounded-full z-0"
  //         layout
  //         transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  //         style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
  //       />
  //     </div>

  //     {/* List View */}
  //     {activeView === 'List view' && (
  //       <div className="space-y-4">
  //         {collectibles.map((item) => (
  //           <div
  //             key={item.id}
  //             className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg shadow-sm"
  //           >
  //             <Image
  //               width={
  //                 48
  //               }
  //               height={
  //                 48
  //               }
  //               src={item.image}
  //               alt={item.name}
  //             />
  //             <div className="flex-1">
  //               <div className="font-medium text-gray-900">{item.name}</div>
  //               <div className="text-gray-600 text-sm">{item.price} ETH</div>
  //             </div>
  //             <div className="text-yellow-500 font-semibold text-sm">#{item.id}</div>
  //           </div>
  //         ))}
  //       </div>
  //     )}

  //     {/* Card View */}
  //     {activeView === 'Card view' && (
  //       <div className="grid grid-cols-2 gap-4">
  //         {collectibles.map((item) => (
  //           <div
  //             key={item.id}
  //             className="bg-gray-100 rounded-xl p-4 shadow-md flex flex-col items-center"
  //           >
  //             <Image
  //               width={248}
  //               height={248}
  //               src={item.image}

  //               alt={item.name}
  //               className="w-40 h-40 mb-2 rounded-md object-cover"
  //             />
  //             <div className="font-semibold text-center text-sm">{item.name}</div>
  //             <div className="text-gray-600 text-xs">{item.price} ETH</div>
  //             <div className="text-yellow-500 text-xs font-semibold">#{item.id}</div>
  //           </div>
  //         ))}
  //       </div>
  //     )}

  //     {/* Pack View */}
  //     {activeView === 'Pack view' && (
  //       <div className="flex flex-col space-y-4">
  //         {collectibles.map((item) => (
  //           <div
  //             key={item.id}
  //             className="bg-gradient-to-r from-yellow-100 via-red-100 to-pink-100 p-4 rounded-xl shadow-md flex items-center space-x-4"
  //           >
  //             <img
  //               src={item.image}
  //               alt={item.name}
  //               className="w-14 h-14 rounded-lg object-cover"
  //             />
  //             <div className="flex-1">
  //               <div className="font-semibold text-base">{item.name}</div>
  //               <div className="text-sm text-gray-700">{item.price} ETH</div>
  //             </div>
  //             <div className="text-yellow-600 font-bold text-sm">#{item.id}</div>
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );

  const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.08 } },
  };

  // --- Item animation variants ---
  // These are fixed values to replicate the same animation every time.
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };
  const [view, setView] = useState("list"); // possible: "list", "card", "pack"

  // Set grid column classes based on the selected view.
  const gridCols =
    view === "list"
      ? "grid-cols-1"
      : view === "card"
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* --- View Toggle Buttons --- */}
      <div className="flex justify-center gap-2 mb-6">
        {["list", "card", "pack"].map((mode) => (
          <button
            key={mode}
            onClick={() => setView(mode)}
            className={`px-4 py-2 border rounded transition-colors 
              ${
                view === mode
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)} view
          </button>
        ))}
      </div>

      {/* --- Animated Collectibles Grid --- */}
      <motion.div
        layout // enables smooth layout transitions
        variants={containerVariants}
        initial="hidden"
        animate="animate"
        exit="hidden"
        // @ts-ignore
        className={`grid gap-4 ${gridCols}`}
        transition={{
          layout: { duration: 0.5, type: "spring", stiffness: 300 },
        }}
      >
        {mockCollectibles.map((collectible) => (
          <CollectibleItem key={collectible.id} view={view} {...collectible} />
        ))}
      </motion.div>
    </div>
  );
}

function ClickableItem() {
  return (
    <div className="group transition-all">
      <div className="rotate-x-45 rounded-xl shadow-2xl shadow-zinc-700  rotate-z-30 w-30 h-30 ">
        <div className="w-full h-full bg-zinc-300 group-hover:bg-zinc-400 transition-all duration-300 rounded-xl"></div>
      </div>

      <div
        className="rotate-x-45 rounded-xl  rotate-z-30 w-30 h-30 bg-zinc-100 group-hover:bg-gradient-to-r group-hover:from-zinc-100 group-hover:to-zinc-200 
      group-hover:text-zinc-700 z-1 absolute top-0  top-2 transition-all duration-300
      hover:top-4 ring-2 ring-zinc-300 shadow-2xl shadow-zinc-700
      flex items-center justify-center p-2
      "
      >
        <div
          className="rounded-full h-full w-full bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] 
        from-zinc-300 via-zinc-100 to-zinc-400 text-md flex items-center justify-center  "
        >
          <span className="text-zinc-600">Press [T]</span>
        </div>
      </div>
      {/* <div className="absolute inset-0  h-full bg-zinc-700 z-1 top-4 rounded-xl"></div> */}
    </div>
  );
}

function AnimatedCheckbox() {
  const [isChecked, setIsChecked] = useState(false);
  const [isBorderComplete, setIsBorderComplete] = useState(false);

  return (
    <div className="flex items-center justify-center w-full h-full gap-3">
      <motion.button
        // @ts-ignore
        onClick={() => {
          setIsChecked(!isChecked);
          if (!isChecked) {
            setIsBorderComplete(false);
          }
        }}
        className="relative w-10 h-10 rounded-xl p-1.5 bg-zinc-100"
      >
        {/* Background animation */}
        <motion.div
          // @ts-ignore
          className="absolute inset-0 rounded-xl bg-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: isBorderComplete && isChecked ? 1 : 0 }}
          transition={{
            duration: 0.2, // Quick fade in, no delay
          }}
        />

        {/* Border animation */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.rect
            x="0"
            y="0"
            width="40"
            height="40"
            rx="12"
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
            className="text-blue-500"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{
              pathLength: 1,
              pathOffset: isChecked ? 0 : 1,
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => {
              if (isChecked) {
                setIsBorderComplete(true);
              }
            }}
          />
        </svg>

        {/* Checkmark */}
        <motion.div
          initial={false}
          animate={{
            scale: isChecked ? 1 : 0,
            opacity: isChecked ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            delay: 0.4, // Appears right after background
          }}
          // @ts-ignore
          className="absolute inset-0 flex items-center justify-center text-white"
        >
          <svg
            viewBox="0 0 24 24"
            width="36"
            height="36"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isChecked ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </svg>
        </motion.div>
      </motion.button>
      <span className="text-lg text-gray-700">had to make checkbox</span>
    </div>
  );
}

function ClothButton() {
  return (
    <div className="flex items-center justify-center w-full h-full gap-3">
      <button
        className="rounded-full p-1  bg-radial-[at_70%_30%] from-gray-400 via-gray-300 to-gray-100
        ring-1 ring-zinc-400 shadow-sm shadow-zinc-700"
      >
        <div className="border border-dashed border-white rounded-4xl">
          <div
            className="w-full h-full group-hover:bg-blue-700 [background-image:url('https://i.pinimg.com/736x/56/0d/3c/560d3ce4cc4b86bbfd5ee8958b462034.jpg')] transition-all duration-300 text-xl rounded-4xl px-8 py-4
            backdrop-blur-sm text-transparent bg-cover relative"
            draggable={false}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/50 rounded-4xl"></div>
            <span
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-[#8499bf] font-extrabold
              text-shadow-lg relative z-10"
            >
              Cloth Button
            </span>
          </div>
        </div>
      </button>
    </div>
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
        isDark ? "bg-slate-800" : "bg-yellow-400"
      }\`
            }
    >
      {isDark ? "🌙" : "☀️"
      }
    </button>
  );
}; `,
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
}; `,
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
    code: "will upload after challenge , if i forget mail me at hi@ashish.services",
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
    code: `Will upload after challenge , if i forget mail me at hi@ashish.services`,
  },
  {
    id: 8,
    title: "Animated Toggle",
    description: "A animated toggle button",
    tags: ["Animation", "Other", "Peerlist"],
    component: (
      <Suspense>
        <AnimatedToggle />
      </Suspense>
    ),
    code: `Will upload after challenge , if i forget mail me at hi@ashish.services`,
  },
  {
    id: 9,
    title: "Animated Checkbox",
    description: "A animated checkbox button",
    tags: ["Animation", "Other", "Peerlist"],
    component: (
      <Suspense
        fallback={
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
        }
      >
        <AnimatedCheckbox />
      </Suspense>
    ),
    code: `Will upload after challenge , if i forget mail me at hi@ashish.services`,
  },
  {
    id: 10,
    title: "Collectibles",
    description: "A collectibles component",
    tags: ["Animation", "Other", "Peerlist"],
    component: (
      <Suspense>
        <Collectibles />
      </Suspense>
    ),
    code: `Will upload after challenge , if i forget mail me at hi@ashish.services`,
  },
  {
    id: 11,
    title: "Clickable Button",
    description: "A clickable button",
    tags: ["Button", "Animation"],
    component: <ClickableItem />,
    code: `Clickable item`,
  },
  {
    id: 12,
    title: "Cloth button",
    description: "A cloth button",
    tags: ["Button", "Animation"],
    component: <ClothButton />,
    code: `Cloth button`,
  },
];

// Add the HoldToDeleteButton component definition
