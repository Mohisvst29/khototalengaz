import React from "react";
import ProjectsClient from "@/components/ProjectsClient";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { mockProjects } from "@/lib/seed-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مشاريعنا | مشاريع سكنية وتجارية في الرياض",
  description: "اطلع على سجل إنجازاتنا من المشاريع السكنية والتجارية. مجمعات سكنية عصرية وأبراج تجارية بمعايير عالمية.",
  alternates: {
    canonical: "/projects",
  },
};

async function getProjects() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean() || [];
    return projects.length > 0 ? JSON.parse(JSON.stringify(projects)) : mockProjects;
  } catch (error) {
    return mockProjects;
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  return <ProjectsClient initialProjects={projects} />;
}
