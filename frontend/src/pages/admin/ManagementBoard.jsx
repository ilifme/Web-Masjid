import { useState, useEffect } from "react";
import { managementService, getImageUrl } from "../../services";
import { FiPlus, FiEdit, FiTrash2, FiImage } from "react-icons/fi";
import Swal from "sweetalert2";

const ManagementBoard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ name: "", position: "", description: "", order: 0 });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const res = await managementService.getAll(); setItems(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("position", formData.position);
    fd.append("description", formData.description);
    fd.append("order", formData.order);
    if (photoFile) fd.append("photo", photoFile);
    try {
      if (editData) { await managementService.update(editData.id, fd); Swal.fire("Berhasil!", "Data berhasil diupdate", "success"); }
      else { await managementService.create(fd); Swal.fire("Berhasil!", "Data berhasil dibuat", "success"); }
      setShowModal(false); resetForm(); fetchItems();
    } catch (err) { Swal.fire("Error", err.response?.data?.message || "Terjadi kesalahan", "error"); }
  };

  const handleEdit = (item) => {
    setEditData(item); setFormData({ name: item.name, position: item.position, description: item.description || "", order: item.order });
    setPhotoPreview(getImageUrl(item.photo)); setShowModal(true);
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: "Hapus?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Ya, Hapus" });
    if (res.isConfirmed) { try { await managementService.delete(id); Swal.fire("Berhasil!", "Data berhasil dihapus", "success"); fetchItems(); } catch (err) { Swal.fire("Error", err.response?.data?.message, "error"); } }
  };

  const resetForm = () => { setEditData(null); setFormData({ name: "", position: "", description: "", order: 0 }); setPhotoFile(null); setPhotoPreview(null); };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengurus DKM</h1><p className="text-gray-600 dark:text-gray-400 mt-2">Kelola struktur organisasi DKM</p></div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary flex items-center gap-2"><FiPlus /><span>Tambah</span></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">Belum ada pengurus</p>}
        {items.map(item => (
          <div key={item.id} className="card card-hover text-center">
            <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 mx-auto mb-4 flex items-center justify-center overflow-hidden">
              {item.photo ? <img src={getImageUrl(item.photo)} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-3xl font-bold text-primary-600">{item.name.charAt(0)}</span>}
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.name}</h3>
            <p className="text-primary-600 font-medium text-sm">{item.position}</p>
            {item.description && <p className="text-xs text-gray-500 mt-2">{item.description}</p>}
            <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-6">{editData ? "Edit" : "Tambah"} Pengurus</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="input" placeholder="Nama Lengkap *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input className="input" placeholder="Jabatan *" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required />
              <textarea className="textarea" rows="3" placeholder="Deskripsi" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="input" placeholder="Urutan" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
                <div className="flex items-center">
                  <input type="file" accept="image/*" className="input" onChange={e => { const f = e.target.files[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); } }} />
                </div>
              </div>
              {photoPreview && <img src={photoPreview} alt="" className="w-20 h-20 rounded-full mx-auto object-cover" />}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">Simpan</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-secondary flex-1">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementBoard;