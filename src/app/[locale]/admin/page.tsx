"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

type DashboardData = {
  properties: any[];
  projects: any[];
  blogs: any[];
  requests: any[];
  messages: any[];
  settings: any;
};

export default function AdminPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<DashboardData>({
    properties: [],
    projects: [],
    blogs: [],
    requests: [],
    messages: [],
    settings: {
      branding: { logo: "/logo.png", logoSize: 50 },
      hero: { 
        title: "", titleEn: "", subtitle: "", subtitleEn: "", 
        slides: [{ url: "", type: "image" }],
        media: "", mediaType: "image" 
      },
      announcement: { 
        text: "نطور مشاريع عقارية بمعايير عالمية تناسب تطلعاتكم", 
        textEn: "Developing world-class real estate projects that meet your aspirations", 
        color: "#1a3a5c", 
        speed: 30, 
        enabled: true 
      },
      contact: { phone1: "", phone2: "", whatsapp: "", email: "", address: "", addressEn: "", mapLink: "" },
      about: { content: "", contentEn: "", images: [] },
      services: [
        { title: "", titleEn: "", description: "", descriptionEn: "", image: "" },
        { title: "", titleEn: "", description: "", descriptionEn: "", image: "" },
        { title: "", titleEn: "", description: "", descriptionEn: "", image: "" }
      ],
      seo: {
        metaTitle: "", metaTitleEn: "",
        metaDescription: "", metaDescriptionEn: "",
        keywords: "", keywordsEn: ""
      },
      social: {
        twitter: "", instagram: "", linkedin: "", snapchat: "", tiktok: "", facebook: ""
      }
    },
  });
  const [activeSettingsTab, setActiveSettingsTab] = useState("branding");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propsRes, projectsRes, blogRes, requestsRes, messagesRes, settingsRes] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/projects"),
        fetch("/api/blog"),
        fetch("/api/requests"),
        fetch("/api/messages"),
        fetch("/api/settings"),
      ]);

      const [properties, projects, blogs, requests, messages, settings] = await Promise.all([
        propsRes.json().then(d => Array.isArray(d) ? d : []),
        projectsRes.json().then(d => Array.isArray(d) ? d : []),
        blogRes.json().then(d => Array.isArray(d) ? d : []),
        requestsRes.json().then(d => Array.isArray(d) ? d : []),
        messagesRes.json().then(d => Array.isArray(d) ? d : []),
        settingsRes.json(),
      ]);

      setData({ 
        properties, 
        projects, 
        blogs,
        requests, 
        messages, 
        settings: (settings && !settings.error) ? settings : data.settings 
      });
    } catch (error) {
      toast.error("Error fetching data");
      setData({ properties: [], projects: [], blogs: [], requests: [], messages: [], settings: data.settings });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(locale === 'ar' ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?")) return;

    try {
      const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(locale === 'ar' ? "تم الحذف بنجاح" : "Deleted successfully");
        fetchData();
      } else {
        toast.error("Error deleting item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving settings...", data.settings);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.settings),
      });
      if (res.ok) {
        toast.success(locale === 'ar' ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully");
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || "Error saving settings");
      }
    } catch (error) {
      console.error("Save Settings Error:", error);
      toast.error("Error saving settings");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = `/${locale}/admin/login`;
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      if (res.ok) {
        toast.success(locale === 'ar' ? "تم تغيير كلمة المرور" : "Password changed");
        setPasswordData({ currentPassword: "", newPassword: "" });
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to change password");
      }
    } catch (error) {
      toast.error("Error");
    } finally {
      setChangingPassword(false);
    }
  };

  const updateSetting = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [section]: {
          ...prev.settings[section as keyof typeof prev.settings],
          [field]: value
        }
      } as any
    }));
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const dataRes = await res.json();
      if (dataRes.urls) {
        setFormData((prev: any) => ({ ...prev, images: [...(prev.images || []), ...dataRes.urls] }));
        toast.success(locale === 'ar' ? "تم رفع الصور بنجاح" : "Images uploaded successfully");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev: any) => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleOpenModal = (type: string, item: any = null) => {
    setEditingItem({ type, item });
    if (item) {
      setFormData(item);
    } else {
      if (type === 'properties') {
        setFormData({ title: "", price: "", city: "riyadh", location: "", type: "apartment", category: "sale", images: [], rooms: 3, area: 150, description: "وصف العقار هنا" });
      } else if (type === 'projects') {
        setFormData({ title: "", description: "", images: [] });
      } else if (type === 'blogs') {
        setFormData({ title: "", titleEn: "", description: "", descriptionEn: "", slug: "", image: "" });
      }
    }
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = editingItem.type;
    const isEdit = !!editingItem.item;
    const url = isEdit ? `/api/${type}/${editingItem.item._id}` : `/api/${type}`;
    const method = isEdit ? "PUT" : "POST";

    console.log(`Submitting ${type}...`, formData);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(isEdit ? (locale === 'ar' ? "تم التحديث" : "Updated") : (locale === 'ar' ? "تمت الإضافة" : "Added"));
        setShowModal(false);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || "Error saving");
      }
    } catch (error) {
      console.error("Form Submit Error:", error);
      toast.error("Error saving item");
    }
  };

  const navItems = [
    { key: "dashboard", name: "لوحة التحكم", icon: "fa-home" },
    { key: "sale-units", name: "وحدات للبيع", icon: "fa-building" },
    { key: "rent-units", name: "وحدات للإيجار", icon: "fa-key" },
    { key: "projects", name: "المشاريع", icon: "fa-project-diagram" },
    { key: "articles", name: "المقالات", icon: "fa-newspaper" },
    { key: "leads", name: "الطلبات", icon: "fa-users" },
    { key: "messages", name: "الرسائل", icon: "fa-envelope" },
    { key: "settings", name: "الإعدادات", icon: "fa-cog" },
  ];

  const renderDashboard = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon-box">
            <i className="fas fa-home"></i>
          </div>
          <h3>إجمالي العقارات</h3>
          <div className="value">{data.properties.length}</div>
        </div>
        <div className="stat-card">
          <div className="icon-box">
            <i className="fas fa-project-diagram"></i>
          </div>
          <h3>إجمالي المشاريع</h3>
          <div className="value">{data.projects.length}</div>
        </div>
        <div className="stat-card">
          <div className="icon-box">
            <i className="fas fa-user-clock"></i>
          </div>
          <h3>إجمالي الطلبات</h3>
          <div className="value">{data.requests.length}</div>
        </div>
        <div className="stat-card">
          <div className="icon-box">
            <i className="fas fa-newspaper"></i>
          </div>
          <h3>إجمالي المقالات</h3>
          <div className="value">{data.blogs.length}</div>
        </div>
        <div className="stat-card">
          <div className="icon-box">
            <i className="fas fa-envelope"></i>
          </div>
          <h3>إجمالي الرسائل</h3>
          <div className="value">{data.messages.length}</div>
        </div>
      </div>
      
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>أحدث الطلبات</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>العميل</th>
              <th>المدينة</th>
              <th>النوع</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {data.requests.length > 0 ? data.requests.slice(0, 5).map((req: any) => (
              <tr key={req._id}>
                <td>{req.name}</td>
                <td>{req.city}</td>
                <td>{req.propertyType}</td>
                <td>{new Date(req.createdAt).toLocaleDateString("ar-SA")}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="text-center">لا يوجد طلبات حالياً</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTable = (type: string, columns: any[], items: any[]) => (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h3>قائمة {type === 'properties' ? 'العقارات' : type === 'projects' ? 'المشاريع' : type === 'blogs' ? 'المقالات' : type === 'requests' ? 'الطلبات' : 'الرسائل'}</h3>
        {(type === 'properties' || type === 'projects' || type === 'blogs') && (
          <button className="btn btn-primary" onClick={() => handleOpenModal(type)}>
            إضافة جديد +
          </button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            {columns.map(col => <th key={col.key}>{col.name}</th>)}
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item._id}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.key === 'image' || col.key === 'images' ? (
                    <img src={Array.isArray(item.images) ? item.images[0] : item.image} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : col.key === 'createdAt' ? (
                    new Date(item[col.key]).toLocaleDateString("ar-SA")
                  ) : item[col.key]}
                </td>
              ))}
              <td>
                {(type === 'properties' || type === 'projects' || type === 'blogs') && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleOpenModal(type, item)} style={{ marginLeft: '5px' }}>
                    <i className="fas fa-edit"></i>
                  </button>
                )}
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(type === 'sale-units' || type === 'rent-units' ? 'properties' : type, item._id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-container">
      <style jsx>{`
        .settings-container { background: white; border-radius: 20px; padding: 32px; border: 1px solid #f1f5f9; }
        .settings-tabs { display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
        .settings-tabs button { padding: 10px 20px; border-radius: 8px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .settings-tabs button.active { background: var(--admin-primary); color: white; }
        .settings-section { animation: fadeIn 0.3s ease; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
      `}</style>
      
      <div className="settings-tabs">
        <button className={activeSettingsTab === 'branding' ? 'active' : ''} onClick={() => setActiveSettingsTab('branding')}>الهوية</button>
        <button className={activeSettingsTab === 'hero' ? 'active' : ''} onClick={() => setActiveSettingsTab('hero')}>الرئيسية</button>
        <button className={activeSettingsTab === 'announcement' ? 'active' : ''} onClick={() => setActiveSettingsTab('announcement')}>الشريط الإعلاني</button>
        <button className={activeSettingsTab === 'contact' ? 'active' : ''} onClick={() => setActiveSettingsTab('contact')}>التواصل</button>
        <button className={activeSettingsTab === 'about' ? 'active' : ''} onClick={() => setActiveSettingsTab('about')}>عن الشركة</button>
        <button className={activeSettingsTab === 'services' ? 'active' : ''} onClick={() => setActiveSettingsTab('services')}>الخدمات (3 أقسام)</button>
        <button className={activeSettingsTab === 'seo' ? 'active' : ''} onClick={() => setActiveSettingsTab('seo')}>السيو (SEO)</button>
        <button className={activeSettingsTab === 'social' ? 'active' : ''} onClick={() => setActiveSettingsTab('social')}>التواصل الاجتماعي</button>
        <button className={activeSettingsTab === 'security' ? 'active' : ''} onClick={() => setActiveSettingsTab('security')}>الأمان</button>
      </div>

      <form onSubmit={handleSaveSettings}>
        {activeSettingsTab === 'branding' && (
          <div className="settings-section">
            <div className="form-group">
              <label>الشعار (Logo)</label>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
                <img src={data.settings.branding.logo} alt="Logo" style={{ height: '60px', padding: '10px', background: '#f8fafc', borderRadius: '8px' }} />
                <input type="file" onChange={async (e) => {
                  const files = e.target.files;
                  if (!files?.[0]) return;
                  const fd = new FormData();
                  fd.append("files", files[0]);
                  const res = await fetch("/api/upload", { method: "POST", body: fd });
                  const resData = await res.json();
                  if (resData.urls?.[0]) updateSetting('branding', 'logo', resData.urls[0]);
                }} />
              </div>
            </div>
            <div className="form-group">
              <label>حجم الشعار (px)</label>
              <input type="number" className="form-control" value={data.settings.branding.logoSize} onChange={e => updateSetting('branding', 'logoSize', parseInt(e.target.value))} />
            </div>
          </div>
        )}

        {activeSettingsTab === 'hero' && (
          <div className="settings-section">
            <div className="form-row">
              <div className="form-group">
                <label>العنوان (AR)</label>
                <input type="text" className="form-control" value={data.settings.hero.title} onChange={e => updateSetting('hero', 'title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>العنوان (EN)</label>
                <input type="text" className="form-control" value={data.settings.hero.titleEn} onChange={e => updateSetting('hero', 'titleEn', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>الوصف (AR)</label>
                <textarea className="form-control" value={data.settings.hero.subtitle} onChange={e => updateSetting('hero', 'subtitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label>الوصف (EN)</label>
                <textarea className="form-control" value={data.settings.hero.subtitleEn} onChange={e => updateSetting('hero', 'subtitleEn', e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '16px' }}>صور وفيديوهات الرئيسية (Slide Show)</h4>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => {
                  const newSlides = [...(data.settings.hero.slides || [])];
                  newSlides.push({ url: "", type: "image" });
                  updateSetting('hero', 'slides', newSlides);
                }}>إضافة شريحة +</button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                {(data.settings.hero.slides || []).map((slide: any, index: number) => (
                  <div key={index} style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '600' }}>شريحة #{index + 1}</span>
                      <button type="button" style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => {
                        const newSlides = data.settings.hero.slides.filter((_: any, i: number) => i !== index);
                        updateSetting('hero', 'slides', newSlides);
                      }}><i className="fas fa-trash"></i></button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>نوع الوسائط</label>
                        <select className="form-control" value={slide.type} onChange={e => {
                          const newSlides = [...data.settings.hero.slides];
                          newSlides[index].type = e.target.value;
                          updateSetting('hero', 'slides', newSlides);
                        }}>
                          <option value="image">صورة</option>
                          <option value="video">فيديو</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>رفع ملف (صورة/فيديو)</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {slide.url && (
                            slide.type === 'video' ? 
                              <div style={{ width: '50px', height: '40px', background: '#000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-video" style={{ color: 'white', fontSize: '12px' }}></i></div> :
                              <img src={slide.url} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          )}
                          <input type="file" onChange={async (e) => {
                            const files = e.target.files;
                            if (!files?.[0]) return;
                            const file = files[0];
                            const isVideo = file.type.startsWith('video/') || 
                                            file.name.toLowerCase().endsWith('.mp4') || 
                                            file.name.toLowerCase().endsWith('.webm') || 
                                            file.name.toLowerCase().endsWith('.mov');
                            
                            const fd = new FormData();
                            fd.append("files", file);
                            const res = await fetch("/api/upload", { method: "POST", body: fd });
                            const resData = await res.json();
                            if (resData.urls?.[0]) {
                              const newSlides = [...data.settings.hero.slides];
                              newSlides[index].url = resData.urls[0];
                              newSlides[index].type = isVideo ? 'video' : 'image';
                              updateSetting('hero', 'slides', newSlides);
                              toast.success("تم الرفع بنجاح");
                            }
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'announcement' && (
          <div className="settings-section">
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={data.settings.announcement.enabled} onChange={e => updateSetting('announcement', 'enabled', e.target.checked)} id="enableAnn" />
              <label htmlFor="enableAnn">تفعيل الشريط الإعلاني</label>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>النص (AR)</label>
                <input type="text" className="form-control" value={data.settings.announcement.text} onChange={e => updateSetting('announcement', 'text', e.target.value)} />
              </div>
              <div className="form-group">
                <label>النص (EN)</label>
                <input type="text" className="form-control" value={data.settings.announcement.textEn} onChange={e => updateSetting('announcement', 'textEn', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>لون الشريط</label>
                <input type="color" className="form-control" value={data.settings.announcement.color} onChange={e => updateSetting('announcement', 'color', e.target.value)} style={{ height: '45px' }} />
              </div>
              <div className="form-group">
                <label>سرعة الحركة (ثانية)</label>
                <input type="number" className="form-control" value={data.settings.announcement.speed} onChange={e => updateSetting('announcement', 'speed', parseInt(e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'contact' && (
          <div className="settings-section">
            <div className="form-row">
              <div className="form-group">
                <label>الهاتف الرئيسي</label>
                <input type="text" className="form-control" value={data.settings.contact.phone1} onChange={e => updateSetting('contact', 'phone1', e.target.value)} />
              </div>
              <div className="form-group">
                <label>الهاتف الثاني</label>
                <input type="text" className="form-control" value={data.settings.contact.phone2} onChange={e => updateSetting('contact', 'phone2', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>واتساب (رقم فقط)</label>
                <input type="text" className="form-control" value={data.settings.contact.whatsapp} onChange={e => updateSetting('contact', 'whatsapp', e.target.value)} />
              </div>
              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" className="form-control" value={data.settings.contact.email} onChange={e => updateSetting('contact', 'email', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>العنوان الكامل (AR)</label>
              <input type="text" className="form-control" value={data.settings.contact.address} onChange={e => updateSetting('contact', 'address', e.target.value)} />
            </div>
            <div className="form-group">
              <label>رابط الخريطة (Embed URL)</label>
              <input type="text" className="form-control" value={data.settings.contact.mapLink} onChange={e => updateSetting('contact', 'mapLink', e.target.value)} />
            </div>
          </div>
        )}

        {activeSettingsTab === 'about' && (
          <div className="settings-section">
            <div className="form-group">
              <label>المحتوى التعريفي (AR)</label>
              <textarea className="form-control" rows={8} value={data.settings.about.content} onChange={e => updateSetting('about', 'content', e.target.value)} />
            </div>
            <div className="form-group">
              <label>المحتوى التعريفي (EN)</label>
              <textarea className="form-control" rows={8} value={data.settings.about.contentEn} onChange={e => updateSetting('about', 'contentEn', e.target.value)} />
            </div>
            <div className="form-group">
              <label>صور المعرض</label>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
                {data.settings.about.images?.map((img: string, idx: number) => (
                  <div key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                    <button type="button" onClick={() => {
                      const newImgs = [...data.settings.about.images];
                      newImgs.splice(idx, 1);
                      updateSetting('about', 'images', newImgs);
                    }} style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--admin-danger)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                  </div>
                ))}
                <label style={{ width: '100px', height: '100px', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <i className="fas fa-plus" style={{ color: '#64748b' }}></i>
                  <input type="file" multiple onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;
                    const fd = new FormData();
                    for (let i = 0; i < files.length; i++) fd.append("files", files[i]);
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    const resData = await res.json();
                    if (resData.urls) updateSetting('about', 'images', [...(data.settings.about.images || []), ...resData.urls]);
                  }} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'services' && (
          <div className="settings-section">
            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>إدارة الأقسام الثلاثة الرئيسية</h3>
            {[0, 1, 2].map((index) => (
              <div key={index} className="service-edit-box" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '20px', background: '#f8fafc' }}>
                <h4 style={{ marginBottom: '15px' }}>القسم {index + 1}</h4>
                <div className="form-group">
                  <label>صورة القسم</label>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
                    {data.settings.services?.[index]?.image && (
                      <img src={data.settings.services[index].image} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}
                    <input type="file" onChange={async (e) => {
                      const files = e.target.files;
                      if (!files?.[0]) return;
                      const fd = new FormData();
                      fd.append("files", files[0]);
                      const res = await fetch("/api/upload", { method: "POST", body: fd });
                      const resData = await res.json();
                      if (resData.urls?.[0]) {
                        const newServices = [...(data.settings.services || [])];
                        if (!newServices[index]) newServices[index] = {};
                        newServices[index].image = resData.urls[0];
                        setData((prev: any) => ({
                          ...prev,
                          settings: { ...prev.settings, services: newServices }
                        }));
                      }
                    }} />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>العنوان (عربي)</label>
                    <input type="text" className="form-control" value={data.settings.services?.[index]?.title || ""} onChange={e => {
                      const newServices = [...(data.settings.services || [])];
                      if (!newServices[index]) newServices[index] = {};
                      newServices[index].title = e.target.value;
                      setData((prev: any) => ({ ...prev, settings: { ...prev.settings, services: newServices } }));
                    }} />
                  </div>
                  <div className="form-group">
                    <label>العنوان (English)</label>
                    <input type="text" className="form-control" value={data.settings.services?.[index]?.titleEn || ""} onChange={e => {
                      const newServices = [...(data.settings.services || [])];
                      if (!newServices[index]) newServices[index] = {};
                      newServices[index].titleEn = e.target.value;
                      setData((prev: any) => ({ ...prev, settings: { ...prev.settings, services: newServices } }));
                    }} />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>الوصف (عربي)</label>
                    <textarea className="form-control" rows={2} value={data.settings.services?.[index]?.description || ""} onChange={e => {
                      const newServices = [...(data.settings.services || [])];
                      if (!newServices[index]) newServices[index] = {};
                      newServices[index].description = e.target.value;
                      setData((prev: any) => ({ ...prev, settings: { ...prev.settings, services: newServices } }));
                    }} />
                  </div>
                  <div className="form-group">
                    <label>الوصف (English)</label>
                    <textarea className="form-control" rows={2} value={data.settings.services?.[index]?.descriptionEn || ""} onChange={e => {
                      const newServices = [...(data.settings.services || [])];
                      if (!newServices[index]) newServices[index] = {};
                      newServices[index].descriptionEn = e.target.value;
                      setData((prev: any) => ({ ...prev, settings: { ...prev.settings, services: newServices } }));
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSettingsTab === 'seo' && (
          <div className="settings-section">
            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>إعدادات السيو (SEO)</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>عنوان الموقع (عربي)</label>
                <input type="text" className="form-control" value={data.settings.seo?.metaTitle || ""} onChange={e => updateSetting('seo', 'metaTitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Site Title (English)</label>
                <input type="text" className="form-control" value={data.settings.seo?.metaTitleEn || ""} onChange={e => updateSetting('seo', 'metaTitleEn', e.target.value)} />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>وصف الموقع (عربي)</label>
                <textarea className="form-control" rows={3} value={data.settings.seo?.metaDescription || ""} onChange={e => updateSetting('seo', 'metaDescription', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Site Description (English)</label>
                <textarea className="form-control" rows={3} value={data.settings.seo?.metaDescriptionEn || ""} onChange={e => updateSetting('seo', 'metaDescriptionEn', e.target.value)} />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>الكلمات المفتاحية (عربي)</label>
                <input type="text" className="form-control" value={data.settings.seo?.keywords || ""} onChange={e => updateSetting('seo', 'keywords', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Keywords (English)</label>
                <input type="text" className="form-control" value={data.settings.seo?.keywordsEn || ""} onChange={e => updateSetting('seo', 'keywordsEn', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'social' && (
          <div className="settings-section">
            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>روابط التواصل الاجتماعي</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>تويتر (Twitter)</label>
                <input type="text" className="form-control" value={data.settings.social?.twitter || ""} onChange={e => updateSetting('social', 'twitter', e.target.value)} placeholder="https://twitter.com/..." />
              </div>
              <div className="form-group">
                <label>إنستجرام (Instagram)</label>
                <input type="text" className="form-control" value={data.settings.social?.instagram || ""} onChange={e => updateSetting('social', 'instagram', e.target.value)} placeholder="https://instagram.com/..." />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>لينكد إن (LinkedIn)</label>
                <input type="text" className="form-control" value={data.settings.social?.linkedin || ""} onChange={e => updateSetting('social', 'linkedin', e.target.value)} placeholder="https://linkedin.com/..." />
              </div>
              <div className="form-group">
                <label>فيسبوك (Facebook)</label>
                <input type="text" className="form-control" value={data.settings.social?.facebook || ""} onChange={e => updateSetting('social', 'facebook', e.target.value)} placeholder="https://facebook.com/..." />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>سناب شات (Snapchat)</label>
                <input type="text" className="form-control" value={data.settings.social?.snapchat || ""} onChange={e => updateSetting('social', 'snapchat', e.target.value)} placeholder="https://snapchat.com/..." />
              </div>
              <div className="form-group">
                <label>تيك توك (TikTok)</label>
                <input type="text" className="form-control" value={data.settings.social?.tiktok || ""} onChange={e => updateSetting('social', 'tiktok', e.target.value)} placeholder="https://tiktok.com/@..." />
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'security' && (
          <div className="settings-section">
            <h3>تغيير كلمة المرور</h3>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>كلمة المرور الحالية</label>
              <input 
                type="password" 
                className="form-control" 
                value={passwordData.currentPassword} 
                onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} 
              />
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>كلمة المرور الجديدة</label>
              <input 
                type="password" 
                className="form-control" 
                value={passwordData.newPassword} 
                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
              />
            </div>
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ marginTop: '20px' }} 
              onClick={handleChangePassword}
              disabled={changingPassword}
            >
              {changingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </button>
          </div>
        )}

        {activeSettingsTab !== 'security' && (
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '16px' }}>حفظ التغييرات</button>
          </div>
        )}
      </form>
    </div>
  );

  const getPageContent = () => {
    switch (currentPage) {
      case "dashboard": return renderDashboard();
      case "sale-units": 
        return renderTable("properties", [
          { key: "images", name: "صورة" },
          { key: "title", name: "العنوان" },
          { key: "price", name: "السعر" },
          { key: "city", name: "المدينة" }
        ], data.properties.filter((p: any) => p.category === 'sale'));
      case "rent-units":
        return renderTable("properties", [
          { key: "images", name: "صورة" },
          { key: "title", name: "العنوان" },
          { key: "price", name: "السعر" },
          { key: "city", name: "المدينة" }
        ], data.properties.filter((p: any) => p.category === 'rent'));
      case "projects":
        return renderTable("projects", [
          { key: "images", name: "صورة" },
          { key: "title", name: "المشروع" },
          { key: "description", name: "الوصف" }
        ], data.projects);
      case "articles":
        return renderTable("blogs", [
          { key: "image", name: "صورة" },
          { key: "title", name: "العنوان" },
          { key: "slug", name: "Slug" }
        ], data.blogs);
      case "leads":
        return renderTable("requests", [
          { key: "name", name: "العميل" },
          { key: "phone", name: "الجوال" },
          { key: "city", name: "المدينة" },
          { key: "propertyType", name: "النوع" },
          { key: "createdAt", name: "التاريخ" }
        ], data.requests);
      case "messages":
        return renderTable("messages", [
          { key: "name", name: "المرسل" },
          { key: "phone", name: "الجوال" },
          { key: "message", name: "الرسالة" },
          { key: "createdAt", name: "التاريخ" }
        ], data.messages);
      case "settings":
        return renderSettings();
      default: return <div>Coming Soon</div>;
    }
  };

  return (
    <div className="admin-layout" dir="rtl">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>خطوط الإنجاز</h2>
          <button className="mobile-only" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        <ul className="admin-nav">
          {navItems.map((item) => (
            <li key={item.key}>
              <a href="#" className={currentPage === item.key ? "active" : ""} onClick={(e) => { e.preventDefault(); setCurrentPage(item.key); setSidebarOpen(false); }}>
                <i className={`fas ${item.icon}`}></i> {item.name}
              </a>
            </li>
          ))}
          <li style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', cursor: 'pointer', fontWeight: '600' }}>
              <i className="fas fa-sign-out-alt"></i> تسجيل الخروج
            </button>
          </li>
          <li style={{ paddingTop: '10px' }}>
            <Link href={`/${locale}`} style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', textDecoration: 'none', fontWeight: '600' }}>
              <i className="fas fa-arrow-right"></i> العودة للموقع
            </Link>
          </li>
        </ul>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="mobile-only" onClick={() => setSidebarOpen(true)} style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
              <i className="fas fa-bars"></i>
            </button>
            <h1>{navItems.find(n => n.key === currentPage)?.name}</h1>
          </div>
          <span>{new Date().toLocaleDateString("ar-SA", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        
        {loading ? <div className="text-center p-5">جاري التحميل...</div> : getPageContent()}
      </main>

      {showModal && (
        <div className="modal-overlay open" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <h3>{editingItem.item ? "تعديل" : "إضافة جديد"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {editingItem.type === 'blogs' ? (
                  <>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>العنوان (عربي)</label>
                        <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>العنوان (English)</label>
                        <input type="text" className="form-control" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>الرابط (Slug) - بالإنجليزية فقط</label>
                      <input type="text" className="form-control" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required placeholder="example-article-slug" />
                    </div>
                    <div className="form-group">
                      <label>الصورة البارزة</label>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
                        {formData.image && <img src={formData.image} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
                        <input type="file" onChange={async (e) => {
                          const files = e.target.files;
                          if (!files?.[0]) return;
                          const fd = new FormData();
                          fd.append("files", files[0]);
                          const res = await fetch("/api/upload", { method: "POST", body: fd });
                          const resData = await res.json();
                          if (resData.urls?.[0]) setFormData({...formData, image: resData.urls[0]});
                        }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>المحتوى (عربي)</label>
                      <textarea className="form-control" rows={10} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>المحتوى (English)</label>
                      <textarea className="form-control" rows={10} value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} required />
                    </div>
                  </>
                ) : editingItem.type === 'properties' ? (
                  <>
                    <div className="form-group">
                      <label>العنوان</label>
                      <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>السعر</label>
                        <input type="number" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>المدينة</label>
                        <select className="form-control" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                          <option value="riyadh">الرياض</option>
                          <option value="jeddah">جدة</option>
                          <option value="dammam">الدمام</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>الحي / الموقع</label>
                        <input type="text" className="form-control" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required placeholder="مثال: الملقا" />
                      </div>
                      <div className="form-group">
                        <label>النوع</label>
                        <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option value="apartment">شقة</option>
                          <option value="villa">فيلا</option>
                          <option value="floor">دور</option>
                          <option value="office">مكتب</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>النوع</label>
                        <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option value="apartment">شقة</option>
                          <option value="villa">فيلا</option>
                          <option value="floor">دور</option>
                          <option value="office">مكتب</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>التصنيف</label>
                        <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          <option value="sale">بيع</option>
                          <option value="rent">إيجار</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>وصف العقار</label>
                      <textarea className="form-control" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>عنوان المشروع</label>
                      <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>الوصف</label>
                      <textarea className="form-control" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>الصور</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {formData.images?.map((img: string, idx: number) => (
                      <div key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                      </div>
                    ))}
                    <label style={{ width: '100px', height: '100px', border: '2px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexDirection: 'column', gap: '5px' }}>
                      <i className="fas fa-plus"></i>
                      <span style={{ fontSize: '12px' }}>{uploading ? 'جاري الرفع...' : 'رفع صورة'}</span>
                      <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
