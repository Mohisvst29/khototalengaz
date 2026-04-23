export const mockProperties = [
  {
    _id: "1",
    title: "فيلا فاخرة مودرن بحي الملقا",
    titleEn: "Modern Luxury Villa in Al Malqa",
    description: "فيلا بتصميم عصري فريد، تشطيبات سوبر لوكس، مساحات واسعة، مسبح خاص وحديقة.",
    price: 4500000,
    location: "حي الملقا",
    city: "الرياض",
    type: "villa",
    category: "sale",
    rooms: 5,
    bathrooms: 6,
    area: 450,
    featured: true,
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"]
  },
  {
    _id: "2",
    title: "شقة استثمارية في حي الياسمين",
    titleEn: "Investment Apartment in Al Yasmeen",
    description: "شقة واسعة في موقع مميز، قريبة من الخدمات، مثالية للسكن أو الاستثمار.",
    price: 1200000,
    location: "حي الياسمين",
    city: "الرياض",
    type: "apartment",
    category: "sale",
    rooms: 3,
    bathrooms: 2,
    area: 160,
    featured: true,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]
  },
  {
    _id: "3",
    title: "دور أرضي للإيجار بحي النرجس",
    titleEn: "Ground Floor for Rent in Al Narjis",
    description: "دور أرضي واسع بمدخل خاص وحوش، تشطيب فاخر وموقع هادئ.",
    price: 85000,
    location: "حي النرجس",
    city: "الرياض",
    type: "floor",
    category: "rent",
    rooms: 4,
    bathrooms: 3,
    area: 200,
    featured: true,
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"]
  },
  {
    _id: "4",
    title: "فيلا للبيع في حي حطين",
    titleEn: "Villa for Sale in Hittin",
    description: "فيلا فاخرة في واحد من أرقى أحياء الرياض، تصميم معماري متميز.",
    price: 6000000,
    location: "حي حطين",
    city: "الرياض",
    type: "villa",
    category: "sale",
    rooms: 6,
    bathrooms: 7,
    area: 500,
    featured: false,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"]
  },
  {
    _id: "5",
    title: "شقة مؤثثة للإيجار بحي العليا",
    titleEn: "Furnished Apartment for Rent in Olaya",
    description: "شقة مؤثثة بالكامل بتصميم عصري في قلب الرياض التجاري.",
    price: 120000,
    location: "حي العليا",
    city: "الرياض",
    type: "apartment",
    category: "rent",
    rooms: 2,
    bathrooms: 2,
    area: 120,
    featured: false,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]
  },
  {
    _id: "6",
    title: "مكتب تجاري فاخر طريق الملك فهد",
    titleEn: "Luxury Office King Fahd Road",
    description: "مساحة مكتبية واسعة في برج تجاري متميز، إطلالة رائعة وخدمات متكاملة.",
    price: 250000,
    location: "طريق الملك فهد",
    city: "الرياض",
    type: "office",
    category: "rent",
    area: 250,
    featured: true,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"]
  }
];

export const mockProjects = [
  {
    _id: "p1",
    title: "مشروع النرجس السكني",
    description: "مجمع سكني متكامل يضم 24 فيلا مودرن بتصاميم عصرية",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    location: "الرياض - حي النرجس"
  },
  {
    _id: "p2",
    title: "برج الإنجاز التجاري",
    description: "مبنى تجاري يضم مكاتب فاخرة ومعارض تجارية بمواصفات عالمية",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    location: "الرياض - طريق الملك فهد"
  },
  {
    _id: "p3",
    title: "مجمع الياسمين السكني",
    description: "شقق سكنية فاخرة بنظام سمارت هوم ومساحات متنوعة",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    location: "الرياض - حي الياسمين"
  }
];

export const mockBlogs = [
  {
    _id: "b1",
    title: "كيفية اختيار العقار المناسب في الرياض",
    slug: "how-to-choose-property-riyadh",
    content: "تعتبر مدينة الرياض من أسرع المدن نمواً في المنطقة، مما يجعل اختيار العقار فيها تحدياً وفرصة في آن واحد. في هذا المقال سنتعرف على أهم المعايير التي يجب مراعاتها...",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    _id: "b2",
    title: "مستقبل العقارات في المملكة العربية السعودية 2026",
    slug: "future-of-real-estate-saudi-2026",
    content: "تشهد المملكة تحولات كبرى في القطاع العقاري ضمن رؤية 2030، حيث تبرز مشاريع كبرى ومدن ذكية تعيد صياغة مفهوم السكن والعمل...",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    _id: "b3",
    title: "نصائح قانونية عند شراء شقة تمليك",
    slug: "legal-tips-buying-apartment",
    content: "عند الإقدام على خطوة شراء شقة، لابد من التأكد من كافة الجوانب القانونية لضمان حقوقك. سنستعرض في هذا الدليل أهم الأوراق والمستندات المطلوبة...",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    createdAt: new Date().toISOString()
  }
];


