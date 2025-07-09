// resources/js/Components/Admin/Reservation/AdminTabs.jsx
import React from 'react';

const AdminTabs = ({ activeTab, setActiveTab, pendingCount }) => {
  const tabs = [
    { label: 'Approved', value: 'approved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Schedule', value: 'schedule' }
  ];

  return (
    <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-600 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors duration-300
            ${activeTab === tab.value
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'}
          `}
        >
          {tab.value === 'pending' ? (
            <span className="relative inline-flex items-center">
              {tab.label}
              {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
                  {pendingCount}
                </span>
              )}
            </span>
          ) : tab.label}
        </button>
      ))}
    </div>
  );
};

export default AdminTabs;
