const hardwareCategories = ['Bolt', 'Nut', 'Screw', 'Hinge', 'Lock', 'Bracket', 'Anchor', 'Washer', 'Valve', 'Pipe Fitting', 'Drill Bit', 'Hammer', 'Pliers', 'Wrench', 'Hook'];
const materials = ['Stainless Steel', 'Brass', 'Galvanized Iron', 'Carbon Steel', 'Aluminum', 'Copper'];

export const generateInitialProducts = () => {
  const products = [];
  const racks = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2', 'H1'];
  
  for (let i = 1; i <= 100; i++) {
    const category = hardwareCategories[i % hardwareCategories.length];
    const material = materials[i % materials.length];
    const size = `${(i % 10 + 1) * 5}mm`;
    const name = `${material} ${category} ${size}`;
    const rackNumber = racks[i % racks.length] + '-' + ((i % 5) + 1);
    const cost = Math.floor(Math.random() * 500) + 20;
    const sellingPrice = Math.round(cost * 1.3);
    const lastPrice = Math.round(sellingPrice * 0.95);
    
    let stock;
    const mod = i % 10;
    if (mod === 0 || mod === 1) stock = Math.floor(Math.random() * 4); 
    else if (mod === 2) stock = Math.floor(Math.random() * 6) + 5; 
    else stock = Math.floor(Math.random() * 90) + 11; 

    products.push({
      id: `prod-${i}`,
      productName: name,
      rackNumber: rackNumber,
      sellingPrice: sellingPrice,
      lastPrice: lastPrice,
      stock: stock,
      updatedAt: new Date(Date.now() - i * 3600000 * 4).toISOString()
    });
  }
  return products;
};

// Yahan employee username "emp" aur password "09876" update kiya gaya hai
export const generateInitialEmployees = () => [
  { id: 'emp-1', fullName: 'Rahul Sharma', username: 'emp', password: '09876', role: 'Employee', status: 'Active' },
  { id: 'emp-2', fullName: 'Amit Verma', username: 'amit_v', password: '09876', role: 'Employee', status: 'Active' },
  { id: 'emp-3', fullName: 'Priya Singh', username: 'priya_s', password: '09876', role: 'Employee', status: 'Active' },
  { id: 'emp-4', fullName: 'Vikram Malhotra', username: 'vikram_m', password: '09876', role: 'Employee', status: 'Active' },
  { id: 'emp-5', fullName: 'Neha Gupta', username: 'neha_g', password: '09876', role: 'Employee', status: 'Inactive' },
  { id: 'emp-6', fullName: 'Suresh Kumar', username: 'suresh_k', password: '09876', role: 'Employee', status: 'Active' },
  { id: 'emp-7', fullName: 'Anjali Das', username: 'anjali_d', password: '09876', role: 'Employee', status: 'Active' },
  { id: 'emp-8', fullName: 'Manish Roy', username: 'manish_r', password: '09876', role: 'Employee', status: 'Active' },
  { id: 'emp-9', fullName: 'Deepak Joshi', username: 'deepak_j', password: '09876', role: 'Employee', status: 'Inactive' },
  { id: 'emp-10', fullName: 'Pooja Tiwari', username: 'pooja_t', password: '09876', role: 'Employee', status: 'Active' },
];