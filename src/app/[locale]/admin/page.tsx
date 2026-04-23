"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

// ✅ Types (المهم)
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

export default function AdminPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ الحل الحقيقي هنا
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
        text: "نطور مشاريع عقارية بمعايير عالمية تناسب تطلعاتكم",
        textEn:
          "Developing world-class real estate projects that meet your aspirations",
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

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propsRes, projectsRes, requestsRes, messagesRes, settingsRes] =
        await Promise.all([
          fetch("/api/properties"),
          fetch("/api/projects"),
          fetch("/api/requests"),
          fetch("/api/messages"),
          fetch("/api/settings"),
        ]);

      const [properties, projects, requests, messages, settings] =
        await Promise.all([
          propsRes.json().then((d) => (Array.isArray(d) ? d : [])),
          projectsRes.json().then((d) => (Array.isArray(d) ? d : [])),
          requestsRes.json().then((d) => (Array.isArray(d) ? d : [])),
          messagesRes.json().then((d) => (Array.isArray(d) ? d : [])),
          settingsRes.json(),
        ]);

      setData((prev) => ({
        ...prev,
        properties,
        projects,
        requests,
        messages,
        settings:
          settings && !settings.error ? settings : prev.settings,
      }));
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
