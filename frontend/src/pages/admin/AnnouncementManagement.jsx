import { useState, useEffect } from "react";
import { announcementService } from "../../services";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

const AnnouncementManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "", type: "running_text", priority: 0, isActive: true });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const res = await announcementService.getAll({ limit: 50 }); setItems(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) { await announcementService.update(editData.id, formData); Swal.fire("Berhasil!", "Pengumuman berhasil diupdate", "success"); }
      else { await announcementService.create(formData); Swal.fire("Berhasil!", "Pengumuman berhasil dibuat", "success"); }
      setShowModal(false); setFormData({ title: "", content: "", type: "running_text", priority: 0, isActive: true }); setEditData(null); fetchItems();
    } catch (err) { Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message || "Terjadi kesalahan", icon: "error", confirmButtonColor: "#10b981" }); }
  };

  const handleEdit = (item) => { setEditData(item); setFormData(item); setShowModal(true); };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: "Hapus?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Ya, Hapus" });
    if (res.isConfirmed) { try { await announcementService.delete(id); Swal.fire("Berhasil!", "Pengumuman berhasil dihapus", "success"); fetchItems(); } catch (err) { Swal.fire("Error", err.response?.data?.message, "error"); } }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Pengumuman</h1><p className="text-gray-600 dark:text-gray-400 mt-2">Running text, popup, dan banner pengumuman</p></div>
        <button onClick={() => { setEditData(null); setFormData({ title: "", content: "", type: "running_text", priority: 0, isActive: true }); setShowModal(true); }} className="btn btn-primary flex items-center gap-2"><FiPlus /><span>Tambah</span></button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && <p className="text-center text-gray-500 py-12">Belum ada pengumuman</p>}
        {items.map(item => (
          <div key={item.id} className="card flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={"px-2 py-1 text-xs rounded-full " + (item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500")}>{item.isActive ? "Aktif" : "Nonaktif"}</span>
                <span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs rounded-full">{item.type === "running_text" ? "Running Text" : item.type === "popup" ? "Popup" : "Banner"}</span>
                <span className="text-xs text-gray-400">Priority: {item.priority}</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.content}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-6">{editData ? "Edit" : "Tambah"} Pengumuman</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="input" placeholder="Judul" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <textarea className="textarea" rows="3" placeholder="Isi pengumuman" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <select className="input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}><option value="running_text">Running Text</option><option value="popup">Popup</option><option value="banner">Banner</option></select>
                <input type="number" className="input" placeholder="Priority" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} />
              </div>
              <select className="input" value={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.value === "true"})}><option value="true">Aktif</option><option value="false">Nonaktif</option></select>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">Simpan</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManagement;