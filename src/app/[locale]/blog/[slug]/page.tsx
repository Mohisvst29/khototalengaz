import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { mockBlogs } from "@/lib/seed-data";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";

async function getPost(slug: string) {
  try {
    await connectToDatabase();
    const blog = await Blog.findOne({ slug }).lean();
    if (blog) return JSON.parse(JSON.stringify(blog));
    return mockBlogs.find((b) => b.slug === slug);
  } catch (error) {
    return mockBlogs.find((b) => b.slug === slug);
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: locale === 'ar' ? "المقال غير موجود" : "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
      url: `/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: post.createdAt,
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = await getPost(slug);

  if (!post || post.error) {
    return (
      <div className="section text-center">
        <div className="container">
          <h2>{locale === 'ar' ? "المقال غير موجود" : "Article Not Found"}</h2>
          <Link href={`/${locale}/blog`} className="btn btn-primary mt-4">
            {locale === 'ar' ? "العودة للمدونة" : "Back to Blog"}
          </Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": [post.image],
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "author": [{
      "@type": "Person",
      "name": locale === 'ar' ? "إدارة خطوط الإنجاز" : "Khotot Al-Engaz Management",
      "url": "https://khotot-alengaz.com"
    }]
  };

  return (
    <div className="page active">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div
        className="page-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 58, 92, 0.8), rgba(26, 58, 92, 0.8)), url(${post.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
            {post.title}
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              opacity: "0.9",
            }}
          >
            <span>
              <i className="fas fa-calendar-alt"></i>{" "}
              {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? "ar-SA" : "en-US")}
            </span>
            <span>
              <i className="fas fa-user"></i> {locale === 'ar' ? 'الإدارة' : 'Management'}
            </span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div
              className="blog-content"
              style={{
                fontSize: "18px",
                lineHeight: "2",
                color: "var(--text)",
                textAlign: "justify",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>

            <div
              style={{
                marginTop: "60px",
                paddingTop: "32px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link href={`/${locale}/blog`} className="btn btn-outline">
                <i className={`fas fa-arrow-${locale === 'ar' ? 'right' : 'left'}`}></i> {locale === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
              </Link>
              <div className="footer-social" style={{ margin: 0 }}>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
