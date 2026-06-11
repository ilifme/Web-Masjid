import { useState, useEffect } from "react";
import { aboutService, getImageUrl } from "../../services";
import Swal from "sweetalert2";

const AboutManagement = () => {
  const [formData, setFormData] = useState({ history: "", vision: "", mission: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mosqueFile, setMosqueFile] = useState(null);
  const [orgFile, setOrgFile] = useState(null);
  const [mosquePreview, setMosquePreview] = useState(null);
  const [orgPreview, setOrgPreview] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await aboutService.get();
      if (res.data) {
        setFormData({ history: res.data.history || "", vision: res.data.vision || "", mission: res.data.mission || "" });
        setMosquePreview(getImageUrl(res.data.mosqueImage));
        setOrgPreview(getImageUrl(res.data.organizationChart));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("history", formData.history);
    fd.append("vision", formData.vision);
    fd.append("mission", formData.mission);
    if (mosqueFile) fd.append("mosqueImage", mosqueFile);
    if (orgFile) fd.append("organizationChart", orgFile);
    try {
      await aboutService.update(fd);
      Swal.fire("Berhasil!", "Data tentang masjid berhasil diupdate", "success");
    } catch (err) { Swal.fire("Error", err.response?.data?.message || "Terjadi kesalahan", "error"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tentang Masjid</h1><p className="text-gray-600 dark:text-gray-400 mt-2">Edit informasi tentang masjid</p></div>
      <form onSubmit={handleSubmit} className="card space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Foto Masjid</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              {mosquePreview ? (
                <div className="relative">
                  <img src={mosquePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button type="button" onClick={() => { setMosqueFile(null); setMosquePreview(null); }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer" onClick={() => document.getElementById("mosqueInput").click()}>
                  <FiImage className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Klik untuk upload foto masjid</span>
                </label>
              )}
            </div>
            <input id="mosqueInput" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { setMosqueFile(f); setMosquePreview(URL.createObjectURL(f)); } }} />
          </div>
          <div>
            <label className="label">Struktur Organisasi</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              {orgPreview ? (
                <div className="relative">
                  <img src={orgPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button type="button" onClick={() => { setOrgFile(null); setOrgPreview(null); }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer" onClick={() => document.getElementById("orgInput").click()}>
                  <FiImage className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Klik untuk upload struktur organisasi</span>
                </label>
              )}
            </div>
            <input id="orgInput" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { setOrgFile(f); setOrgPreview(URL.createObjectURL(f)); } }} />
          </div>
        </div>
        <div><label className="label">Sejarah Masjid</label><textarea className="textarea" rows="8" value={formData.history} onChange={e => setFormData({...formData, history: e.target.value})} /></div>
        <div><label className="label">Visi</label><textarea className="textarea" rows="4" value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} /></div>
        <div><label className="label">Misi</label><textarea className="textarea" rows="6" value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})} /></div>
        <button type="submit" disabled={saving} className="btn btn-primary">{saving ? "Menyimpan..." : "Simpan Perubahan"}</button>
      </form>
    </div>
  );
};

export default AboutManagement;