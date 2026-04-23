"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast.error("فشل في تحميل المشاريع");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (project: any = null) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف المشروع بنجاح");
        fetchProjects();
      }
    } catch (error) {
      toast.error("فشل الحذف");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const url = currentProject ? `/api/projects/${currentProject._id}` : "/api/projects";
      const method = currentProject ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success(currentProject ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (error) {
      toast.error("حدث خطأ ما");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-primary">إدارة المشاريع</h2>
          <p className="text-text-light font-medium">إدارة المشاريع السكنية والتجارية للمؤسسة</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          إضافة مشروع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : projects.length > 0 ? (
          projects.map((project: any) => (
            <div key={project._id} className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm group">
              <div className="h-[200px] relative">
                <img src={project.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(project)} className="p-2 bg-white/90 text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-lg">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'completed' ? 'bg-green-500 text-white' : 'bg-accent text-primary-dark'}`}>
                      {project.status === 'completed' ? 'منجز' : 'تحت التنفيذ'}
                   </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">{project.title}</h3>
                <p className="text-sm text-text-light line-clamp-2">{project.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-border">
            <p className="text-text-light italic">لا توجد مشاريع مضافة حالياً</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-black text-primary">{currentProject ? "تعديل مشروع" : "إضافة مشروع"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary">عنوان المشروع</label>
                <input name="title" defaultValue={currentProject?.title} required className="p-3 bg-secondary rounded-lg outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary">رابط الصورة</label>
                <input name="image" defaultValue={currentProject?.image} required className="p-3 bg-secondary rounded-lg outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary">الحالة</label>
                <select name="status" defaultValue={currentProject?.status || "completed"} className="p-3 bg-secondary rounded-lg outline-none">
                  <option value="completed">منجز</option>
                  <option value="in-progress">تحت التنفيذ</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary">الوصف</label>
                <textarea name="description" defaultValue={currentProject?.description} required rows={4} className="p-3 bg-secondary rounded-lg outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-border rounded-xl">إلغاء</button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2">
                  {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
