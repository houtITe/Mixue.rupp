export type AdminGood = {
  id: string;
  name: string;
  type: "Drinks" | "Ice Cream";
  category: string;
  description: string;
  price: number;
  stock: number;
  status: "Available" | "Out of Stock";
  image: string;
  createdAt: string;
};

export const mockGoods: AdminGood[] = [
  {
    id: "g-001",
    name: "Classic Vanilla Cone",
    type: "Ice Cream",
    category: "Soft Serve",
    description: "Silky vanilla soft-serve on a crisp golden cone.",
    price: 1.25,
    stock: 120,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=600&q=80",
    createdAt: "2025-06-04",
  },
  {
    id: "g-002",
    name: "Strawberry Swirl Sundae",
    type: "Ice Cream",
    category: "Sundae",
    description: "Vanilla soft-serve marbled with real strawberry sauce.",
    price: 2.5,
    stock: 44,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=600&q=80",
    createdAt: "2025-07-11",
  },
  {
    id: "g-003",
    name: "Choco Storm Sundae",
    type: "Ice Cream",
    category: "Sundae",
    description: "Soft-serve, dark chocolate sauce and crunchy cocoa pearls.",
    price: 2.75,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80",
    createdAt: "2025-05-20",
  },
  {
    id: "g-004",
    name: "Matcha Milk Boba",
    type: "Drinks",
    category: "Bubble Tea",
    description: "Ceremonial-grade matcha, creamy milk and chewy pearls.",
    price: 2.75,
    stock: 88,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=600&q=80",
    createdAt: "2025-06-18",
  },
  {
    id: "g-005",
    name: "Brown Sugar Milk Tea",
    type: "Drinks",
    category: "Bubble Tea",
    description: "Caramelised brown sugar tiger stripes over creamy milk tea.",
    price: 2.5,
    stock: 132,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&w=600&q=80",
    createdAt: "2025-04-02",
  },
  {
    id: "g-006",
    name: "Mango Passion Tea",
    type: "Drinks",
    category: "Fruit Tea",
    description: "Alphonso mango, passionfruit pulp and jasmine green tea.",
    price: 2.5,
    stock: 61,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
    createdAt: "2025-07-25",
  },
  {
    id: "g-007",
    name: "RUPP Iced Mocha",
    type: "Drinks",
    category: "Coffee",
    description: "Cambodian espresso, dark chocolate and cold milk.",
    price: 2.75,
    stock: 24,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    createdAt: "2025-03-14",
  },
  {
    id: "g-008",
    name: "Peach Oolong Tea",
    type: "Drinks",
    category: "Fruit Tea",
    description: "Roasted oolong shaken with fresh peach and honey.",
    price: 2.5,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=600&q=80",
    createdAt: "2025-07-01",
  },
];

export type AdminCategory = {
  id: string;
  name: string;
  type: "Drinks" | "Ice Cream";
  items: number;
};

export const mockCategories: AdminCategory[] = [
  { id: "c1", name: "Soft Serve", type: "Ice Cream", items: 6 },
  { id: "c2", name: "Sundae", type: "Ice Cream", items: 4 },
  { id: "c3", name: "Bubble Tea", type: "Drinks", items: 8 },
  { id: "c4", name: "Fruit Tea", type: "Drinks", items: 5 },
  { id: "c5", name: "Coffee", type: "Drinks", items: 3 },
  { id: "c6", name: "Smoothie", type: "Drinks", items: 4 },
];

export type AdminOrder = {
  id: string;
  customer: string;
  date: string;
  total: number;
  payment: "Paid" | "Pending" | "Refunded";
  status: "New" | "Preparing" | "Ready" | "Delivered" | "Cancelled";
};

export const mockOrders: AdminOrder[] = [
  { id: "#ORD-1042", customer: "Sokha Chan", date: "2026-07-20", total: 8.75, payment: "Paid", status: "Preparing" },
  { id: "#ORD-1041", customer: "Dara Meas", date: "2026-07-20", total: 5.25, payment: "Paid", status: "Delivered" },
  { id: "#ORD-1040", customer: "Ratha Ny", date: "2026-07-19", total: 12.5, payment: "Pending", status: "New" },
  { id: "#ORD-1039", customer: "Bopha Lim", date: "2026-07-19", total: 3.5, payment: "Paid", status: "Ready" },
  { id: "#ORD-1038", customer: "Kunthea Sok", date: "2026-07-18", total: 6.0, payment: "Refunded", status: "Cancelled" },
  { id: "#ORD-1037", customer: "Vibol Chea", date: "2026-07-18", total: 4.75, payment: "Paid", status: "Delivered" },
  { id: "#ORD-1036", customer: "Sopheak Ros", date: "2026-07-17", total: 9.25, payment: "Paid", status: "Delivered" },
];

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joined: string;
};

export const mockCustomers: AdminCustomer[] = [
  { id: "u1", name: "Sokha Chan", email: "sokha@rupp.edu.kh", phone: "+855 12 345 678", orders: 12, spent: 84.5, joined: "2025-11-02" },
  { id: "u2", name: "Dara Meas", email: "dara.m@gmail.com", phone: "+855 77 111 222", orders: 8, spent: 42.0, joined: "2026-01-14" },
  { id: "u3", name: "Ratha Ny", email: "ratha@yahoo.com", phone: "+855 96 555 010", orders: 5, spent: 28.75, joined: "2026-03-08" },
  { id: "u4", name: "Bopha Lim", email: "bopha@rupp.edu.kh", phone: "+855 15 887 999", orders: 21, spent: 132.25, joined: "2025-08-19" },
  { id: "u5", name: "Kunthea Sok", email: "kunthea.s@gmail.com", phone: "+855 88 222 111", orders: 3, spent: 12.0, joined: "2026-05-27" },
];

export type AdminReview = {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
};

export const mockReviews: AdminReview[] = [
  { id: "r1", customer: "Sokha Chan", product: "Matcha Milk Boba", rating: 5, comment: "Best matcha on campus, hands down!", date: "2026-07-18" },
  { id: "r2", customer: "Dara Meas", product: "Classic Vanilla Cone", rating: 5, comment: "Perfect after class treat.", date: "2026-07-16" },
  { id: "r3", customer: "Ratha Ny", product: "Brown Sugar Milk Tea", rating: 4, comment: "Sweet but great flavor.", date: "2026-07-15" },
  { id: "r4", customer: "Bopha Lim", product: "Choco Storm Sundae", rating: 5, comment: "Chocolate heaven ❤", date: "2026-07-12" },
  { id: "r5", customer: "Kunthea Sok", product: "Peach Oolong Tea", rating: 3, comment: "Would love less sugar.", date: "2026-07-10" },
];

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
};

export const mockMessages: AdminMessage[] = [
  { id: "m1", name: "Chansovann Ung", email: "chansovann@gmail.com", subject: "Catering for graduation", message: "Hi, we would like to order 200 cones for our graduation event next month.", date: "2026-07-19", read: false },
  { id: "m2", name: "Piseth Kong", email: "piseth@yahoo.com", subject: "New branch inquiry", message: "Do you plan to open a branch near BKK1?", date: "2026-07-18", read: false },
  { id: "m3", name: "Sreyleak Meas", email: "sreyleak@rupp.edu.kh", subject: "Part-time job", message: "I'm interested in a part-time barista position.", date: "2026-07-15", read: true },
  { id: "m4", name: "Rothana Sok", email: "rothana@gmail.com", subject: "Wrong order", message: "My order today missed the boba. Could you check?", date: "2026-07-14", read: true },
];

export type AdminPromotion = {
  id: string;
  title: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
  active: boolean;
};

export const mockPromotions: AdminPromotion[] = [
  { id: "p1", title: "Student Friday", code: "RUPP15", discount: "15% off", startDate: "2026-07-01", endDate: "2026-12-31", active: true },
  { id: "p2", title: "Buy 1 Get 1 Cone", code: "CONEBOGO", discount: "BOGO Ice Cream", startDate: "2026-07-15", endDate: "2026-07-31", active: true },
  { id: "p3", title: "Grand Opening", code: "GRAND2026", discount: "$1 flat cones", startDate: "2026-03-01", endDate: "2026-03-14", active: false },
];

export type AdminLocation = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  active: boolean;
};

export const mockLocations: AdminLocation[] = [
  { id: "l1", name: "RUPP Main Campus", address: "Russian Federation Blvd, Phnom Penh", phone: "+855 23 880 001", hours: "8:00 – 21:00", active: true },
  { id: "l2", name: "Toul Kork Branch", address: "Street 289, Toul Kork, Phnom Penh", phone: "+855 23 880 002", hours: "9:00 – 22:00", active: true },
  { id: "l3", name: "Chbar Ampov Kiosk", address: "National Rd 1, Chbar Ampov", phone: "+855 23 880 003", hours: "10:00 – 20:00", active: false },
];

export const revenueChart = [
  { month: "Feb", value: 3200 },
  { month: "Mar", value: 4100 },
  { month: "Apr", value: 3800 },
  { month: "May", value: 5200 },
  { month: "Jun", value: 6100 },
  { month: "Jul", value: 7400 },
];

export const categoryShare = [
  { name: "Bubble Tea", value: 38 },
  { name: "Ice Cream", value: 32 },
  { name: "Fruit Tea", value: 18 },
  { name: "Coffee", value: 8 },
  { name: "Smoothie", value: 4 },
];