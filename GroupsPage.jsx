// web/src/pages/GroupsPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyGroups, createGroup } from '../services/api';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ groupName: '', monthlyAmount: '', meetingDay: 'sunday', description: '' });
  const [loading, setLoading] = useState(false);

  const fetchGroups = () => getMyGroups().then(res => setGroups(res.data || []));
  useEffect(() => { fetchGroups(); }, []);

  const handleCreate = async () => {
    if (!form.groupName || !form.monthlyAmount) return alert('गटाचे नाव आणि मासिक रक्कम आवश्यक आहे');
    setLoading(true);
    try {
      await createGroup(form);
      setShowForm(false);
      setForm({ groupName: '', monthlyAmount: '', meetingDay: 'sunday', description: '' });
      fetchGroups();
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">माझे गट</h1>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium">+ नवीन गट</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">
          <h2 className="font-semibold text-gray-700">नवीन गट बनवा</h2>
          <input className="input-field" placeholder="गटाचे नाव *" value={form.groupName} onChange={e => setForm({...form, groupName: e.target.value})} />
          <input className="input-field" type="number" placeholder="मासिक वर्गणी ₹ *" value={form.monthlyAmount} onChange={e => setForm({...form, monthlyAmount: e.target.value})} />
          <input className="input-field" placeholder="वर्णन (ऐच्छिक)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <select className="input-field" value={form.meetingDay} onChange={e => setForm({...form, meetingDay: e.target.value})}>
            <option value="sunday">रविवार</option>
            <option value="monday">सोमवार</option>
            <option value="saturday">शनिवार</option>
          </select>
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium disabled:opacity-50">
              {loading ? 'तयार होत आहे...' : 'गट तयार करा'}
            </button>
            <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium">रद्द करा</button>
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏘️</p>
          <p>कोणताही गट नाही. नवीन गट बनवा.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(g => (
            <Link key={g.groupId} to={`/groups/${g.groupId}`} className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{g.groupName}</p>
                  <p className="text-gray-500 text-sm mt-1">{g.memberCount} सदस्य · ₹{g.monthlyAmount}/माह</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${g.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {g.status === 'active' ? 'सक्रिय' : 'बंद'}
                </span>
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
                <div><p className="text-xs text-gray-400">एकूण बचत</p><p className="font-semibold text-green-700">₹{(g.totalSavings||0).toLocaleString('en-IN')}</p></div>
                <div><p className="text-xs text-gray-400">एकूण कर्ज</p><p className="font-semibold text-orange-600">₹{(g.totalLoansGiven||0).toLocaleString('en-IN')}</p></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}