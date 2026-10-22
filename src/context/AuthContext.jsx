// import React,{createContext,useContext,useState} from 'react';
// import {supabase} from '../services/supabase';
// import {hashPassword} from '../utils/hash';

// const AuthContext=createContext(null);

// export const AuthProvider=({children})=>{
// const [user,setUser]=useState(()=>{
// const saved=localStorage.getItem('akrack_logged_user');
// return saved?JSON.parse(saved):null;
// });

// const login=async(username,password)=>{
// try{

// // SUPER ADMIN LOGIN USING SUPABASE AUTH
// // Update: Ab ye 'superadmin' username aur Email (@) dono par Supabase Auth chalayega
// if(username.toLowerCase()==='superadmin' || username.includes('@')){

// // Agar 'superadmin' likha hai, toh default email lag jayega varna user ka dala hua email use hoga
// const loginEmail = username.includes('@') ? username : 'aryankchaurasiya0@gmail.com';

// const {data,error}=await supabase.auth.signInWithPassword({
// email: loginEmail, // FIXED: password.email ki jagah proper variable pass kiya hai
// password: password // FIXED: password.password ki jagah proper variable pass kiya hai
// });

// if(error){
// return {
// success:false,
// message:error.message
// };
// }

// const role=data.user.user_metadata?.role;

// if(role!=='Super Admin'){
// return {
// success:false,
// message:'You are not Super Admin'
// };
// }

// const superUser={
// id:data.user.id,
// fullName:data.user.user_metadata?.full_name || 'Super Administrator',
// username:'superadmin', // Username format same rakha hai taaki UI mein koi dikkat na aaye
// role:'Super Admin',
// status:'Active'
// };

// setUser(superUser);
// localStorage.setItem('akrack_logged_user',JSON.stringify(superUser));

// return {success:true};

// }


// // ADMIN + EMPLOYEE LOGIN (Sirf Usernames ke liye)
// const hashedPassword=await hashPassword(password);

// const {data:emp,error}=await supabase
// .from('employees')
// .select('*')
// .eq('username',username)
// .eq('password',hashedPassword)
// .single();


// if(error || !emp){
// return {
// success:false,
// message:'Invalid username or password'
// };
// }


// if(emp.status==='Inactive'){
// return {
// success:false,
// message:'Account disabled. Contact Admin'
// };
// }


// const loggedUser={
// id:emp.id,
// fullName:emp.full_name,
// username:emp.username,
// role:emp.role,
// status:emp.status
// };


// setUser(loggedUser);

// localStorage.setItem(
// 'akrack_logged_user',
// JSON.stringify(loggedUser)
// );


// return {success:true};


// }catch(err){

// console.log('LOGIN ERROR',err);

// return {
// success:false,
// message:'Login failed'
// };

// }

// };


// const logout=async()=>{

// await supabase.auth.signOut();

// setUser(null);

// localStorage.removeItem('akrack_logged_user');

// };


// const updateUserProfile=(data)=>{

// const updated={
// ...user,
// ...data
// };

// setUser(updated);

// localStorage.setItem(
// 'akrack_logged_user',
// JSON.stringify(updated)
// );

// };


// return(
// <AuthContext.Provider
// value={{
// user,
// login,
// logout,
// updateUserProfile
// }}
// >
// {children}
// </AuthContext.Provider>
// );

// };


// export const useAuth=()=>useContext(AuthContext);









import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../services/supabase';
import { hashPassword } from '../utils/hash';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('akrack_logged_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    try {
      // SUPER ADMIN LOGIN USING SUPABASE AUTH
      if (username.toLowerCase() === 'superadmin' || username.includes('@')) {
        const loginEmail = username.includes('@') ? username : 'aryankchaurasiya0@gmail.com';

        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: password
        });

        if (error) {
          return { success: false, message: error.message };
        }

        const role = data.user.user_metadata?.role;

        if (role !== 'Super Admin') {
          return { success: false, message: 'You are not Super Admin' };
        }

        const superUser = {
          id: data.user.id,
          fullName: data.user.user_metadata?.full_name || 'Super Administrator',
          username: 'superadmin',
          role: 'Super Admin',
          status: 'Active'
        };

        setUser(superUser);
        localStorage.setItem('akrack_logged_user', JSON.stringify(superUser));

        // NAYA UPDATE: role aur user return kar rahe hain taaki Login.jsx theek se redirect kar sake
        return { success: true, role: 'Super Admin', user: superUser };
      }

      // ADMIN + EMPLOYEE + DEMO LOGIN (Sirf Usernames ke liye)
      const hashedPassword = await hashPassword(password);

      const { data: emp, error } = await supabase
        .from('employees')
        .select('*')
        .eq('username', username)
        .eq('password', hashedPassword)
        .single();

      if (error || !emp) {
        return { success: false, message: 'Invalid username or password' };
      }

      if (emp.status === 'Inactive') {
        return { success: false, message: 'Account disabled. Contact Admin' };
      }

      const loggedUser = {
        id: emp.id,
        fullName: emp.full_name,
        username: emp.username,
        role: emp.role, // Yahan Demo user ke liye 'Demo' aayega
        status: emp.status
      };

      setUser(loggedUser);
      localStorage.setItem('akrack_logged_user', JSON.stringify(loggedUser));

      // NAYA UPDATE: role return karna zaroori hai
      return { success: true, role: emp.role, user: loggedUser };

    } catch (err) {
      console.log('LOGIN ERROR', err);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('akrack_logged_user');
  };

  const updateUserProfile = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('akrack_logged_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);