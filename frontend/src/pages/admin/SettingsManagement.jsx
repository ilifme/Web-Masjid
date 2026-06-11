import { useState, useEffect } from "react";
import { settingService, getImageUrl } from "../../services";
import { FiSave, FiImage, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    site_name: "", site_description: "", address: "", phone: "", email: "",
    facebook: "", instagram: "", youtube: "", maps_embed: "", footer_logo: null
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingService.getPublic();
      if (res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
        if (res.data.footer_logo) setLogoPreview(getImageUrl(res.data.footer_logo));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    const bulkData = [
      { key: "site_name", value: settings.site_name },
      { key: "site_description", value: settings.site_description },
      { key: "address", value: settings.address },
      { key: "phone", value: settings.phone },
      { key: "email", value: settings.email },
      { key: "facebook", value: settings.facebook },
      { key: "instagram", value: settings.instagram },
      { key: "youtube", value: settings.youtube },
      { key: "maps_embed", value: settings.maps_embed },
    ];
    try {
      await settingService.bulkUpdate(bulkData);
      if (logoFile) {
        const fd = new FormData();
        fd.append("key", "footer_logo");
        fd.append("value", "uploaded");
        fd.append("type", "image");
        fd.append("group", "general");
        fd.append("label", "Footer Logo");
        // Upload logo separately
        const upForm = new FormData();
        upForm.append("logo", logoFile);
        await fetch(import.meta.env.VITE_API_URL + "/settings/footer-logo", {
          method: "POST", headers: { Authorization: "Bearer " + localStorage.getItem("token") }, body: upForm
        });
      }
      Swal.fire("Berhasil!", "Pengaturan footer berhasil disimpan", "success");
    } catch (err) { Swal.fire("Error", err.response?.data?.message || "Terjadi kesalahan", "error"); }
    finally { setSaving(false); }
  };

  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengaturan Footer</h1><p className="text-gray-600 dark:text-gray-400 mt-2">Kelola logo, kontak, dan sosial media di footer</p></div>

      {/* Logo Footer */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Logo Footer</h2>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 max-w-xs">
          {logoPreview ? (
            <div className="relative">
              <img src={logoPreview} alt="Logo" className="w-full h-32 object-contain rounded-lg" />
              <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <FiTrash2 />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center cursor-pointer">
              <FiImage className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Upload Logo Footer</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); } }} />
            </label>
          )}
        </div>
      </div>

      {/* Informasi Website */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Informasi Website</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="label">Nama Website</label><input className="input" value={settings.site_name} onChange={e => update("site_name", e.target.value)} /></div>
          <div><label className="label">Deskripsi Website</label><input className="input" value={settings.site_description} onChange={e => update("site_description", e.target.value)} /></div>
        </div>
      </div>

      {/* Kontak */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Informasi Kontak</h2>
        <div className="space-y-4">
          <div><label className="label">Alamat</label><textarea className="textarea" rows="2" value={settings.address} onChange={e => update("address", e.target.value)} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Telepon</label><input className="input" value={settings.phone} onChange={e => update("phone", e.target.value)} /></div>
            <div><label className="label">Email</label><input className="input" value={settings.email} onChange={e => update("email", e.target.value)} /></div>
          </div>
          <div><label className="label">Google Maps Embed</label><textarea className="textarea" rows="3" value={settings.maps_embed} onChange={e => update("maps_embed", e.target.value)} placeholder="<iframe src=..." /></div>
        </div>
      </div>

      {/* Sosial Media */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Sosial Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="label">Facebook URL</label><input className="input" value={settings.facebook} onChange={e => update("facebook", e.target.value)} placeholder="https://facebook.com/..." /></div>
          <div><label className="label">Instagram URL</label><input className="input" value={settings.instagram} onChange={e => update("instagram", e.target.value)} placeholder="https://instagram.com/..." /></div>
          <div><label className="label">YouTube URL</label><input className="input" value={settings.youtube} onChange={e => update("youtube", e.target.value)} placeholder="https://youtube.com/..." /></div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn btn-primary flex items-center gap-2">
        <FiSave /> {saving ? "Menyimpan..." : "Simpan Pengaturan"}
      </button>
    </div>
  );
};

export default SettingsManagement;