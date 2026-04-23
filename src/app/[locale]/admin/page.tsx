"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type DashboardData = {
  properties: any[];
  projects: any[];
  requests: any[];
  messages: any[];
};

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

  const fetchData = async () => {
    try {
      const res = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/projects"),
        fetch("/api/requests"),
        fetch("/api/messages"),
      ]);

      const json = await Promise.all(res.map((r) => r.json()));

      setData({
        properties: Array.isArray(json[0]) ? json[0] : [],
        projects: Array.isArray(json[1]) ? json[1] : [],
        requests: Array.isArray(json[2]) ? json[2] : [],
        messages: Array.isArray(json[3]) ? json[3] : [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">لوحة التحكم</h2>

        <nav className="space-y-3">
          <Link href={`/${locale}/admin`} className="block hover:text-yellow-300">الرئيسية</Link>
          <Link href={`/${locale}/admin/properties`} className="block hover:text-yellow-300">العقارات</Link>
          <Link href={`/${locale}/admin/projects`} className="block hover:text-yellow-300">المشاريع</Link>
          <Link href={`/${locale}/admin/requests`} className="block hover:text-yellow-300">الطلبات</Link>
          <Link href={`/${locale}/admin/messages`} className="block hover:text-yellow-300">الرسائل</Link>
          <Link href={`/${locale}`} className="block text-yellow-400 mt-4">العودة للموقع</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <Card title="العقارات" value={data.properties.length} color="bg-blue-500" />
            <Card title="المشاريع" value={data.projects.length} color="bg-green-500" />
            <Card title="الطلبات" value={data.requests.length} color="bg-yellow-500" />
            <Card title="الرسائل" value={data.messages.length} color="bg-red-500" />

          </div>
        )}

      </main>
    </div>
  );
}

/* ================= CARD ================= */

function Card({ title, value, color }: any) {
  return (
    <div className={`p-6 rounded-2xl shadow-lg text-white ${color}`}>
      <h2 className="text-lg">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
