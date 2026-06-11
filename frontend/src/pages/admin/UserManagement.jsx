import { useState, useEffect } from "react";
import { userService } from "../../services";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiMail } from "react-icons/fi";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", fullName: "", role: "editor", isActive: true
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAll({ search, limit: 50 });
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editData && !formData.password) {
      Swal.fire({ title: "Error!", text: "Password harus diisi", icon: "error", confirmButtonColor: "#10b981" });
      return;
    }
    try {
      if (editData) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await userService.update(editData.id, payload);
        Swal.fire("Berhasil!", "User berhasil diupdate", "success");
      } else {
        await userService.create(formData);
        Swal.fire("Berhasil!", "User berhasil dibuat", "success");
      }
      setShowModal(false); resetForm(); fetchUsers();
    } catch (err) {
      Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message || "Terjadi kesalahan", icon: "error", confirmButtonColor: "#10b981" });
    }
  };

  const handleEdit = (u) => {
    setEditData(u);
    setFormData({
      username: u.username, email: u.email, password: "",
      fullName: u.fullName, role: u.role, isActive: u.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus User?", text: "Data tidak dapat dikembalikan", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus", cancelButtonText: "Batal"
    });
    if (result.isConfirmed) {
      try { await userService.delete(id); Swal.fire("Berhasil!", "User berhasil dihapus", "success"); fetchUsers(); }
      catch (err) { Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message, icon: "error", confirmButtonColor: "#10b981" }); }
    }
  };

  const resetForm = () => {
    setEditData(null);
    setFormData({ username: "", email: "", password: "", fullName: "", role: "editor", isActive: true });
  };

  const roleBadge = (role) => {
    const colors = {
      super_admin: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      admin: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      editor: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    };
    const labels = { super_admin: "Super Admin", admin: "Admin", editor: "Editor" };
    return <span className={"px-2 py-1 text-xs rounded-full font-medium " + (colors[role] || colors.editor)}>{labels[role] || role}</span>;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola User</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Tambah, edit, dan hapus user admin</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary flex items-center gap-2">
          <FiPlus /><span>Tambah User</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari user..." className="input pl-10" />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">User</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Email</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Role</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan="5" className="py-8 text-center text-gray-500">Belum ada user</td></tr>
            )}
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">{u.fullName?.charAt(0) || "U"}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{u.fullName}</p>
                      <p className="text-xs text-gray-500">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <FiMail className="w-3 h-3" /> {u.email}
                  </span>
                </td>
                <td className="py-4">{roleBadge(u.role)}</td>
                <td className="py-4">
                  <span className={"px-2 py-1 text-xs rounded-full " + (u.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
                    {u.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(u)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FiEdit /></button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-6">{editData ? "Edit User" : "Tambah User"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Username *</label>
                  <input type="text" className="input" value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Nama Lengkap *</label>
                  <input type="text" className="input" value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" className="input" value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                <label className="label">{editData ? "Password (kosongkan jika tidak diubah)" : "Password *"}</label>
                <input type="password" className="input" value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required={!editData} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Role</label>
                  <select className="input" value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.value === "true"})}>
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
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

export default UserManagement;