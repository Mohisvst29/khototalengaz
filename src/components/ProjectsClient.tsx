"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

export default function ProjectsClient({ initialProjects }: any) {
  const [projects, setProjects] = useState(initialProjects);
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  useEffect(() => {
    if (initialProjects.length === 0) {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => setProjects(data))
        .catch(() => setProjects([]));
    }
  }, [initialProjects.length]);

  return (
    <div className="page active" id="page-projects">
      <div className="page-banner">
        <div className="container">
          <h1>{t.nav.projects}</h1>
          <p>
            {locale === 'ar' 
              ? 'مشاريعنا السكنية والتجارية المنجزة والقيد التنفيذ' 
              : 'Our completed and ongoing residential and commercial projects'}
          </p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="projects-grid" id="projectsGrid">
            {projects.map((project: any) => (
              <div key={project._id} className="project-card">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
