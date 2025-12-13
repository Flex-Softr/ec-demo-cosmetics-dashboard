"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type TProps = {
  children: JSX.Element;
  tableId: string;
};

const ScrollRestoration = ({
  children,
  tableId = "table-container",
}: TProps) => {
  const pathname = usePathname();

  //Debounce Hook
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const timer = useRef<number | undefined>(undefined);

    const debouncedFunction = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) => {
        if (timer.current !== undefined) {
          clearTimeout(timer.current);
        }
        timer.current = window.setTimeout(() => {
          callback(...args);
        }, delay);
      },
      [callback, delay]
    );

    return debouncedFunction;
  }

  const [scrollPositionX, setScrollPositionX] = useState(0);

  const handleScroll = useDebounce((e) => {
    setScrollPositionX(e.target.scrollTop);

    // sessionStorage.setItem(
    //   "table-scroll-position-x",
    //   e.target.scrollLeft.toString()
    // );
  }, 200);

  useEffect(() => {
    const tableContainer = document.getElementById("table-container");

    if (tableContainer) {
      // Restore scroll position from sessionStorage
      const savedScrollPositionX = sessionStorage.getItem(
        `scroll-${pathname}-${tableId}`
      );
      if (savedScrollPositionX) {
        tableContainer.scrollTop = parseInt(savedScrollPositionX, 10);
      }

      const saveScrollPosition = () => {
        sessionStorage.setItem(
          `scroll-${pathname}-${tableId}`,
          tableContainer.scrollTop.toString()
        );
      };

      // Cleanup to save scroll position on unmount
      return () => {
        saveScrollPosition();
      };
    }
  }, [pathname, tableId]); // Empty dependency array to ensure this runs only on mount/unmount

  useEffect(() => {
    sessionStorage.setItem(
      `scroll-${pathname}-${tableId}`,
      scrollPositionX.toString()
    );
  }, [pathname, scrollPositionX, tableId]);

  // return <div id={tableId}>{children}</div>;
  return (
    <div
      id={tableId}
      onScroll={handleScroll}
      className="w-full h-[calc(100vh-60px)] overflow-y-auto bg-gray-50"
    >
      {children}
    </div>
  );
};

export default ScrollRestoration;

// const scrollPositions = useRef({});
// useEffect(() => {
//   const tableContainer = document.getElementById(tableId);

//   // Load the saved scroll position from sessionStorage when the page loads
//   const savedScrollPosition = sessionStorage.getItem(
//     `scroll-${pathname}-${tableId}`
//   );
//   if (savedScrollPosition && tableContainer) {
//     tableContainer.scrollTop = parseInt(savedScrollPosition, 10);
//   }

//   const handleScroll = () => {
//     if (tableContainer) {
//       scrollPositions.current[pathname] = tableContainer.scrollTop;
//     }
//   };

//   // Attach the scroll event listener
//   tableContainer?.addEventListener("scroll", handleScroll);

//   return () => {
//     // Save the scroll position in sessionStorage when navigating away
//     sessionStorage.setItem(
//       `scroll-${pathname}-${tableId}`,
//       scrollPositions.current[pathname] || 0
//     );
//     // Remove the event listener
//     tableContainer?.removeEventListener("scroll", handleScroll);
//   };
// }, [pathname, tableId]);
