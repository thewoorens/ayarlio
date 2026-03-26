"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DeviceContextType = {
  isMobile: boolean;
};

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
});

export function DeviceProvider({
  children,
  initialMobile,
}: {
  children: React.ReactNode;
  initialMobile: boolean;
}) {
  const [isMobile, setIsMobile] = useState(initialMobile);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <DeviceContext.Provider value={{ isMobile }}>
      {children}
    </DeviceContext.Provider>
  );
}

export const useDevice = () => useContext(DeviceContext);
