import { generateInitialProducts, generateInitialEmployees } from '../data/mockData';

const PRODUCTS_KEY = 'akrack_products';
const EMPLOYEES_KEY = 'akrack_employees';
const USERS_KEY = 'akrack_users';

export const getStoredProducts = () => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  if (!data) {
    const initial = generateInitialProducts();
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveStoredProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getStoredEmployees = () => {
  const data = localStorage.getItem(EMPLOYEES_KEY);
  if (!data) {
    const initial = generateInitialEmployees();
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveStoredEmployees = (employees) => {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
};