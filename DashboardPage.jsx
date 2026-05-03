// web/src/pages/DashboardPage.jsx
// Main dashboard — shows aggregated stats across all groups

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getMyGroups } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default function DashboardPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyGroups()
      .then(res => setGroups(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  // Aggregate across all groups
  const totalSavings = groups.reduce((sum, g) => sum + (g.totalSavings || 0), 0);
  const totalLoans = groups.reduce((sum, g) => sum + (g.totalLoansGiven || 0), 0);
  const totalMembers = groups.reduce((sum, g) => sum + (g.memberCount || 0), 0);

  const chartData = groups.map(g => ({
    name: g.groupName.length > 10 ? g.groupName.slice(0, 10) + '…' : g.groupName,
    savings: g.totalSavings || 0,
    loans: g.totalLoansGiven || 0,
  }));

  if (loading) return <div className="p-6 text-center text-gray-500">{t('loading')}</div>;

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          नमस्कार, {profile?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm">{t('dashboard')}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label={t('total_savings')}
          value={`₹${totalSavings.toLocaleString('en-IN')}`}
          icon="💰"
          color="border-green-500"
        />
        <StatCard
          label={t('active_loans')}
          value={`₹${totalLoans.toLocaleString('en-IN')}`}
          icon="📋"
          color="border-orange-500"
        />
        <StatCard
          label={t('total_members')}
          value={totalMembers}
          icon="👥"
          color="border-blue-500"
        />
        <StatCard
          label="एकूण गट"
          value={groups.length}
          icon="🏘️"
          color="border-purple-500"
        />
      </div>

      {/* Chart */}
      {groups.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">गटनिहाय बचत vs कर्ज</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} />
              <Bar dataKey="savings" name="बचत" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="loans" name="कर्ज" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Group List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-700">{t('my_groups')}</h2>
          <Link to="/groups" className="text-green-600 text-sm font-medium">सर्व पहा →</Link>
        </div>
        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-400 text-4xl mb-3">🏘️</p>
            <p className="text-gray-500">अजून कोणताही गट नाही</p>
            <Link to="/groups" className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-medium">
              {t('create_group')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map(g => (
              <Link key={g.groupId} to={`/groups/${g.groupId}`}>
                <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <p className="font-semibold text-gray-800">{g.groupName}</p>
                    <p className="text-gray-500 text-sm">{g.memberCount} सदस्य · ₹{g.monthlyAmount}/माह</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-700 font-semibold text-sm">₹{(g.totalSavings || 0).toLocaleString('en-IN')}</p>
                    <p className="text-gray-400 text-xs">बचत</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}