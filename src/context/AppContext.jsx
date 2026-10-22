import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { hashPassword } from '../utils/hash';
import { getStoredProducts, saveStoredProducts } from '../services/storageService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {

  // App khulte hi agar local storage mein data hai toh wo turant dikhega (0 nahi aayega)
  const [products, setProducts] = useState(() => getStoredProducts() || []);
  const [employees, setEmployees] = useState([]);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('akrack_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('akrack_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('akrack_dark_mode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Universal Refresh Function (Pull-to-refresh ya manual reload ke liye)
  const fetchAllData = async () => {
    await Promise.all([fetchProducts(), fetchEmployees()]);
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.log("Product Fetch Error:", error);
        return;
      }

      const formattedProducts = (data || []).map(p => ({
        id: p.id,
        productName: p.product_name || p.productName,
        rackNumber: p.rack_number || p.rackNumber,
        sellingPrice: p.selling_price || p.sellingPrice,
        lastPrice: p.last_price || p.lastPrice,
        stock: p.stock,
        unit: p.unit || 'Pcs', // Naya unit field yahan map hua
        updatedAt: p.updated_at || p.updatedAt || p.created_at || new Date().toISOString()
      })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      setProducts(formattedProducts);
      saveStoredProducts(formattedProducts); // Local storage mein save kar lo taaki agli baar 0 na dikhe
    } catch (err) {
      console.log("App Catch Error:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) {
        console.log("Employee Fetch Error:", error);
        return;
      }

      setEmployees(data || []);
    } catch (err) {
      console.log("App Catch Error (Employees):", err);
    }
  };

  const addProduct = async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          product_name: productData.productName,
          rack_number: productData.rackNumber,
          selling_price: Number(productData.sellingPrice),
          last_price: Number(productData.lastPrice),
          stock: Number(productData.stock),
          unit: productData.unit || 'Pcs' // Naya unit field yahan insert hoga
        }
      ])
      .select()
      .single();

    if (error) {
      console.log("Add Product Error:", error);
      return;
    }

    const newProduct = {
      id: data.id,
      productName: data.product_name || data.productName,
      rackNumber: data.rack_number || data.rackNumber,
      sellingPrice: data.selling_price || data.sellingPrice,
      lastPrice: data.last_price || data.lastPrice,
      stock: data.stock,
      unit: data.unit || 'Pcs', // Naya unit field
      updatedAt: data.updated_at || data.updatedAt || data.created_at
    };

    setProducts(prev => {
      const updated = [newProduct, ...prev];
      saveStoredProducts(updated);
      return updated;
    });
  };

  const updateProduct = async (id, productData) => {
    const updatePayload = {};
    if (productData.productName !== undefined) updatePayload.product_name = productData.productName;
    if (productData.rackNumber !== undefined) updatePayload.rack_number = productData.rackNumber;
    if (productData.sellingPrice !== undefined) updatePayload.selling_price = Number(productData.sellingPrice);
    if (productData.lastPrice !== undefined) updatePayload.last_price = Number(productData.lastPrice);
    if (productData.stock !== undefined) updatePayload.stock = Number(productData.stock);
    if (productData.unit !== undefined) updatePayload.unit = productData.unit; // Naya unit field update payload mein

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log("Update Product Error:", error);
      return;
    }

    setProducts(prev => {
      const updated = prev.map(p =>
        p.id === id
          ? {
              ...p,
              productName: data.product_name || data.productName,
              rackNumber: data.rack_number || data.rackNumber,
              sellingPrice: data.selling_price || data.sellingPrice,
              lastPrice: data.last_price || data.lastPrice,
              stock: data.stock,
              unit: data.unit || 'Pcs', // Naya unit field
              updatedAt: data.updated_at || data.updatedAt || data.created_at
            }
          : p
      );
      saveStoredProducts(updated);
      return updated;
    });
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.log("Delete Product Error:", error);
      return;
    }

    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveStoredProducts(updated);
      return updated;
    });
  };

  const addEmployee = async (empData) => {
    const hashedPassword = await hashPassword(empData.password);

    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          full_name: empData.fullName,
          username: empData.username,
          password: hashedPassword,
          role: empData.role,
          status: empData.status
        }
      ])
      .select()
      .single();

    if(error){
      console.log("Add Employee Error:", error);
      return;
    }

    setEmployees(prev => [data, ...prev]);
  };

  const updateEmployee = async (id, empData) => {
    const { data, error } = await supabase
      .from('employees')
      .update({
        full_name: empData.fullName,
        username: empData.username,
        role: empData.role,
        status: empData.status
      })
      .eq('id', id)
      .select()
      .single();

    if(error){
      console.log("Update Employee Error:", error);
      return;
    }

    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? data : emp
      )
    );
  };

  const deleteEmployee = async (id) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if(error){
      console.log("Delete Employee Error:", error);
      return;
    }

    setEmployees(prev =>
      prev.filter(emp => emp.id !== id)
    );
  };

  const resetEmployeePassword = async (id, newPassword) => {
    const hashedPassword = await hashPassword(newPassword);

    const { error } = await supabase
      .from('employees')
      .update({
        password: hashedPassword
      })
      .eq('id', id);

    if(error){
      console.log("Password Reset Error:", error);
      return;
    }

    fetchEmployees();
  };

  const toggleEmployeeStatus = async (id) => {
    const emp = employees.find(e => e.id === id);
    if(!emp) return;

    const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';

    const { error } = await supabase
      .from('employees')
      .update({
        status: newStatus
      })
      .eq('id', id);

    if(error){
      console.log("Status Update Error:", error);
      return;
    }

    setEmployees(prev =>
      prev.map(e =>
        e.id === id
          ? { ...e, status: newStatus }
          : e
      )
    );
  };

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10);
  const recentUpdates = [...products]
    .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0,10);

  return (
    <AppContext.Provider
      value={{
        products,
        employees,
        darkMode,
        toggleDarkMode,
        addProduct,
        updateProduct,
        deleteProduct,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        resetEmployeePassword,
        toggleEmployeeStatus,
        totalProducts,
        lowStockProducts,
        recentUpdates,
        fetchAllData // Refresh karne ke liye ye function export kar diya hai
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);