// components/DashboardLayout.tsx
"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Home,
  Settings,
  Component,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// Define the type for our navigation links, supporting nesting for SubMenuItem
interface NavLinkItem {
  id: number;
  name: string;
  icon?: React.ReactNode; // Icon is optional now for sub-links
  link: string;
}

// SubMenuItem Component (for rendering individual items within the Components section)
interface SubMenuItemProps {
  item: NavLinkItem;
  pathname: string;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ item, pathname }) => {
  const isActive = pathname === item.link;

  return (
    <Link
      href={item.link}
      key={item.id}
      className={`
        relative w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200
        ${
          isActive
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-semibold" // Active sub-link highlight
            : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800" // Inactive sub-link
        }
      `}
    >
      <div className="flex-shrink-0 w-8 flex items-center justify-center">
        {item.icon ? (
          item.icon
        ) : (
          <span className="w-1 h-1 rounded-full bg-current mr-2"></span>
        )}
      </div>
      <p className="text-sm whitespace-nowrap">{item.name}</p>
    </Link>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isComponentsOpen, setIsComponentsOpen] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [scrollableHeight, setScrollableHeight] = useState("0px");

  // Top-level navigation links (Home, Settings)
  const topNavLinks = [
    {
      id: 1,
      name: "Home",
      icon: <Home size={20} />,
      link: "/dashboard",
    },
    {
      id: 2,
      name: "Settings",
      icon: <Settings size={20} />,
      link: "/settings",
    },
  ];

  // Data for components sub-menu
  const componentLinks: NavLinkItem[] = [
    { id: 101, name: "Button", link: "/components/button" },
    { id: 102, name: "Input Field", link: "/components/input" },
    { id: 103, name: "Card", link: "/components/card" },
    { id: 104, name: "Modal", link: "/components/modal" },
    { id: 105, name: "Dropdown", link: "/components/dropdown" },
    { id: 106, name: "Checkbox", link: "/components/checkbox" },
    { id: 107, name: "Radio Button", link: "/components/radio" },
    { id: 108, name: "Date Picker", link: "/components/datepicker" },
    { id: 109, name: "Table", link: "/components/table" },
    { id: 110, name: "Accordion", link: "/components/accordion" },
    { id: 111, name: "Alert", link: "/components/alert" },
    { id: 112, name: "Badge", link: "/components/badge" },
    { id: 113, name: "Breadcrumb", link: "/components/breadcrumb" },
    { id: 114, name: "Carousel", link: "/components/carousel" },
    { id: 115, name: "Progress Bar", link: "/components/progressbar" },
    { id: 116, name: "Tooltip", link: "/components/tooltip" },
    { id: 117, name: "Tabs", link: "/components/tabs" },
    { id: 118, name: "Pagination", link: "/components/pagination" },
    { id: 119, name: "Toast", link: "/components/toast" },
    { id: 120, name: "Avatar", link: "/components/avatar" },
    ...Array.from({ length: 20 }).map((_, i) => ({
      id: 200 + i,
      name: `Component ${200 + i}`,
      link: `/components/item-${200 + i}`,
    })),
  ];

  // Check if any component link is active to initially open the section
  const isAnyComponentActive = componentLinks.some((item) =>
    pathname.startsWith(item.link)
  );

  // Set initial state for Components section based on current path
  useEffect(() => {
    if (isAnyComponentActive) {
      setIsComponentsOpen(true);
    }
  }, [isAnyComponentActive]);

  // Handle height animation for expanding/collapsing sub-menu
  useEffect(() => {
    if (scrollableRef.current) {
      if (isComponentsOpen) {
        setScrollableHeight(`${scrollableRef.current.scrollHeight}px`);
      } else {
        setScrollableHeight("0px");
      }
    }
  }, [isComponentsOpen]);

  // Calculate the remaining height for the scrollable components list
  // Adjust this value based on the total height of fixed elements (top links, logout/user buttons, padding)
  const fixedElementsHeight = 100; // Example: approx height of top nav, padding, and bottom buttons
  // You'll need to fine-tune this with your actual CSS
  const scrollableComponentsMaxHeight = `calc(100vh - ${fixedElementsHeight}px)`;

  return (
    <div className="flex flex-1 min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      {/* Sidebar Container */}
      <div className="hidden lg:w-18 hover:w-56 border-r border-zinc-200 dark:border-zinc-800 px-2 py-4 transition-all group h-screen md:flex md:flex-col relative">
        {/* Top-level Nav Links (Home, Settings) */}
        <div className="flex flex-col gap-y-1 w-full items-start mb-4">
          {topNavLinks.map((nav) => {
            const isActive = pathname === nav.link;
            return (
              <Link
                href={nav.link}
                key={nav.id}
                className={`
                  relative w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }
                `}
              >
                <div className="flex-shrink-0 w-8 flex items-center justify-center">
                  {nav.icon}
                </div>
                <p className="absolute left-10 text-md whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-200 pointer-events-none">
                  {nav.name}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Components Section (Collapsible & Scrollable) */}
        {/* Using flex-1 here to make this section take up available space, pushing user/logout down */}
        <div className="flex flex-col gap-y-1 w-full items-start flex-1 overflow-hidden">
          {/* "Components" Main Link */}
          <div className="w-full">
            <Link
              href="/components" // Base link for components
              onClick={(e) => {
                e.preventDefault(); // Prevent full page reload for internal toggle
                setIsComponentsOpen(!isComponentsOpen);
              }}
              className={`
                relative w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 group
                ${
                  pathname.startsWith("/components")
                    ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }
              `}
            >
              <div className="flex-shrink-0 w-8 flex items-center justify-center">
                <Component size={20} />
              </div>
              <p className="absolute left-10 text-md whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-200 pointer-events-none">
                Components
              </p>
              <ChevronRight
                size={16}
                className={`absolute right-2 transition-transform duration-200 ${
                  isComponentsOpen ? "rotate-90" : ""
                }`}
              />
            </Link>

            {/* Scrollable Sub-Menu Area for Components */}
            <div
              style={{ maxHeight: isComponentsOpen ? scrollableHeight : "0px" }} // Apply animated height
              className={`
                ml-6 mt-1 flex flex-col gap-y-1 overflow-hidden transition-all duration-300 ease-in-out
                ${
                  isComponentsOpen
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }
              `}
            >
              {/* Inner div to measure scroll height and apply actual scrolling */}
              <div
                ref={scrollableRef}
                className="overflow-y-auto pr-2"
                style={{ maxHeight: scrollableComponentsMaxHeight }}
              >
                {componentLinks.map((item) => (
                  <SubMenuItem key={item.id} item={item} pathname={pathname} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Logout and User Buttons at the bottom */}
        <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-y-1 w-full items-start">
          <Link
            href="/user-profile" // Example link
            className={`
              relative w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 group
              ${
                pathname === "/user-profile"
                  ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }
            `}
          >
            <div className="flex-shrink-0 w-8 flex items-center justify-center">
              <User size={20} />
            </div>
            <p className="absolute left-10 text-md whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-200 pointer-events-none">
              User Profile
            </p>
          </Link>

          <button
            onClick={() => {
              console.log("Logout clicked!");
              // router.push('/login');
            }}
            className="relative w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 group text-zinc-600 dark:text-zinc-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-200"
          >
            <div className="flex-shrink-0 w-8 flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <p className="absolute left-10 text-md whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-200 pointer-events-none">
              Logout
            </p>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Theme Toggle */}
      <div className="absolute z-99 top-2 right-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
