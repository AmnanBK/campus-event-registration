import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Pastikan icon ini ada di folder assets
import buildingIcon from '../assets/icons/ic-building.svg';
import peopleIcon from '../assets/icons/ic-people.svg';
import calendarIcon from '../assets/icons/ic-calendar.svg';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_events: 0, total_participants: 0, total_organizers: 0 });
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, orgRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/organizers')
        ]);
        
        setStats(statsRes.data.data);
        
        const formattedData = orgRes.data.data.map(org => ({
          name: org.name,
          'Jumlah Acara': org.total_events
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-soft font-sans">
      <Navbar />
      
      <main className="pt-[100px] px-4 md:px-8 pb-10 max-w-7xl mx-auto">
        <h1 className="text-h2 text-neutral-main mb-6">Dashboard Admin</h1>

        {/* --- HEADER SECTION: BOX HIJAU & TAB SEJAJAR --- */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8 items-stretch">
          
          {/* 1. KOTAK HIJAU (STATS) */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-lg text-white flex-1 flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full divide-y md:divide-y-0 md:divide-x divide-white/20">
              
              {/* Stat 1 */}
              <div className="flex items-center gap-4 px-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  {/* Filter brightness-0 invert membuat icon jadi putih */}
                  <img src={calendarIcon} className="w-8 h-8 brightness-0 invert" alt=""/>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Total Acara</p>
                  <h3 className="text-3xl font-bold">{stats.total_events}</h3>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <img src={peopleIcon} className="w-8 h-8 brightness-0 invert" alt=""/>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Total Partisipan</p>
                  <h3 className="text-3xl font-bold">{stats.total_participants}</h3>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <img src={buildingIcon} className="w-8 h-8 brightness-0 invert" alt=""/>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Mitra Penyelenggara</p>
                  <h3 className="text-3xl font-bold">{stats.total_organizers}</h3>
                </div>
              </div>

            </div>
          </div>

          {/* 2. TAB NAVIGASI (SEJAJAR DI KANAN) */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-neutral-border flex flex-row xl:flex-col gap-2 min-w-[200px]">
             {/* Tombol Analytics (AKTIF) */}
             <div className="flex-1 bg-primary-surface/50 rounded-xl flex items-center justify-center px-6 py-3 border-2 border-primary-main text-primary-main font-bold cursor-default transition-all">
                Analytics
             </div>

             {/* Tombol Users (LINK) */}
             <Link 
               to="/admin/users" 
               className="flex-1 bg-transparent rounded-xl flex items-center justify-center px-6 py-3 text-neutral-secondary hover:bg-neutral-soft font-medium transition-all"
             >
                Kelola Penyelenggara
             </Link>
          </div>

        </div>

        {/* --- KONTEN (GRAFIK) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-border p-8 min-h-[400px]">
          <h3 className="text-[18px] font-bold text-neutral-main mb-6">Grafik Keaktifan Mitra</h3>
          <div className="w-full h-[400px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-neutral-secondary">Memuat data...</div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{top:20, right:30, left:20, bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#757575', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#757575', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#F8F9FA'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend wrapperStyle={{paddingTop:'20px'}}/>
                  <Bar dataKey="Jumlah Acara" fill="#059669" radius={[6,6,0,0]} barSize={50} name="Total Acara" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-secondary bg-neutral-soft/30 rounded-xl">
                <p>Belum ada data statistik.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;