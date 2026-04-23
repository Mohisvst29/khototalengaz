"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AOSInit = () => {
  useEffect(() => {
    AOS.init({
      once: true,
      offset: 50,
      duration: 1000,
    });
  }, []);

  return null;
};

export default AOSInit;
