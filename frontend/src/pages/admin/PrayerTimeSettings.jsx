import { useState, useEffect } from "react";
import { prayerTimeService } from "../../services";
import { FiSave, FiMapPin, FiClock, FiCalendar, FiRefreshCw, FiSettings } from "react-icons/fi";
import Swal from "sweetalert2";

const methods = [
  { value: 0, label: "University of Islamic Sciences, Karachi" },
  { value: 1, label: "University of Islamic Sciences, Karachi (Hanafi)" },
  { value: 2, label: "Islamic Society of North America (ISNA)" },
  { value: 3, label: "Muslim World League (MWL)" },
  { value: 4, label: "Umm Al-Qura University, Makkah" },
  { value: 5, label: "Egyptian General Authority of Survey" },
  { value: 7, label: "Institute of Geophysics, University of Tehran" },
  { value: 8, label: "Gulf Region" },
  { value: 9, label: "Kuwait" },
  { value: 10, label: "Qatar" },
  { value: 11, label: "Majlis Ugama Islam Singapura, Singapore" },
  { value: 12, label: "Union Organization Islamic de France" },
  { value: 13, label: "Diyanet Isleri Baskanligi, Turkey" },
  { value: 14, label: "Spiritual Administration of Muslims of Russia" },
  { value: 15, label: "Moonsighting Committee Worldwide" },
  { value: 16, label: "Dubai" },
  { value: 17, label: "Jakarta (Kemenag RI)" },
  { value: 18, label: "Tunisia" },
  { value: 19, label: "Algeria" },
  { value: 20, label: "Morocco" },
  { value: 21, label: "Islamic Affairs and Charitable Activities Department" },
  { value: 22, label: "Ministry of Endowments and Religious Affairs, Oman" },
];

const PrayerTimeSettings = () => {
  const [settings, setSettings] = useState({
    city: "Jakarta", country: "Indonesia", latitude: -6.2088, longitude: 106.8456,
    method: 17, timezone: "Asia/Jakarta"
  });
  const [today, setToday] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("settings");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const settingsRes = await prayerTimeService.getSettings();
      if (settingsRes.data) {
        setSettings({
          city: settingsRes.data.city || "Jakarta",
          country: settingsRes.data.country || "Indonesia",
          latitude: settingsRes.data.latitude || -6.2088,
          longitude: settingsRes.data.longitude || 106.8456,
          method: settingsRes.data.method || 17,
          timezone: settingsRes.data.timezone || "Asia/Jakarta",
        });
      }
      try {
        const todayRes = await prayerTimeService.getToday();
        if (todayRes.data) setToday(todayRes.data);
      } catch (e) { console.log("Today not available yet"); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await prayerTimeService.updateSettings(settings);
      Swal.fire("Berhasil!", "Pengaturan jadwal sholat disimpan", "success");
      // Refresh today after saving
      try {
        const todayRes = await prayerTimeService.getToday();
        if (todayRes.data) setToday(todayRes.data);
      } catch (e) { }
    } catch (err) {
      Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message, icon: "error", confirmButtonColor: "#10b981" });
    } finally { setSaving(false); }
  };

  const fetchMonthly = async () => {
    try {
      const res = await prayerTimeService.getMonthly(month, year);
      if (res.data) setMonthly(res.data);
    } catch (err) {
      Swal.fire({ title: "Gagal", text: "Gagal memuat jadwal bulanan", icon: "error", confirmButtonColor: "#10b981" });
    }
  };

  useEffect(() => { if (tab === "monthly") fetchMonthly(); }, [tab, month, year]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  const prayerNames = { fajr: "Subuh", sunrise: "Terbit", dhuhr: "Dzuhur", asr: "Ashar", maghrib: "Maghrib", isha: "Isya" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Jadwal Sholat</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Pengaturan lokasi dan jadwal waktu sholat</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
        <button onClick={() => setTab("settings")} className={"px-4 py-2 rounded-lg text-sm font-medium " + (tab === "settings" ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm" : "text-gray-500")}>
          <FiSettings className="inline mr-1" /> Pengaturan
        </button>
        <button onClick={() => setTab("today")} className={"px-4 py-2 rounded-lg text-sm font-medium " + (tab === "today" ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm" : "text-gray-500")}>
          <FiClock className="inline mr-1" /> Hari Ini
        </button>
        <button onClick={() => setTab("monthly")} className={"px-4 py-2 rounded-lg text-sm font-medium " + (tab === "monthly" ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm" : "text-gray-500")}>
          <FiCalendar className="inline mr-1" /> Bulanan
        </button>
      </div>

      {tab === "settings" && (
        <div className="card max-w-2xl space-y-4">
          <h2 className="text-xl font-bold mb-4">Lokasi & Metode</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kota</label>
              <input className="input" value={settings.city} onChange={e => setSettings({...settings, city: e.target.value})} />
            </div>
            <div>
              <label className="label">Negara</label>
              <input className="input" value={settings.country} onChange={e => setSettings({...settings, country: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Latitude</label>
              <input type="number" step="0.0001" className="input" value={settings.latitude} onChange={e => setSettings({...settings, latitude: parseFloat(e.target.value)})} />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input type="number" step="0.0001" className="input" value={settings.longitude} onChange={e => setSettings({...settings, longitude: parseFloat(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="label">Metode Kalkulasi</label>
            <select className="input" value={settings.method} onChange={e => setSettings({...settings, method: parseInt(e.target.value)})}>
              {methods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Timezone</label>
            <input className="input" value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})} placeholder="Asia/Jakarta" />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary flex items-center gap-2">
            <FiSave /> {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      )}

      {tab === "today" && (
        <div className="max-w-2xl">
          {today ? (
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <FiMapPin className="text-primary-600" />
                <h2 className="text-xl font-bold">{today.location?.city}, {today.location?.country}</h2>
                <span className="text-sm text-gray-500 ml-auto">{today.date}</span>
              </div>
              {today.hijri && (
                <p className="text-sm text-gray-500 mb-4">{today.hijri.day} {today.hijri.month.en||today.hijri.month.number} {today.hijri.year} H</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(prayerNames).map(([key, label]) => (
                  today.timings && today.timings[key] ? (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                      <p className="text-2xl font-bold text-primary-600">{today.timings[key]}</p>
                    </div>
                  ) : null
                ))}
              </div>
              <button onClick={fetchData} className="btn btn-secondary mt-4 flex items-center gap-2">
                <FiRefreshCw /> Refresh
              </button>
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-gray-500 mb-4">Jadwal hari ini belum tersedia</p>
              <p className="text-sm text-gray-400 mb-4">Simpan pengaturan lokasi terlebih dahulu</p>
              <button onClick={() => setTab("settings")} className="btn btn-primary">Atur Lokasi</button>
            </div>
          )}
        </div>
      )}

      {tab === "monthly" && (
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <select className="input w-32" value={month} onChange={e => setMonth(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString("id", { month: "long" })}</option>
              ))}
            </select>
            <input type="number" className="input w-24" value={year} onChange={e => setYear(parseInt(e.target.value))} />
            <button onClick={fetchMonthly} className="btn btn-secondary flex items-center gap-2"><FiRefreshCw /> Muat</button>
          </div>

          {monthly ? (
            <div className="card overflow-x-auto">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin className="text-primary-600" />
                <span className="font-medium">{monthly.location?.city}, {monthly.location?.country}</span>
                <span className="text-sm text-gray-500 ml-auto">{monthly.month}/{monthly.year}</span>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 font-semibold">Tanggal</th>
                    <th className="pb-3 font-semibold">Subuh</th>
                    <th className="pb-3 font-semibold">Terbit</th>
                    <th className="pb-3 font-semibold">Dzuhur</th>
                    <th className="pb-3 font-semibold">Ashar</th>
                    <th className="pb-3 font-semibold">Maghrib</th>
                    <th className="pb-3 font-semibold">Isya</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.calendar?.map((day, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 font-medium">{day.date}</td>
                      <td className="py-3">{day.timings?.fajr}</td>
                      <td className="py-3 text-gray-400">{day.timings?.sunrise}</td>
                      <td className="py-3">{day.timings?.dhuhr}</td>
                      <td className="py-3">{day.timings?.asr}</td>
                      <td className="py-3">{day.timings?.maghrib}</td>
                      <td className="py-3">{day.timings?.isha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-gray-500">Klik "Muat" untuk menampilkan jadwal bulanan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrayerTimeSettings;
