"use client";

import { useEffect, useState, useContext } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DragContext } from "../../App";

interface CustomCursorProps {
  children: React.ReactNode;
  className?: string;
}

export function Pointer({ children, className }: CustomCursorProps) {
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { setDragPosition } = useContext(DragContext);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
setMousePosition({ x: e.clientX, y: e.clientY });
      setDragPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [setDragPosition]);

  return (
    <>
      {/* Custom cursor */}
      {/* Custom cursor color */}
      <div
        className={cn("custom-cursor", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {children}
      </div>
    </>
  );
}
