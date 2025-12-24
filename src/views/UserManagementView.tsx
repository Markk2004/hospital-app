import React, { useState } from 'react';
import { Search, Bell, Plus, Settings, LogOut } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'Admin' | 'User' | 'Technician';
  department: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
}

const USERS_DATA: User[] = [
  {
    id: '1',
    name: 'ดร.สมชาย ใจดี',
    avatar: 'สช',
    role: 'Admin',
    department: 'ฉุกเฉิน',
    status: 'Active',
    lastLogin: '5 นาทีที่แล้ว'
  },
  {
    id: '2',
    name: 'สมหญิง รักษ์ดี',
    avatar: 'สญ',
    role: 'User',
    department: 'ICU',
    status: 'Active',
    lastLogin: '2 ชม. ที่แล้ว'
  },
  {
    id: '3',
    name: 'วิชัย ช่างซ่อม',
    avatar: 'วช',
    role: 'Technician',
    department: 'ซ่อมบำรุง',
    status: 'Active',
    lastLogin: '15 นาทีที่แล้ว'
  },
  {
    id: '4',
    name: 'สุดา จัดการ',
    avatar: 'สด',
    role: 'User',
    department: 'คลังพัสดุ',
    status: 'Active',
    lastLogin: '1 วันที่แล้ว'
  },
  {
    id: '5',
    name: 'มานี หมดสมัย',
    avatar: 'มน',
    role: 'User',
    department: 'ผู้ป่วยนอก',
    status: 'Inactive',
    lastLogin: '30 วันที่แล้ว'
  },
  {
    id: '6',
    name: 'ประยุทธ์ ช่วยเหลือ',
    avatar: 'ปย',
    role: 'Technician',
    department: 'ซ่อมบำรุง',
    status: 'Active',
    lastLogin: '1 ชม. ที่แล้ว'
  },
  {
    id: '7',
    name: 'สมศรี พยาบาล',
    avatar: 'สศ',
    role: 'User',
    department: 'ผู้ป่วยใน',
    status: 'Suspended',
    lastLogin: '3 วันที่แล้ว'
  }
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Active: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    Inactive: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    Suspended: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
};

export const UserManagementView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = USERS_DATA.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return user.name.toLowerCase().includes(searchLower) || 
           user.role.toLowerCase().includes(searchLower) ||
           user.department.toLowerCase().includes(searchLower);
  });

  const handleSettings = (user: User) => {
    alert(`ตั้งค่าผู้ใช้: ${user.name}`);
  };

  const handleLogout = (user: User) => {
    if (confirm(`คุณต้องการออกจากระบบผู้ใช้ "${user.name}" หรือไม่?`)) {
      alert('ออกจากระบบสำเร็จ');
    }
  };

  const handleAddUser = () => {
    alert('เปิดฟอร์มเพิ่มผู้ใช้งานใหม่');
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-cyan-50/20 to-slate-50">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-800">ผู้ใช้งานในระบบ</h1>
            <div className="flex items-center gap-4">
              {/* Global Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-slate-200">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="outline-none text-sm w-32 lg:w-48"
                />
              </div>
              
              {/* Notification Bell */}
              <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-6 h-6 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Control Bar */}
          <div className="glass-morphism glass-morphism-hover p-4 rounded-2xl animate-fade-in-up animation-delay-100">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 w-full relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาผู้ใช้งาน"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-700"
                />
              </div>

              {/* Add User Button */}
              <button
                onClick={handleAddUser}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-cyan-600/30"
              >
                <Plus className="w-5 h-5" />
                เพิ่มผู้ใช้งาน
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">จัดการสิทธิ์การเข้าถึง</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">ผู้ใช้งาน</th>
                    <th className="px-6 py-4">บทบาท (Role)</th>
                    <th className="px-6 py-4">แผนก</th>
                    <th className="px-6 py-4">สถานะ</th>
                    <th className="px-6 py-4">ใช้งานล่าสุด</th>
                    <th className="px-6 py-4">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                            ${user.role === 'Admin' ? 'bg-indigo-500' : 'bg-blue-400'}`}>
                            {user.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">{user.name}</p>
                            <p className="text-xs text-gray-400">@{user.role.toLowerCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium border
                          ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                            user.role === 'Technician' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                            'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.department}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSettings(user)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="ตั้งค่า"
                          >
                            <Settings size={16} />
                          </button>
                          <button 
                            onClick={() => handleLogout(user)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="ออกจากระบบ"
                          >
                            <LogOut size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                    <Search className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-600 mb-2">ไม่พบผู้ใช้งาน</h3>
                  <p className="text-slate-500">ลองค้นหาด้วยคำค้นอื่น</p>
                </div>
              )}
            </div>
          </div>

          {/* Spacing at bottom */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
