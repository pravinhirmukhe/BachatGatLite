// web/src/pages/GroupDetailPage.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGroup } from '../services/api';

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => { getGroup(groupId).then(r => setGroup(r.data)); }, [groupId]);

  if (!group) return <div className="p-6 text-center text-gray-400">लोड होत आहे...</div>;

  const actions = [
    { to: `/groups/${groupId}/members`, label: 'सदस्य', icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { to: `/groups/${groupId}/savings`, label: 'बचत', icon: '💰', color: 'bg-green-50 text-green-700' },
    { to: `/groups/${groupId}/loans`, label: 'कर्ज', icon: '📋', color: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="bg-green-700 rounded-2xl p-5 text-white">
        <h1 className="text-xl font-bold">{group.groupName}</h1>
        <p className="text-green-200 text-sm mt-1">{group.description}</p>
        <div className="flex gap-6 mt-4">
          <div><p className="text-green-300 text-xs">एकूण बचत</p><p className="text-2xl font-bold">₹{(group.totalSavings||0).toLocaleString('en-IN')}</p></div>
          <div><p className="text-green-300 text-xs">एकूण कर्ज</p><p className="text-2xl font-bold">₹{(group.totalLoansGiven||0).toLocaleString('en-IN')}</p></div>
          <div><p className="text-green-300 text-xs">सदस्य</p><p className="text-2xl font-bold">{group.memberCount}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {actions.map(a => (
          <Link key={a.to} to={a.to} className={`${a.color} rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition`}>
            <p className="text-3xl mb-2">{a.icon}</p>
            <p className="font-semibold text-sm">{a.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-3">गट माहिती</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">मासिक वर्गणी</span><span className="font-medium">₹{group.monthlyAmount}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">बैठकीचा दिवस</span><span className="font-medium capitalize">{group.meetingDay}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">स्थिती</span><span className={`font-medium ${group.status==='active'?'text-green-600':'text-gray-500'}`}>{group.status==='active'?'सक्रिय':'बंद'}</span></div>
        </div>
      </div>
    </div>
  );
}