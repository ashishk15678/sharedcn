import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  DeleteIcon,
  Grid,
  Home,
  Link,
  List,
  LucideArrowUpRightSquare,
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
import PremiumPlanSelector from "./components/premium";

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
        ring-1 ring-zinc-400 shadow-sm shadow-zinc-700
        relative group overflow-hidden
         transition-all duration-300 active:shadow-xl
        active:scale-105
         "
      >
        {/* <div className="border border-dashed border-white rounded-4xl">
          <div
            className="w-full h-full group-hover:bg-blue-700 
            [background-image:url('https://i.pinimg.com/736x/56/0d/3c/560d3ce4cc4b86bbfd5ee8958b462034.jpg')] transition-all duration-300 text-xl rounded-4xl px-8 py-4
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

       
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{
              transform: "skewX(-20deg)",
              width: "200%",
              left: "-50%",
            }}
          ></div>
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 [transition-delay:100ms] bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              transform: "skewX(-20deg)",
              width: "150%",
              left: "-25%",
            }}
          ></div>
        </div> */}
        <div className="relative z-10 overflow-hidden">
          <div
            className="w-full h-full group-hover:bg-blue-700 
            [background-image:url('https://i.pinimg.com/736x/56/0d/3c/560d3ce4cc4b86bbfd5ee8958b462034.jpg')] transition-all duration-300 text-xl rounded-4xl px-8 py-4
            backdrop-blur-sm text-transparent bg-cover relative"
            draggable={false}
          >
            <span
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-[#8499bf] font-extrabold
                text-shadow-lg "
            >
              Cloth Button
            </span>
            {/* First shine - wide and slanted */}
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{
                transform: "skewX(-20deg)",
                width: "100%",
                left: "-50%",
              }}
            ></div>
            {/* Second shine - thin and slanted */}
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 [transition-delay:100ms] bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                transform: "skewX(-20deg)",
                width: "50%",
                left: "-25%",
              }}
            ></div>
          </div>
        </div>
      </button>
    </div>
  );
}

export function ColorfulBorderBox() {
  return (
    <div className="relative group">
      {/* Main content box */}
      <div className="relative z-10 bg-white rounded-xl p-6 shadow-lg transition-all duration-300 group-hover:translate-y-[-2px]">
        <h3 className="text-lg font-semibold text-gray-800">Content Box</h3>
        <p className="text-gray-600 mt-2">Hover to see the colorful borders!</p>
      </div>

      {/* Colorful 3D borders */}
      <div className="absolute inset-0 transform translate-y-2">
        {/* Red border layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl transform rotate-[-1deg] translate-y-1"></div>
        {/* Blue border layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transform rotate-[1deg] translate-y-2"></div>
        {/* Green border layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl transform rotate-[-0.5deg] translate-y-3"></div>
      </div>
    </div>
  );
}

const LIVE_LINKS = [
  {
    id: 1,
    name: "Astromvp",
    url: "https://astromvp.resources.ashish.services",
    color: "bg-red-500",
    icon: "astromvp",
  },
];

export function LiveLinksModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // @ts-ignore
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            // @ts-ignore
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-4xl border border-white/20 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-200 to-[#8499bf] bg-clip-text text-transparent">
                Live Links
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LIVE_LINKS.map((link) => (
                <div
                  key={link.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${link.color}`}></div>
                    <a
                      href={link.url}
                      target="_blank"
                      className="flex items-center gap-2 w-full "
                    >
                      <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                        {link.name}
                        <LucideArrowUpRightSquare />
                      </h3>
                    </a>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-white">
                    <iframe
                      src={link.url}
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AppleButton() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    // Add ripple effect on mouse move
    if (Math.random() > 0.7) {
      // Control ripple frequency
      setRipples((prev) => [...prev, { x, y, id: rippleId.current++ }]);
    }
  };

  // Remove ripples after animation
  useEffect(() => {
    const timer = setInterval(() => {
      setRipples((prev) =>
        prev.filter((ripple) => ripple.id < rippleId.current - 5)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 via-purple-100/30 to-pink-100/30 blur-3xl" />

      {/* Scrollable container */}
      <div className="h-[200px] overflow-y-auto relative z-10">
        <div className="p-16 flex items-center justify-center">
          <Image
            src="/apple.jpeg"
            alt="Apple"
            width={100}
            height={100}
            className="w-[500px] aspect-square rounded-2xl mix-blend-multiply"
          />
        </div>
      </div>

      {/* Liquid glass button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        {/* Outer glow effect */}
        <div
          className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 
            blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Border container */}
        <div className="relative">
          {/* Border glow layers */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-white/40 via-white/20 to-white/40 blur-sm" />
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-white/30 via-white/10 to-white/30 blur-sm" />

          <button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group overflow-hidden rounded-full ring-1 ring-zinc-200/30 shadow-sm px-12 py-6 text-2xl
              bg-white/0 backdrop-blur-lg
              transition-all duration-300 ease-out
              hover:bg-white/40
              active:bg-white/50
              border border-white/30
              shadow-[0_0_25px_rgba(255,255,255,0.8)]
              hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]
              hover:border-white/40
              hover:scale-[1.02]"
            style={
              {
                "--mouse-x": `${mousePosition.x}px`,
                "--mouse-y": `${mousePosition.y}px`,
              } as React.CSSProperties
            }
          >
            {/* Water surface effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(
                  800px circle at var(--mouse-x) var(--mouse-y),
                  rgba(255, 255, 255, 0.4),
                  transparent 80%
                )`,
                transform: isHovered ? "scale(1.5)" : "scale(1)",
                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 2)",
                filter: "blur(8px)",
              }}
            />

            {/* Water depth effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(
                  600px circle at var(--mouse-x) var(--mouse-y),
                  rgba(255, 255, 255, 0.2),
                  transparent 40%
                )`,
                transform: isHovered ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: "blur(12px)",
              }}
            />

            {/* Ripple effects */}
            {ripples.map((ripple) => (
              <div
                key={ripple.id}
                className="absolute rounded-full bg-zinc-200/80"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  transform: "translate(-50%, -50%)",
                  width: "100px",
                  height: "100px",
                  animation: "ripple 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                  filter: "blur(4px)",
                }}
              />
            ))}

            {/* Water shine effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(
                  45deg,
                  transparent 0%,
                  rgba(255, 255, 255, 0.1) 45%,
                  rgba(255, 255, 255, 0.3) 50%,
                  rgba(255, 255, 255, 0.1) 55%,
                  transparent 100%
                )`,
                transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
                transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: "blur(2px)",
              }}
            />

            {/* Button content */}
            <span className="relative z-10 text-zinc-800 font-medium">
              Something
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function GtaMasking() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;

    setScrollProgress(progress);

    // Get both images
    const firstImage = container.querySelector(
      "img:not(#second-img)"
    ) as HTMLImageElement;
    const secondImage = container.querySelector(
      "#second-img"
    ) as HTMLImageElement;

    if (firstImage) {
      // First image scales up and fades out in the first 60% of the scroll
      const firstImageProgress = Math.min(progress * 1.67, 100); // Complete in first 60% of scroll
      const scale = 1 + firstImageProgress * 0.015; // Scale up to 2.5x
      const opacity = 1 - firstImageProgress / 120; // Slower fade out

      firstImage.style.transform = `scale(${scale})`;
      firstImage.style.opacity = `${opacity}`;
    }

    if (secondImage) {
      // Second image starts appearing after first image is mostly gone (at 50% scroll)
      const secondImageProgress = Math.max(0, (progress - 50) * 2); // Start at 50% scroll, complete by 100%
      const scale = 0.95 + secondImageProgress * 0.001; // Subtle scale up
      const opacity = Math.min(secondImageProgress / 100, 1);

      secondImage.style.transform = `scale(${scale})`;
      secondImage.style.opacity = `${opacity}`;
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="bg-zinc-900 rounded-xl p-4 w-[1400px] h-[800px] overflow-y-auto relative"
    >
      {/* Add more content to enable longer scrolling */}
      <div className="h-[3000px] relative">
        <div className="sticky top-0 h-[800px] flex items-center justify-center">
          <div className="relative w-[1000px] h-[600px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/gta.svg"
                alt="GTA Logo"
                width={400}
                height={400}
                draggable={false}
                className="transition-all duration-300 ease-out absolute max-w-[120%] h-auto z-10"
              />
              <Image
                id="second-img"
                src="/gta5.jpg"
                alt="GTA Background"
                width={1000}
                height={600}
                draggable={false}
                className="absolute opacity-0 transition-all duration-300 ease-out object-cover rounded-xl w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
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
  {
    id: 13,
    title: "A premium plan selector",
    description: "A premium plan selector",
    tags: ["Modal", "Other"],
    component: <PremiumPlanSelector />,
    code: `Premium plan selector`,
  },
  {
    id: "14",
    title: "Colorful Border Box",
    description: "A box with colorful 3D borders that appear on hover",
    tags: ["Animation", "Borders", "Effects"],
    component: <ColorfulBorderBox />,
    code: `function ColorfulBorderBox() {
  return (
    <div className="relative group">
      {/* Main content box */}
      <div className="relative z-10 bg-white rounded-xl p-6 shadow-lg transition-all duration-300 group-hover:translate-y-[-2px]">
        <h3 className="text-lg font-semibold text-gray-800">Content Box</h3>
        <p className="text-gray-600 mt-2">Hover to see the colorful borders!</p>
      </div>

      {/* Colorful 3D borders */}
      <div className="absolute inset-0 transform translate-y-2">
        {/* Red border layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl transform rotate-[-1deg] translate-y-1"></div>
        {/* Blue border layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transform rotate-[1deg] translate-y-2"></div>
        {/* Green border layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl transform rotate-[-0.5deg] translate-y-3"></div>
      </div>
    </div>
  );
}`,
  },
  {
    id: "15",
    title: "Gta Masking",
    description: "A gta masking component",
    tags: ["Animation", "Other"],
    component: <GtaMasking />,
    code: `Gta masking`,
  },
  {
    id: "16",
    title: "Apple Button",
    description: "A apple button",
    tags: ["Button", "Animation"],
    component: <AppleButton />,
    code: `Apple button`,
  },
];

// Add the HoldToDeleteButton component definition
