// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const LoginDummy = () => <h2>Halaman Login (Belum diimplementasi)</h2>;
const DashboardMahasiswa = () => <h2>Dashboard Mahasiswa</h2>;
const DashboardPenyelenggara = () => <h2>Dashboard Penyelenggara</h2>;
const DashboardKampus = () => <h2>Dashboard Kampus</h2>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginDummy />} />

          {/* Role: Mahasiswa */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/" element={<DashboardMahasiswa />} />
            <Route path="/events" element={<h2>Daftar Event</h2>} />
            <Route path="/history" element={<h2>Riwayat Pendaftaran</h2>} />
          </Route>

          {/* Role: Penyelenggara */}
          <Route
            path="/organizer"
            element={<ProtectedRoute allowedRoles={['organizer']} />}
          >
            <Route path="dashboard" element={<DashboardPenyelenggara />} />
            <Route path="create-event" element={<h2>Buat Event Baru</h2>} />
          </Route>

          {/* Role: Manajemen Kampus */}
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={['admin']} />}
          >
            <Route path="dashboard" element={<DashboardKampus />} />
            <Route path="users" element={<h2>Kelola User</h2>} />
          </Route>

          {/* Fallback kalau nyasar */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
