// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Lock, User, AlertCircle } from 'lucide-react';

// export const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     const res = await login(username, password);

//     if (res.success) {
//       navigate('/');
//     } else {
//       setError(res.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
//       {/* Decorative background grid */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

//       <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-8 relative z-10">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-brand-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-brand-600/30 mb-4">
//             AK
//           </div>
//           <h1 className="text-2xl font-bold text-white tracking-tight">AKRack</h1>
//           <p className="text-sm text-slate-400 mt-1">Smart Hardware Shop Price & Stock Manager</p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
//             <AlertCircle className="w-5 h-5 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-5">
//           <div>
//             <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Username / Email</label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
//                 <User className="w-5 h-5" />
//               </span>
//               <input
//                 type="text"
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
//                 placeholder="Username or Email"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
//                 <Lock className="w-5 h-5" />
//               </span>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
//                 placeholder="Enter password"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl shadow-lg shadow-brand-600/30 transition-all duration-150"
//           >
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };








import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login(username, password);

    if (res.success) {
      // Login success hone par user ka role check karna
      // (Agar backend res.user.role bhejta hai ya res.role, dono handle ho jayenge)
      const role = res?.user?.role || res?.role;

      if (role === 'Demo') {
        navigate('/demo-dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-brand-600/30 mb-4">
            AK
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AKRack</h1>
          <p className="text-sm text-slate-400 mt-1">Smart Hardware Shop Price & Stock Manager</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Username / Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Username or Email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl shadow-lg shadow-brand-600/30 transition-all duration-150"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};