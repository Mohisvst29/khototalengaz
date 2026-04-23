"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "ar";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Attempting login with:", username);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (data.success) {
        console.log("LOGIN SUCCESSFUL - Redirecting...");
        window.location.href = `/${locale}/admin`;
      } else {
        toast.error(data.message || (locale === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid credentials"));
      }
    } catch (error) {
      console.error("Login Fetch Error:", error);
      toast.error(locale === "ar" ? "خطأ في الاتصال بالخادم" : "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page" style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
      padding: "20px",
      position: "fixed",
      inset: 0,
      zIndex: 9999
    }} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div style={{ 
        background: "white", 
        padding: "48px", 
        borderRadius: "24px", 
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        width: "100%",
        maxWidth: "450px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            background: "#3b82f6", 
            borderRadius: "16px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 20px",
            color: "white",
            fontSize: "24px",
            boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.5)"
          }}>
            <i className="fas fa-lock"></i>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
            {locale === "ar" ? "لوحة التحكم" : "Admin Dashboard"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "15px" }}>
            {locale === "ar" ? "أهلاً بك مجدداً، يرجى تسجيل الدخول" : "Welcome back, please sign in"}
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>
              {locale === "ar" ? "اسم المستخدم" : "Username"}
            </label>
            <input 
              type="text" 
              className="form-control" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin"
            />
          </div>
          <div className="form-group" style={{ marginTop: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>
              {locale === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: "100%", marginTop: "32px", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? (locale === "ar" ? "جاري التحميل..." : "Loading...") : (locale === "ar" ? "دخول" : "Login")}
          </button>
        </form>
      </div>
    </div>
  );
}
