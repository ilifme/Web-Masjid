import { useState, useEffect } from "react";
import { articleService, getImageUrl } from "../../services";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiImage } from "react-icons/fi";
import Swal from "sweetalert2";

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    title: "", content: "", excerpt: "", category: "", tags: "", status: "draft"
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    try {
      const res = await articleService.getAll({ search, limit: 50 });
      setArticles(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setThumbnailFile(file); setThumbnailPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("content", formData.content);
    fd.append("excerpt", formData.excerpt);
    fd.append("category", formData.category);
    fd.append("tags", formData.tags);
    fd.append("status", formData.status);
    if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
    try {
      if (editData) {
        await articleService.update(editData.id, fd);
        Swal.fire("Berhasil!", "Artikel berhasil diupdate", "success");
      } else {
        await articleService.create(fd);
        Swal.fire("Berhasil!", "Artikel berhasil dibuat", "success");
      }
      setShowModal(false); resetForm(); fetchArticles();
    } catch (err) {
      Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message || "Terjadi kesalahan", icon: "error", confirmButtonColor: "#10b981" });
    }
  };

  const handleEdit = (a) => {
    setEditData(a);
    setFormData({ title: a.title, content: a.content, excerpt: a.excerpt || "", category: a.category || "", tags: a.tags || "", status: a.status });
    setThumbnailPreview(getImageUrl(a.thumbnail));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Hapus Artikel?", text: "Data tidak dapat dikembalikan", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonColor: "#6b7280", confirmButtonText: "Ya, Hapus", cancelButtonText: "Batal" });
    if (result.isConfirmed) {
      try { await articleService.delete(id); Swal.fire("Berhasil!", "Artikel berhasil dihapus", "success"); fetchArticles(); }
      catch (err) { Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message || "Terjadi kesalahan", icon: "error", confirmButtonColor: "#10b981" }); }
    }
  };

  const resetForm = () => {
    setEditData(null);
    setFormData({ title: "", content: "", excerpt: "", category: "", tags: "", status: "draft" });
    setThumbnailFile(null); setThumbnailPreview(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Artikel</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Tambah, edit, dan hapus artikel</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary flex items-center space-x-2">
          <FiPlus /><span>Tambah Artikel</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari artikel..." className="input pl-10" />
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Judul</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Kategori</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Dilihat</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 && (
              <tr><td colSpan="5" className="pt-6 text-center text-gray-500">Belum ada artikel</td></tr>
            )}
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    {a.thumbnail && <img src={getImageUrl(a.thumbnail)} alt="" className="w-12 h-12 object-cover rounded-lg" />}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{a.title}</p>
                      <p className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4"><span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full">{a.category || "-"}</span></td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${a.status === "published" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"}`}>
                    {a.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-4"><span className="flex items-center text-gray-500"><FiEye className="mr-1" />{a.views || 0}</span></td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(a)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FiEdit /></button>
                    <button onClick={() => handleDelete(a.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{editData ? "Edit Artikel" : "Tambah Artikel"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Judul *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Kategori</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input" placeholder="Berita, Kajian, dll" />
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="input">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div><label className="label">Thumbnail</label><div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
    {thumbnailPreview ? (
      <div className="relative">
        <img src={thumbnailPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
        <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
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
                <div>
                  <label className="label">Ringkasan (Excerpt)</label>
                  <textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="textarea" rows="3" />
                </div>
                <div>
                  <label className="label">Konten *</label>
                  <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="textarea" rows="10" required placeholder="Tulis konten artikel di sini..." />
                </div>
                <div>
                  <label className="label">Tags (pisahkan dengan koma)</label>
                  <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="input" placeholder="islam, kajian, ramadhan" />
                </div>
                <div className="flex items-center space-x-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">{editData ? "Update" : "Simpan"}</button>
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-secondary flex-1">Batal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManagement;