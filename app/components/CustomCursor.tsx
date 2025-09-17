"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
      backgroundColor: "var(--primary-accent)",
      mixBlendMode: "difference"
    },
    text: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      backgroundColor: "#fff",
      mixBlendMode: "difference"
    },
     link: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      height: 24,
      width: 24,
      backgroundColor: "var(--primary-accent)",
      mixBlendMode: "initial"
    }
  };

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button')) {
        setCursorVariant("link");
      } else if (target.matches('h1, h2, h3, p')) {
         setCursorVariant("text");
      } else {
        setCursorVariant("default");
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <motion.div
      className='fixed top-0 left-0 rounded-full z-[9999] pointer-events-none'
      variants={variants}
      animate={cursorVariant}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  );
};

export default CustomCursor;
