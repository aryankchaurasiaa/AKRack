// import React, { useState } from 'react';
// import { useApp } from '../context/AppContext';
// import { useAuth } from '../context/AuthContext';
// import { EmployeeModal } from '../components/EmployeeModal';
// import { Plus, Edit2, Trash2, Key, Shield } from 'lucide-react';

// export const Employees = () => {
//   const { employees, addEmployee, updateEmployee, deleteEmployee, resetEmployeePassword, toggleEmployeeStatus } = useApp();
//   const { user } = useAuth();
  
//   const isSuperAdmin = user?.role === 'Super Admin';
  
//   // LOGIC: Super Admin sirf 'Admin' dekhega. Admin sirf 'Employee' dekhega.
//   const displayUsers = employees.filter(e => 
//     isSuperAdmin ? e.role === 'Admin' : e.role === 'Employee'
//   );

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   const handleOpenAdd = () => {
//     setSelectedEmployee(null);
//     setIsModalOpen(true);
//   };

//   const handleOpenEdit = (emp) => {
//     setSelectedEmployee(emp);
//     setIsModalOpen(true);
//   };

//   const handleSaveEmployee = async (formData) => {
//     if (selectedEmployee) {
//       await updateEmployee(selectedEmployee.id, formData);
//     } else {
//       // Yahan automatic role assign ho jayega
//       await addEmployee({
//         ...formData,
//         role: isSuperAdmin ? 'Admin' : 'Employee'
//       });
//     }
//   };

//   const handleResetPasswordPrompt = (emp) => {
//     // FIX: Fallback lagaya gaya hai taaki UI prompt me bhi naam theek dikhe
//     const empName = emp.fullName || emp.full_name;
//     const newPass = prompt(`Enter new password for ${empName}:`, '123456');
//     if (newPass) {
//       resetEmployeePassword(emp.id, newPass);
//       alert('Password successfully reset.');
//     }
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-200">
//       <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
//         <div>
//           <h3 className="text-lg font-bold text-slate-900 dark:text-white">
//             {isSuperAdmin ? 'Admin Management' : 'Employee Management'}
//           </h3>
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             {isSuperAdmin ? 'Add, edit, or remove shop owners.' : 'Manage employee accounts and status.'}
//           </p>
//         </div>
//         <button onClick={handleOpenAdd} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-md shadow-brand-600/25 transition-colors">
//           <Plus className="w-5 h-5" /> {isSuperAdmin ? 'Add Admin' : 'Add Employee'}
//         </button>
//       </div>

//       <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
//                 <th className="py-4 px-6">Full Name</th>
//                 <th className="py-4 px-6">Username</th>
//                 <th className="py-4 px-6">Role</th>
//                 <th className="py-4 px-6">Status</th>
//                 <th className="py-4 px-6 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
//               {displayUsers.length > 0 ? displayUsers.map((emp) => (
//                 <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
//                   {/* FIX APPLIED HERE: emp.fullName || emp.full_name */}
//                   <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{emp.fullName || emp.full_name}</td>
//                   <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono">@{emp.username}</td>
//                   <td className="py-4 px-6">
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-semibold text-xs rounded-full">
//                       <Shield className="w-3.5 h-3.5" /> {emp.role}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <button onClick={() => toggleEmployeeStatus(emp.id)} className={`px-3 py-1 font-semibold text-xs rounded-full transition-colors ${emp.status === 'Active' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200'}`}>
//                       {emp.status}
//                     </button>
//                   </td>
//                   <td className="py-4 px-6 text-right space-x-2">
//                     <button onClick={() => handleResetPasswordPrompt(emp)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/40 rounded-lg text-slate-600 dark:text-slate-300 transition-colors" title="Reset Password">
//                       <Key className="w-4 h-4" />
//                     </button>
//                     <button onClick={() => handleOpenEdit(emp)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/40 rounded-lg text-slate-600 dark:text-slate-300 transition-colors" title="Edit User">
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                     <button onClick={() => deleteEmployee(emp.id)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 rounded-lg text-slate-600 dark:text-slate-300 transition-colors" title="Delete User">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               )) : (
//                 <tr>
//                   <td colSpan="5" className="py-8 text-center text-slate-500">
//                     No {isSuperAdmin ? 'Admins' : 'Employees'} found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <EmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEmployee} employee={selectedEmployee} />
//     </div>
//   );
// };










import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { EmployeeModal } from '../components/EmployeeModal';
import { Plus, Edit2, Trash2, Key, Shield, Eye } from 'lucide-react';

export const Employees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, resetEmployeePassword, toggleEmployeeStatus } = useApp();
  const { user } = useAuth();
  
  const isSuperAdmin = user?.role === 'Super Admin';
  
  // LOGIC: Super Admin 'Admin' aur 'Demo' dekhega. Admin 'Employee' aur 'Demo' dekhega. (Purana logic ekdum safe)
  const displayUsers = employees.filter(e => 
    isSuperAdmin ? (e.role === 'Admin' || e.role === 'Demo') : (e.role === 'Employee' || e.role === 'Demo')
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Naya State: Taaki pata chale ki kaunsa button dabaya gaya hai (Demo ya Regular)
  const [addingRole, setAddingRole] = useState(''); 

  const handleOpenAdd = (roleType) => {
    setSelectedEmployee(null);
    setAddingRole(roleType); // 'Admin', 'Employee', ya 'Demo' set hoga
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (formData) => {
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee.id, formData);
    } else {
      // Yahan automatic role assign ho jayega jo button dabane par set hua tha
      await addEmployee({
        ...formData,
        role: addingRole 
      });
    }
  };

  const handleResetPasswordPrompt = (emp) => {
    const empName = emp.fullName || emp.full_name;
    const newPass = prompt(`Enter new password for ${empName}:`, '123456');
    if (newPass) {
      resetEmployeePassword(emp.id, newPass);
      alert('Password successfully reset.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isSuperAdmin ? 'Admin Management' : 'Employee Management'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isSuperAdmin ? 'Add, edit, or remove shop owners and demo users.' : 'Manage employee accounts and demo users.'}
          </p>
        </div>
        
        {/* Yahan do buttons lagaye gaye hain taaki koi form ya modal chhedna na pade */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleOpenAdd('Demo')} 
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-medium rounded-xl border border-slate-200 dark:border-slate-600 transition-colors"
          >
            <Eye className="w-4 h-4" /> Add Demo
          </button>
          
          <button 
            onClick={() => handleOpenAdd(isSuperAdmin ? 'Admin' : 'Employee')} 
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-md shadow-brand-600/25 transition-colors"
          >
            <Plus className="w-5 h-5" /> {isSuperAdmin ? 'Add Admin' : 'Add Employee'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Full Name</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              {displayUsers.length > 0 ? displayUsers.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{emp.fullName || emp.full_name}</td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono">@{emp.username}</td>
                  <td className="py-4 px-6">
                    {/* Demo aur baaki roles ka rang alag set kiya gaya hai */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-xs rounded-full ${
                      emp.role === 'Demo' 
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' 
                      : 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                    }`}>
                      <Shield className="w-3.5 h-3.5" /> {emp.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={() => toggleEmployeeStatus(emp.id)} className={`px-3 py-1 font-semibold text-xs rounded-full transition-colors ${emp.status === 'Active' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200'}`}>
                      {emp.status}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button onClick={() => handleResetPasswordPrompt(emp)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/40 rounded-lg text-slate-600 dark:text-slate-300 transition-colors" title="Reset Password">
                      <Key className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenEdit(emp)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/40 rounded-lg text-slate-600 dark:text-slate-300 transition-colors" title="Edit User">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteEmployee(emp.id)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 rounded-lg text-slate-600 dark:text-slate-300 transition-colors" title="Delete User">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No {isSuperAdmin ? 'Admins' : 'Employees'} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEmployee} employee={selectedEmployee} />
    </div>
  );
};