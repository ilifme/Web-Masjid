import { useState, useEffect } from "react";
import { galleryService, getImageUrl } from "../../services";
import { FiPlus, FiTrash2, FiImage, FiVideo } from "react-icons/fi";
import Swal from "sweetalert2";

const GalleryManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", type: "photo", category: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const res = await galleryService.getAll({ limit: 50 }); setItems(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { Swal.fire("Error", "File harus diupload", "error"); return; }
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("type", formData.type);
    fd.append("category", formData.category);
    fd.append("gallery", file);
    try {
      await galleryService.create(fd);
      Swal.fire("Berhasil!", "Galeri berhasil ditambahkan", "success");
      setShowModal(false);
      setFormData({ title: "", description: "", type: "photo", category: "" });
      setFile(null); setPreview(null);
      fetchItems();
    } catch (err) { Swal.fire("Error", err.response?.data?.message || "Terjadi kesalahan", "error"); }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Hapus?", text: "Data tidak dapat dikembalikan", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonColor: "#6b7280", confirmButtonText: "Ya, Hapus", cancelButtonText: "Batal" });
    if (result.isConfirmed) { try { await galleryService.delete(id); Swal.fire("Berhasil!", "Galeri berhasil dihapus", "success"); fetchItems(); } catch (err) { Swal.fire("Error", err.response?.data?.message || "Terjadi kesalahan", "error"); } }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Galeri</h1><p className="text-gray-600 dark:text-gray-400 mt-2">Upload foto dan video kegiatan</p></div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center space-x-2"><FiPlus /><span>Tambah Galeri</span></button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">Belum ada galeri</p>}
        {items.map(item => (
          <div key={item.id} className="card card-hover relative group">
            {item.type === "video" ? (
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3"><FiVideo className="w-10 h-10 text-gray-400" /></div>
            ) : (
              <img src={getImageUrl(item.url)} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-3" />
            )}
            <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">{item.title}</h3>
            <span className="text-xs text-gray-500">{item.type === "video" ? "Video" : "Foto"}{item.category ? " - " + item.category : ""}</span>
            <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><FiTrash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Tambah Galeri</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Judul *</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Tipe</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input"><option value="photo">Foto</option><option value="video">Video</option></select></div>
                <div><label className="label">Kategori</label><input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input" /></div>
              </div>
              <div>
                <label className="label">File *</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer" onClick={() => document.getElementById("fileInput").click()}>
                  {preview ? <img src={preview} alt="" className="max-h-40 mx-auto rounded-lg" /> : <div><FiImage className="w-12 h-12 mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-500">Klik untuk upload</p></div>}
                </div>
                <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
              <div><label className="label">Deskripsi</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="textarea" rows="3" /></div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">Simpan</button>
                <button type="button" onClick={() => { setShowModal(false); setFormData({ title: "", description: "", type: "photo", category: "" }); setFile(null); setPreview(null); }} className="btn btn-secondary flex-1">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;