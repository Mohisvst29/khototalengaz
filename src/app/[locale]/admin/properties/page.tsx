"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      toast.error("فشل في تحميل العقارات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (property: any = null) => {
    setCurrentProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العقار؟")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف العقار بنجاح");
        fetchProperties();
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
    
    // Process tags/images if needed
    const payload = {
      ...data,
      price: Number(data.price),
      rooms: data.rooms ? Number(data.rooms) : undefined,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : undefined,
      area: data.area ? Number(data.area) : undefined,
      featured: data.featured === "on",
      images: [data.imageUrl as string], // Simple for now
    };

    try {
      const url = currentProperty ? `/api/properties/${currentProperty._id}` : "/api/properties";
      const method = currentProperty ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success(currentProperty ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
        setIsModalOpen(false);
        fetchProperties();
      }
    } catch (error) {
      toast.error("حدث خطأ ما");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-primary">إدارة العقارات</h2>
          <p className="text-text-light font-medium">يمكنك إضافة، تعديل أو حذف الوحدات العقارية هنا</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn btn-primary bg-primary flex items-center gap-2 px-6 py-3"
        >
          <Plus size={20} />
          إضافة عقار جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
            <input 
              type="text" 
              placeholder="بحث في العقارات..." 
              className="w-full pr-12 pl-4 py-2.5 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-secondary text-text-light text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">العقار</th>
                <th className="px-6 py-4">النوع</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">المدينة</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                  </td>
                </tr>
              ) : properties.length > 0 ? (
                properties.map((prop: any) => (
                  <tr key={prop._id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative border border-border">
                          {prop.images && prop.images[0] ? (
                            <img src={prop.images[0]} alt="" className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full bg-secondary flex items-center justify-center text-text-light">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-primary line-clamp-1">{prop.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{prop.type === "apartment" ? "شقة" : prop.type === "villa" ? "فيلا" : prop.type}</td>
                    <td className="px-6 py-4 font-black text-primary">{prop.price.toLocaleString()} ريال</td>
                    <td className="px-6 py-4 text-sm font-medium">{prop.city}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${prop.category === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {prop.category === 'sale' ? 'للبيع' : 'للإيجار'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(prop)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(prop._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-text-light italic">
                    لا توجد عقارات مضافة حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-black text-primary">
                {currentProperty ? "تعديل عقار" : "إضافة عقار جديد"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-light hover:text-primary transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary">عنوان العقار</label>
                  <input name="title" defaultValue={currentProperty?.title} required className="input-admin p-3 bg-secondary rounded-lg outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary">المدينة</label>
                  <input name="city" defaultValue={currentProperty?.city} required className="input-admin p-3 bg-secondary rounded-lg outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary">السعر</label>
                  <input name="price" type="number" defaultValue={currentProperty?.price} required className="input-admin p-3 bg-secondary rounded-lg outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary">الموقع (الحي)</label>
                  <input name="location" defaultValue={currentProperty?.location} required className="input-admin p-3 bg-secondary rounded-lg outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary">النوع</label>
                  <select name="type" defaultValue={currentProperty?.type || "apartment"} className="input-admin p-3 bg-secondary rounded-lg outline-none">
                    <option value="apartment">شقة</option>
                    <option value="villa">فيلا</option>
                    <option value="floor">دور</option>
                    <option value="office">مكتب</option>
                    <option value="shop">محل تجاري</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary">الفئة</label>
                  <select name="category" defaultValue={currentProperty?.category || "sale"} className="input-admin p-3 bg-secondary rounded-lg outline-none">
                    <option value="sale">للبيع</option>
                    <option value="rent">للإيجار</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary">الغرف</label>
                  <input name="rooms" type="number" defaultValue={currentProperty?.rooms} className="input-admin p-3 bg-secondary rounded-lg outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary">المساحة (م²)</label>
                  <input name="area" type="number" defaultValue={currentProperty?.area} className="input-admin p-3 bg-secondary rounded-lg outline-none" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary">الوصف</label>
                <textarea name="description" defaultValue={currentProperty?.description} required rows={4} className="input-admin p-3 bg-secondary rounded-lg outline-none resize-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary">رابط الصورة</label>
                <input name="imageUrl" defaultValue={currentProperty?.images?.[0]} required placeholder="https://..." className="input-admin p-3 bg-secondary rounded-lg outline-none" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="featured" id="featured" defaultChecked={currentProperty?.featured} className="w-5 h-5 rounded border-border" />
                <label htmlFor="featured" className="text-sm font-bold text-primary">عقار مميز (يظهر في الصفحة الرئيسية)</label>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border-2 border-border text-text-light font-bold rounded-xl hover:bg-secondary transition-all">إلغاء</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                  {currentProperty ? "حفظ التغييرات" : "إضافة العقار"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
