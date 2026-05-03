// web/src/pages/SavingsPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupSavings, getPendingSavings, recordSaving, getGroupMembers } from '../services/api';

const MONTHS_MR = ['जानेवारी','फेब्रुवारी','मार्च','एप्रिल','मे','जून','जुलै','ऑगस्ट','सप्टेंबर','ऑक्टोबर','नोव्हेंबर','डिसेंबर'];

export default function SavingsPage() {
  const { groupId } = useParams();
  const now = new Date();
  const [monthIndex, setMonthIndex] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [paid, setPaid] = useState([]);
  const [pending, setPending] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ memberId: '', amount: '', paymentMode: 'cash' });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [paidRes, pendingRes, membersRes] = await Promise.all([
      getGroupSavings(groupId, year, monthIndex),
      getPendingSavings(groupId, year, monthIndex),
      getGroupMembers(groupId),
    ]);
    setPaid(paidRes.data || []);
    setPending(pendingRes.data || []);
    setMembers(membersRes.data || []);
  };

  useEffect(() => { fetchData(); }, [groupId, monthIndex, year]);

  const handleRecord = async () => {
    if (!form.memberId || !form.amount) return alert('सदस्य आणि रक्कम आवश्यक आहे');
    setLoading(true);
    try {
      await recordSaving({ groupId, ...form, monthIndex, year });
      setShowForm(false);
      setForm({ memberId: '', amount: '', paymentMode: 'cash' });
      fetchData();
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">बचत</h1>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium">+ नोंदवा</button>
      </div>

      {/* Month/Year selector */}
      <div className="flex gap-3">
        <select value={monthIndex} onChange={e => setMonthIndex(Number(e.target.value))} className="flex-1 input-field">
          {MONTHS_MR.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
        </select>
        <select value={year} onChange={e => setYear(Number(e.target.value))} className="input-field w-28">
          {[2023,2024,2025].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{paid.length}</p>
          <p className="text-green-600 text-sm">भरले ✅</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{pending.length}</p>
          <p className="text-red-500 text-sm">थकीत ⏳</p>
        </div>
      </div>

      {/* Record form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-md space-y-3">
          <p className="font-medium text-gray-700">बचत नोंदवा — {MONTHS_MR[monthIndex-1]} {year}</p>
          <select className="input-field" value={form.memberId} onChange={e => setForm({...form, memberId: e.target.value})}>
            <option value="">सदस्य निवडा</option>
            {pending.map(m => <option key={m.memberId} value={m.memberId}>{m.userName}</option>)}
          </select>
          <input type="number" className="input-field" placeholder="रक्कम ₹" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
          <select className="input-field" value={form.paymentMode} onChange={e => setForm({...form, paymentMode: e.target.value})}>
            <option value="cash">रोख</option>
            <option value="upi">UPI</option>
            <option value="bank">बँक</option>
          </select>
          <div className="flex gap-3">
            <button onClick={handleRecord} disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-xl disabled:opacity-50">{loading?'...':'जतन करा'}</button>
            <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl">रद्द</button>
          </div>
        </div>
      )}

      {/* Pending members */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-semibold text-red-600 mb-2">थकीत सदस्य ({pending.length})</h2>
          <div className="space-y-2">
            {pending.map(m => (
              <div key={m.memberId} className="bg-red-50 rounded-xl p-3 flex justify-between items-center">
                <p className="font-medium text-gray-800">{m.userName}</p>
                <p className="text-gray-500 text-sm">{m.mobileNumber}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid members */}
      {paid.length > 0 && (
        <div>
          <h2 className="font-semibold text-green-700 mb-2">भरलेले सदस्य ({paid.length})</h2>
          <div className="space-y-2">
            {paid.map(s => (
              <div key={s.savingId} className="bg-green-50 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{s.memberId}</p>
                  <p className="text-gray-500 text-xs">{s.paymentMode}</p>
                </div>
                <p className="font-bold text-green-700">₹{s.amount.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}