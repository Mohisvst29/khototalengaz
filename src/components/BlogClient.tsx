"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

export default function BlogClient({ initialBlogs }: any) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  useEffect(() => {
    if (initialBlogs.length === 0) {
      fetch("/api/blog")
        .then((res) => res.json())
        .then((data) => setBlogs(data))
        .catch(() => setBlogs([]));
    }
  }, [initialBlogs.length]);

  return (
    <div className="page active" id="page-blog">
      <div className="page-banner">
        <div className="container">
          <h1>{t.nav.blog}</h1>
          <p>{t.home.blog_subtitle}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="properties-grid">
            {blogs.map((post: any) => (
              <Link
                key={post._id}
                href={`/${locale}/blog/${post.slug}`}
                className="property-card"
                style={{ textDecoration: "none" }}
              >
                <div className="property-image">
                  <img src={post.image} alt={post.title} loading="lazy" />
                  <span className="property-badge">{locale === 'ar' ? 'مقال' : 'Article'}</span>
                </div>
                <div className="property-content">
                  <div className="property-price" style={{ fontSize: "14px" }}>
                    {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? "ar-SA" : "en-US")}
                  </div>
                  <h3 className="property-title">{post.title}</h3>
                  <p
                    style={{
                      color: "var(--text-light)",
                      fontSize: "14px",
                      marginTop: "10px",
                      display: "-webkit-box",
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.content}
                  </p>
                  <div
                    style={{
                      marginTop: "16px",
                      color: "var(--primary)",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'} 
                    <i className={`fas fa-arrow-${locale === 'ar' ? 'left' : 'right'}`}></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
