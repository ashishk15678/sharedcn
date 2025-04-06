import { HTMLMotionProps } from "framer-motion";

export interface MotionDivProps extends HTMLMotionProps<"div"> {
  className?: string;
  children?: React.ReactNode;
}