import React from "react";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize, MoveLeft } from "lucide-react";
import Link from "next/link";

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    price: number;
    location: string;
    type: string;
    category: string;
    rooms?: number;
    bathrooms?: number;
    area?: number;
    images: string[];
    city: string;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const typeMap: Record<string, string> = {
    apartment: "شقة",
    villa: "فيلا",
    floor: "دور",
    office: "مكتب",
    shop: "محل تجاري",
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm flex flex-col h-full group">
      <div className="relative h-[220px] overflow-hidden">
        <Image
          src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-[#fcc419] text-[#0f2339] px-3 py-1 rounded-md text-[12px] font-bold">
          {property.category === "rent" ? "للإيجار" : "للبيع"}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-[#1a3a5c] text-2xl font-bold mb-2 text-right">
          {property.price.toLocaleString()} ريال
        </div>

        <h3 className="text-[17px] font-bold text-gray-800 mb-2 line-clamp-1 text-right">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-[13px] mb-4 justify-start flex-row-reverse">
          <MapPin size={14} className="text-[#1a3a5c]" />
          <span>{property.city} - {property.location}</span>
        </div>

        <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-start flex-row-reverse">
          <div className="flex gap-4 flex-row-reverse">
            {property.rooms && (
              <div className="flex items-center gap-1.5 text-gray-600 text-[13px]">
                <Bed size={16} className="text-[#1a3a5c]" />
                <span>{property.rooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5 text-gray-600 text-[13px]">
                <Bath size={16} className="text-[#1a3a5c]" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1.5 text-gray-600 text-[13px]">
                <Maximize size={16} className="text-[#1a3a5c]" />
                <span>{property.area} م²</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
