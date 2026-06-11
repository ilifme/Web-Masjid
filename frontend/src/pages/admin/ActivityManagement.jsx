import { useState, useEffect } from "react";
import { activityService, getImageUrl } from "../../services";
import { FiPlus, FiEdit, FiTrash2, FiImage } from "react-icons/fi";
import Swal from "sweetalert2";

const categories = ["kajian", "sosial", "pendidikan", "ramadhan", "lainnya"];

const ActivityManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", category: "kajian", schedule: "", location: "", contactPerson: "", contactNumber: "", isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const res = await activityService.getAll({ limit: 50 }); setItems(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(formData).forEach(k => fd.append(k, formData[k]));
    if (imageFile) fd.append("image", imageFile);
    try {
      if (editData) { await activityService.update(editData.id, fd); Swal.fire("Berhasil!", "Kegiatan berhasil diupdate", "success"); }
      else { await activityService.create(fd); Swal.fire("Berhasil!", "Kegiatan berhasil dibuat", "success"); }
      setShowModal(false); resetForm(); fetchItems();
    } catch (err) { Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message || "Terjadi kesalahan", icon: "error", confirmButtonColor: "#10b981" }); }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setFormData({ title: item.title, description: item.description, category: item.category, schedule: item.schedule || "", location: item.location || "", contactPerson: item.contactPerson || "", contactNumber: item.contactNumber || "", isActive: item.isActive });
    setImagePreview(getImageUrl(item.image));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Hapus Kegiatan?", text: "Data tidak dapat dikembalikan", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonColor: "#6b7280", confirmButtonText: "Ya, Hapus", cancelButtonText: "Batal" });
    if (result.isConfirmed) { try { await activityService.delete(id); Swal.fire("Berhasil!", "Kegiatan berhasil dihapus", "success"); fetchItems(); } catch (err) { Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message || "Terjadi kesalahan", icon: "error", confirmButtonColor: "#10b981" }); } }
  };

  const resetForm = () => {
    setEditData(null);
    setFormData({ title: "", description: "", category: "kajian", schedule: "", location: "", contactPerson: "", contactNumber: "", isActive: true });
    setImageFile(null); setImagePreview(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Kegiatan</h1><p className="text-gray-600 dark:text-gray-400 mt-2">Tambah, edit, dan hapus kegiatan masjid</p></div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary flex items-center space-x-2"><FiPlus /><span>Tambah Kegiatan</span></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">Belum ada kegiatan</p>}
        {items.map(item => (
          <div key={item.id} className="card card-hover">
            {item.image && <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-4" />}
            <span className={"inline-block px-3 py-1 text-xs rounded-full mb-3 " + (item.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-700 text-gray-500")}>{item.isActive ? "Aktif" : "Nonaktif"}</span>
            <span className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full mb-2 ml-2">{item.category}</span>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
            {item.schedule && <p className="text-xs text-gray-500 mb-3">Jadwal: {item.schedule}</p>}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FiEdit /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">{editData ? "Edit Kegiatan" : "Tambah Kegiatan"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Judul *</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Kategori</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input">{categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}</select></div>
                <div><label className="label">Status</label><select value={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.value === "true"})} className="input"><option value="true">Aktif</option><option value="false">Nonaktif</option></select></div>
              </div>
              <div><label className="label">Gambar</label><div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
    {imagePreview ? (
      <div className="relative">
        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
        <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          <FiTrash2 />
        </button>
      </div>
    ) : (
      <label className="flex flex-col items-center cursor-pointer">
        <FiImage className="w-12 h-12 text-gray-400 mb-2" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Klik untuk upload gambar</span>
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </label>
    )}
  </div></div>
              <div><label className="label">Deskripsi *</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="textarea" rows="4" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Jadwal</label><input type="text" value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} className="input" placeholder="Setiap Minggu, 19:00 WIB" /></div>
                <div><label className="label">Lokasi</label><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input" placeholder="Masjid Quba" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Kontak Person</label><input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="input" /></div>
                <div><label className="label">No. Kontak</label><input type="text" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="input" /></div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">{editData ? "Update" : "Simpan"}</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-secondary flex-1">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityManagement;