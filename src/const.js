const filterCriteria = {
  roomAmount: [1, 2, 3, 4],
  roomType: [
    { roomTypeTC: "分租套房", roomTypeEN: "SR" },
    { roomTypeTC: "獨立套房", roomTypeEN: "PR" },
    { roomTypeTC: "整層住家", roomTypeEN: "EHA" }
  ],
  district: ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區",
    "內湖區", "南港區", "文山區"
  ],
  amenities: [
    { amenityTC: "網路", amenityEN: "Internet" },
    { amenityTC: "熱水器", amenityEN: "Hot water" },
    { amenityTC: "冷氣", amenityEN: "A/C" },
    { amenityTC: "冰箱", amenityEN: "Refrigerator" },
    { amenityTC: "書桌/工作區", amenityEN: "Laptop friendly workspace" },
    { amenityTC: "洗衣機", amenityEN: "Washer" },
    { amenityTC: "可養寵物", amenityEN: "Pets allowed" },
    { amenityTC: "廚房", amenityEN: "Kitchen" },
    { amenityTC: "健身房", amenityEN: "Gym" },
    { amenityTC: "電梯", amenityEN: "Elevator" },
    { amenityTC: "付費停車場", amenityEN: "Paid parking off premises" },
    { amenityTC: "路邊停車格", amenityEN: "Free street parking" }
  ]
};

export default filterCriteria;