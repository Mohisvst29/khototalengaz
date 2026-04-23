"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

const PropertiesClient = ({ title, subtitle, category }: any) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    rooms: "",
    price: "",
  });
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        const catProps = data.filter((p: any) => p.category === category);
        setProperties(catProps);
        setFilteredProperties(catProps);
      })
      .catch(() => {
        setProperties([]);
        setFilteredProperties([]);
      });
  }, [category]);

  useEffect(() => {
    let result = properties;
    if (filters.city) result = result.filter((p: any) => p.city === filters.city);
    if (filters.type) result = result.filter((p: any) => p.type === filters.type);
    if (filters.rooms) {
        if (filters.rooms === "5") {
            result = result.filter((p: any) => p.rooms >= 5);
        } else {
            result = result.filter((p: any) => p.rooms.toString() === filters.rooms);
        }
    }
    if (filters.price) result = result.filter((p: any) => p.price <= parseInt(filters.price));
    setFilteredProperties(result);
  }, [filters, properties]);

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ city: "", type: "", rooms: "", price: "" });
  };

  return (
    <div className="page active">
      <div className="page-banner">
        <div className="container">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="filters-bar">
            <div className="filter-group">
              <label>{t.lead.city}</label>
              <select
                className="form-control"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
              >
                <option value="">{locale === 'ar' ? 'الكل' : 'All'}</option>
                <option value="riyadh">{t.lead.riyadh}</option>
                <option value="jeddah">{t.lead.jeddah}</option>
                <option value="dammam">{t.lead.dammam}</option>
              </select>
            </div>
            <div className="filter-group">
              <label>{t.lead.property_type}</label>
              <select
                className="form-control"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">{locale === 'ar' ? 'الكل' : 'All'}</option>
                <option value="apartment">{t.property.apartment}</option>
                <option value="villa">{t.property.villa}</option>
                <option value="floor">{t.property.floor}</option>
                <option value="office">{t.property.office}</option>
              </select>
            </div>
            <div className="filter-group">
              <label>{locale === 'ar' ? 'عدد الغرف' : 'Rooms'}</label>
              <select
                className="form-control"
                name="rooms"
                value={filters.rooms}
                onChange={handleFilterChange}
              >
                <option value="">{locale === 'ar' ? 'الكل' : 'All'}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
              </select>
            </div>
            {category === "sale" && (
              <div className="filter-group">
                <label>{locale === 'ar' ? 'السعر الأقصى' : 'Max Price'}</label>
                <select
                  className="form-control"
                  name="price"
                  value={filters.price}
                  onChange={handleFilterChange}
                >
                  <option value="">{locale === 'ar' ? 'الكل' : 'All'}</option>
                  <option value="1000000">1 {locale === 'ar' ? 'مليون' : 'Million'}</option>
                  <option value="2000000">2 {locale === 'ar' ? 'مليون' : 'Million'}</option>
                  <option value="5000000">5 {locale === 'ar' ? 'مليون' : 'Million'}</option>
                </select>
              </div>
            )}
            <button className="btn btn-outline" onClick={resetFilters}>
              <i className="fas fa-undo"></i> <span>{locale === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
            </button>
          </div>
          <div className="properties-grid">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((p: any) => (
                <div key={p._id} className="property-card">
                  <div className="property-image">
                    <img src={p.image} alt={p.title} loading="lazy" />
                    <span
                      className={`property-badge ${
                        p.category === "rent" ? "rent" : ""
                      }`}
                    >
                      {p.category === "sale" ? t.property.sale : t.property.rent}
                    </span>
                  </div>
                  <div className="property-content">
                    <div className="property-price">
                      {p.price.toLocaleString()} {t.property.sar}
                      {p.category === "rent" && (
                        <small
                          style={{ fontSize: "14px", color: "var(--text-light)" }}
                        >
                          / {locale === 'ar' ? 'سنوي' : 'Yearly'}
                        </small>
                      )}
                    </div>
                    <h3 className="property-title">{p.title}</h3>
                    <div className="property-location">
                      <i className="fas fa-map-marker-alt"></i>
                      {p.location}
                    </div>
                    <div className="property-meta">
                      <span>
                        <i className="fas fa-bed"></i> {p.rooms} {t.property.rooms}
                      </span>
                      <span>
                        <i className="fas fa-ruler-combined"></i> {p.area} {t.property.area}
                      </span>
                      <span>
                        <i className="fas fa-home"></i>{" "}
                        {t.property[p.type] || p.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                <i className="fas fa-search"></i>
                <p>{locale === 'ar' ? 'لا توجد نتائج مطابقة للبحث' : 'No matching results found'}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertiesClient;
