export type MenuItem = {
  id: string;
  cat: string;
  type: 'drink' | 'bakery';
  price: number;
  imgColor: string;
  name: { th: string; en: string };
  imgSrc?: string;
};

export const menuData: MenuItem[] = [
  // Milk Tea Category
  { id: 'mt1', cat: 'milktea', type: 'drink', price: 45, imgColor: 'bg-[#d2b48c]', name: { th: 'ชานมไต้หวันคลาสสิก', en: 'Classic Taiwan Milk Tea' } },
  { id: 'mt2', cat: 'milktea', type: 'drink', price: 55, imgColor: 'bg-[#c19a6b]', name: { th: 'พรีเมียมมิลค์ที', en: 'Premium Milk Tea' } },
  { id: 'mt3', cat: 'milktea', type: 'drink', price: 65, imgColor: 'bg-[#8b4513]', name: { th: 'ชานมบราวน์ชูการ์', en: 'Brown Sugar Milk Tea' } },
  { id: 'mt4', cat: 'milktea', type: 'drink', price: 50, imgColor: 'bg-[#e6e6fa]', name: { th: 'ชานมเผือก', en: 'Taro Milk Tea' } },
  { id: 'mt5', cat: 'milktea', type: 'drink', price: 50, imgColor: 'bg-[#f3e5ab]', name: { th: 'ชานมวานิลลา', en: 'Vanilla Milk Tea' } },
  // Cocoa Category
  { id: 'cc1', cat: 'cocoa', type: 'drink', price: 50, imgColor: 'bg-[#3e2723]', name: { th: 'โกโก้คลาสสิก', en: 'Classic Cocoa' } },
  { id: 'cc2', cat: 'cocoa', type: 'drink', price: 65, imgColor: 'bg-[#1b100b]', name: { th: 'ซิกเนเจอร์ดาร์กโกโก้', en: 'Signature Dark Cocoa' } },
  { id: 'cc3', cat: 'cocoa', type: 'drink', price: 60, imgColor: 'bg-[#4e342e]', name: { th: 'มินต์โกโก้', en: 'Mint Cocoa' } },
  // Coffee Category
  { id: 'cf1', cat: 'coffee', type: 'drink', price: 55, imgColor: 'bg-[#2b1810]', name: { th: 'เอสเพรสโซ่เย็น', en: 'Iced Espresso' } },
  { id: 'cf2', cat: 'coffee', type: 'drink', price: 55, imgColor: 'bg-[#1a0f0a]', name: { th: 'อเมริกาโน่เย็น', en: 'Iced Americano' } },
  { id: 'cf3', cat: 'coffee', type: 'drink', price: 60, imgColor: 'bg-[#a67c52]', name: { th: 'ลาเต้เย็น', en: 'Iced Latte' } },
  { id: 'cf4', cat: 'coffee', type: 'drink', price: 65, imgColor: 'bg-[#8c6239]', name: { th: 'คาปูชิโน่เย็น', en: 'Iced Cappuccino' } },
  // Green Tea Category
  { id: 'gt1', cat: 'greentea', type: 'drink', price: 50, imgColor: 'bg-[#81c784]', name: { th: 'ชาเขียวนมไทย', en: 'Thai Green Milk Tea' } },
  { id: 'gt2', cat: 'greentea', type: 'drink', price: 70, imgColor: 'bg-[#388e3c]', name: { th: 'พรีเมียมมัทฉะลาเต้', en: 'Premium Matcha Latte' } },
  { id: 'gt3', cat: 'greentea', type: 'drink', price: 45, imgColor: 'bg-[#aed581]', name: { th: 'ชาเขียวมะลิเย็น', en: 'Iced Jasmine Green Tea' } },
  { id: 'gt4', cat: 'greentea', type: 'drink', price: 55, imgColor: 'bg-[#dce775]', name: { th: 'ชามะนาวน้ำผึ้ง', en: 'Honey Lemon Green Tea' } },
  // Bakery Menu
  { id: 'bk1', cat: 'bakery', type: 'bakery', price: 40, imgColor: 'bg-[#d4a373]', name: { th: 'ซอฟต์คุกกี้ช็อกโกแลตชิป', en: 'Soft Chocolate Chip Cookies' } },
  { id: 'bk2', cat: 'bakery', type: 'bakery', price: 85, imgColor: 'bg-[#e6ccb2]', name: { th: 'ชีสเค้กหน้าไหม้', en: 'Burnt Cheese Cake' } },
  { id: 'bk3', cat: 'bakery', type: 'bakery', price: 90, imgColor: 'bg-[#ffb7b2]', name: { th: 'เค้กผลไม้', en: 'Fruit Cake' } },
  { id: 'bk4', cat: 'bakery', type: 'bakery', price: 75, imgColor: 'bg-[#f4a261]', name: { th: 'ครัวซองต์อัลมอนด์', en: 'Almond Croissant' } },
  { id: 'bk5', cat: 'bakery', type: 'bakery', price: 95, imgColor: 'bg-[#e9edc9]', name: { th: 'ทาร์ตผลไม้สด', en: 'Fresh Fruit Tart' } },
  { id: 'bk6', cat: 'bakery', type: 'bakery', price: 35, imgColor: 'bg-[#ffc6ff]', name: { th: 'มาการอง', en: 'Macaron' } },
  { id: 'bk7', cat: 'bakery', type: 'bakery', price: 110, imgColor: 'bg-[#bdb2ff]', name: { th: 'บลูเบอร์รี่ชีสพาย', en: 'No-Bake Blueberry Cheesecake' } },
  { id: 'bk8', cat: 'bakery', type: 'bakery', price: 80, imgColor: 'bg-[#6d4c41]', name: { th: 'เค้กช็อกโกแลตหน้านิ่ม', en: 'Soft Chocolate Cake' } },
  { id: 'bk9', cat: 'bakery', type: 'bakery', price: 120, imgColor: 'bg-[#8d6e63]', name: { th: 'คอฟฟี่ชีสเค้กหน้าไหม้', en: 'Coffee Basque Burnt Cheesecake' } },
];

export const optionsConfig = {
  sweetness: [
      { id: 'sw0', val: '0%', label: { th: 'ไม่หวาน (0%)', en: 'No Sugar (0%)' } },
      { id: 'sw25', val: '25%', label: { th: 'หวานน้อย (25%)', en: 'Less Sweet (25%)' } },
      { id: 'sw50', val: '50%', label: { th: 'หวานปานกลาง (50%)', en: 'Medium Sweet (50%)' } },
      { id: 'sw100', val: '100%', label: { th: 'หวานปกติ (100%)', en: 'Normal Sweet (100%)' }, isDefault: true },
      { id: 'sw120', val: '120%', label: { th: 'หวานมาก (120%)', en: 'Extra Sweet (120%)' } }
  ],
  ice: [
      { id: 'ic0', val: 'none', label: { th: 'ไม่ใส่น้ำแข็ง', en: 'No Ice' } },
      { id: 'ic1', val: 'less', label: { th: 'น้ำแข็งน้อย', en: 'Less Ice' } },
      { id: 'ic2', val: 'normal', label: { th: 'น้ำแข็งปกติ', en: 'Normal Ice' }, isDefault: true },
      { id: 'ic3', val: 'extra', label: { th: 'น้ำแข็งเยอะ', en: 'Extra Ice' } },
      { id: 'ic4', val: 'cubes', label: { th: 'เลือกจำนวนก้อนน้ำแข็ง (ระบุจำนวน)', en: 'Custom Ice Cubes' } } // Option for user to type how many ice cubes as per prompt
  ],
  toppings: [
      { id: 'tp1', price: 15, name: { th: 'วิปครีม', en: 'Whip Cream' } },
      { id: 'tp2', price: 10, name: { th: 'โอรีโอ้', en: 'Oreo' } },
      { id: 'tp3', price: 10, name: { th: 'โกโก้ครั้นช์', en: 'CocoCrunch' } },
      { id: 'tp4', price: 10, name: { th: 'โอวัลติน', en: 'Ovaltine' } },
      { id: 'tp5', price: 10, name: { th: 'คอร์นเฟลกส์', en: 'Corn Flakes' } },
      { id: 'tp6', price: 10, name: { th: 'โอโจ้', en: 'OJO' } },
      { id: 'tp7', price: 10, name: { th: 'ปีโป้', en: 'PiPo' } },
      { id: 'tp8', price: 10, name: { th: 'เจลลี่ท็อปปิ้ง', en: 'Topping Jelly' } },
      { id: 'tp9', price: 15, name: { th: 'มาร์ชแมลโลว์', en: 'Marshmallow Topping' } },
      { id: 'tp10', price: 10, name: { th: 'เวเฟอร์', en: 'Wafer' } },
      { id: 'tp11', price: 15, name: { th: 'ช็อกโกแลตชิป', en: 'Choc Chip' } },
      { id: 'tp12', price: 5, name: { th: 'น้ำตาลแต่งหน้า', en: 'Sugar Sprinkles/Toppings' } },
      { id: 'tp13', price: 15, name: { th: 'ไข่มุกคริสตัล / บุก', en: 'Crystal Boba/Boba' } },
      { id: 'tp14', price: 20, name: { th: 'บราวนี่', en: 'Brownie' } },
  ]
};
