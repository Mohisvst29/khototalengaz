"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

/* ================= TYPES ================= */

type SettingsType = {
  branding: { logo: string; logoSize: number };
  hero: {
    title: string;
    titleEn: string;
    subtitle: string;
    subtitleEn: string;
    media: string;
    mediaType: string;
  };
  announcement: {
    text: string;
    textEn: string;
    color: string;
    speed: number;
    enabled: boolean;
  };
  contact: {
    phone1: string;
    phone2: string;
    whatsapp: string;
    email: string;
    address: string;
    addressEn: string;
    mapLink: string;
  };
  about: {
    content: string;
    contentEn: string;
    images: string[];
  };
};

type DashboardData = {
  properties: any[];
  projects: any[];
  requests: any[];
  messages: any[];
  settings: SettingsType;
};

/* ================= COMPONENT ================= */

export default function AdminPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<DashboardData>({
    properties: [],
    projects: [],
    requests: [],
    messages: [],
    settings: {
      branding: { logo: "/logo.png", logoSize: 50 },
      hero: {
        title: "",
        titleEn: "",
        subtitle: "",
        subtitleEn: "",
        media: "",
        mediaType: "image",
      },
      announcement: {
        text: "",
        textEn: "",
        color: "#1a3a5c",
        speed: 30,
        enabled: true,
      },
      contact: {
        phone1: "",
        phone2: "",
        whatsapp: "",
        email: "",
        address: "",
        addressEn: "",
        mapLink: "",
      },
      about: {
        content: "",
        contentEn: "",
        images: [],
      },
    },
  });

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/projects"),
        fetch("/api/requests"),
        fetch("/api/messages"),
        fetch("/api/settings"),
      ]);

      const json = await Promise.all(res.map((r) => r.json()));

      const properties = Array.isArray(json[0]) ? json[0] : [];
      const projects = Array.isArray(json[1]) ? json[1] : [];
      const requests = Array.isArray(json[2]) ? json[2] : [];
      const messages = Array.isArray(json[3]) ? json[3] : [];
      const settings = json[4];

      setData((prev: DashboardData) => ({
        ...prev,
        properties,
        projects,
        requests,
        messages,
        settings:
          settings && !settings.error ? settings : prev.settings,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= UI ================= */

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Properties: {data.properties.length}</p>
          <p>Projects: {data.projects.length}</p>
          <p>Requests: {data.requests.length}</p>
          <p>Messages: {data.messages.length}</p>

          <Link href={`/${locale}`}>
            <button style={{ marginTop: "20px" }}>
              Go to Website
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
