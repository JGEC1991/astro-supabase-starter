import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LanguageSelector from './LanguageSelector';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/vehicles', icon: 'directions_car', label: 'Vehicles' },
    { path: '/drivers', icon: 'people', label: 'Drivers' },
    { path: '/activities', icon: 'event_note', label: 'Activities' },
    { path: '/revenue', icon: 'payments', label: 'Revenue' },
    { path: '/expenses', icon: 'money_off', label: 'Expenses' },
    { path: '/admin', icon: 'admin_panel_settings', label: 'Admin' },
    { path: '/my-profile', icon: 'person', label: 'Profile' },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        alert(error.message);
      } else {
        console.log('Logged out');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
      alert(error.message);
    }
  };
  
  return (
    <div className={`sidebar ${collapsed ? 'w-16' : 'w-64'} fixed inset-y-0 left-0 z-30 bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
        {!collapsed && (
          <div className="text-xl font-bold text-white">CarFleet</div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          <span className="material-icons">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>
      
      <nav className="mt-5">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 
                  ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  ${collapsed ? 'justify-center' : 'justify-start'}`}
              >
                <span className="material-icons">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <LanguageSelector />
        <button
          onClick={handleLogout}
          className={`flex items-center text-gray-300 hover:text-white transition-colors duration-200
            ${collapsed ? 'justify-center' : 'justify-start'}`}
        >
          <span className="material-icons">logout</span>
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
