"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/* ================= TYPES ================= */

type DashboardData = {
  properties: any[];
  projects: any[];
  requests: any[];
  messages: any[];
};

/* ================= PAGE ================= */

export default function AdminPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";

  const [data, setData] = useState<DashboardData>({
    properties: [],
    projects: [],
    requests: [],
    messages: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const responses = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/projects"),
        fetch("/api/requests"),
        fetch("/api/messages"),
      ]);

      responses.forEach((res) => {
        if (!res.ok) throw new Error("API Error");
      });

      const json = await Promise.all(responses.map((r) => r.json()));

      setData({
        properties: Array.isArray(json[0]) ? json[0] : [],
        projects: Array.isArray(json[1]) ? json[1] : [],
        requests: Array.isArray(json[2]) ? json[2] : [],
        messages: Array.isArray(json[3]) ? json[3] : [],
      });
    } catch (err) {
      console.error(err);
      setError("فشل تحميل البيانات (راجع API أو الداتابيز)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= UI ================= */

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {loading && <p>Loading...</p>}

      {error && (
        <p className="text-red-500 font-semibold">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Card title="العقارات" value={data.properties.length} color="bg-blue-500" />
          <Card title="المشاريع" value={data.projects.length} color="bg-green-500" />
          <Card title="الطلبات" value={data.requests.length} color="bg-yellow-500" />
          <Card title="الرسائل" value={data.messages.length} color="bg-red-500" />

        </div>
      )}

    </div>
  );
}

/* ================= CARD ================= */

type CardProps = {
  title: string;
  value: number;
  color: string;
};

function Card({ title, value, color }: CardProps) {
  return (
    <div className={`p-6 rounded-2xl shadow-lg text-white ${color}`}>
      <h2 className="text-lg">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
