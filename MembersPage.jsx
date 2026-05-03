// web/src/pages/MembersPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupMembers, addMember, removeMember } from '../services/api';

export default function MembersPage() {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMembers = () => getGroupMembers(groupId).then(r => setMembers(r.data || []));
  useEffect(() => { fetchMembers(); }, [groupId]);

  const handleAdd = async () => {
    if (!userId.trim()) return alert('User ID आवश्यक आहे');
    setLoading(true);
    try {
      await addMember({ groupId, userId: userId.trim() });
      setUserId(''); setShowForm(false);
      fetchMembers();
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  const handleRemove = async (memberId, name) => {
    if (!confirm(`${name} ला गटातून काढायचे आहे का?`)) return;
    try { await removeMember(memberId); fetchMembers(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">सदस्य ({members.length})</h1>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium">+ सदस्य जोडा</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-md space-y-3">
          <p className="font-medium text-gray-700">सदस्याचा User ID टाका</p>
          <input className="input-field" placeholder="User UID (Firebase)" value={userId} onChange={e => setUserId(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-xl disabled:opacity-50">{loading ? '...' : 'जोडा'}</button>
            <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl">रद्द</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {members.map(m => (
          <div key={m.memberId} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">{m.userName}</p>
                <p className="text-gray-500 text-sm">{m.mobileNumber}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${m.role==='admin'?'bg-purple-100 text-purple-700':'bg-gray-100 text-gray-600'}`}>
                  {m.role==='admin'?'अध्यक्ष':'सदस्य'}
                </span>
              </div>
              {m.role !== 'admin' && (
                <button onClick={() => handleRemove(m.memberId, m.userName)} className="text-red-500 text-sm hover:text-red-700">काढा</button>
              )}
            </div>
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 text-sm">
              <div><p className="text-gray-400 text-xs">एकूण बचत</p><p className="font-semibold text-green-700">₹{(m.totalSaved||0).toLocaleString('en-IN')}</p></div>
              <div><p className="text-gray-400 text-xs">बाकी कर्ज</p><p className={`font-semibold ${m.outstandingLoan>0?'text-red-600':'text-gray-400'}`}>₹{(m.outstandingLoan||0).toLocaleString('en-IN')}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}