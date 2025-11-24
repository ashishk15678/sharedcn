"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect } from "react";
import ReactGA from "react-ga4";

export function AnalyticsComponent() {
  const TRACKING_ID = "G-NHX0XB1HWG";
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    // Send pageview with a custom path
    ReactGA.send({
      hitType: "pageview",
      page: "/landingpage",
      title: "Landing Page",
    });
  }, []);
  return <Analytics />;
}
