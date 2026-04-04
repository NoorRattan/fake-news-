import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [hasPointer, setHasPointer] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const cursorDotOutline = useRef(null);
  const cursorDot = useRef(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  
  // Real mouse position
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Interpolated outline position
  const outline = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const mql = window.matchMedia("(pointer: fine)");
    setHasPointer(mql.matches);
    
    const handler = (e) => setHasPointer(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!hasPointer) return;
    
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      // Update dot immediately
      if (cursorDot.current) {
        cursorDot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) ${isClicked ? 'scale(0)' : 'scale(1)'}`;
      }
    };
    
    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    
    const animate = time => {
      if (previousTimeRef.current !== undefined) {
        outline.current.x += (mouse.current.x - outline.current.x) * 0.12;
        outline.current.y += (mouse.current.y - outline.current.y) * 0.12;
        
        if (cursorDotOutline.current) {
          cursorDotOutline.current.style.transform = `translate(${outline.current.x}px, ${outline.current.y}px) translate(-50%, -50%) ${isHovering ? 'scale(1.6)' : 'scale(1)'}`;
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }
    
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [hasPointer, isHovering, isClicked]);

  useEffect(() => {
    if (!hasPointer) return;
    
    const elementsToHover = document.querySelectorAll('a[href], button, [role="button"], [data-cursor="pointer"]');
    
    const handleMouseOver = () => setIsHovering(true);
    const handleMouseOut = () => setIsHovering(false);
    
    elementsToHover.forEach(el => {
      el.addEventListener('mouseenter', handleMouseOver);
      el.addEventListener('mouseleave', handleMouseOut);
    });
    
    return () => {
      elementsToHover.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseOver);
        el.removeEventListener('mouseleave', handleMouseOut);
      });
    };
  }, [hasPointer]);

  if (!hasPointer) return null;

  return (
    <>
      <div 
        ref={cursorDotOutline}
        className="fixed top-0 left-0 w-9 h-9 border-[1.5px] border-accent-purple/50 rounded-full pointer-events-none z-[9999] transition-transform duration-75 origin-center"
        style={{ transform: `translate(-50%, -50%) scale(1)` }}
      />
      <div 
        ref={cursorDot}
        className="fixed top-0 left-0 w-2 h-2 bg-accent-purple rounded-full pointer-events-none z-[9999] transition-transform duration-75 origin-center"
        style={{ transform: `translate(-50%, -50%) scale(1)` }}
      />
    </>
  );
}
