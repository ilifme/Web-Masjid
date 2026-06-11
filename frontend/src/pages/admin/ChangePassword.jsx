import { useState } from "react";
import { authService } from "../../services";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";

const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({ title: "Error!", text: "Password baru tidak cocok", icon: "error", confirmButtonColor: "#10b981" });
      return;
    }
    if (formData.newPassword.length < 6) {
      Swal.fire({ title: "Error!", text: "Password minimal 6 karakter", icon: "error", confirmButtonColor: "#10b981" });
      return;
    }
    setSaving(true);
    try {
      await authService.changePassword(formData.oldPassword, formData.newPassword);
      Swal.fire("Berhasil!", "Password berhasil diubah", "success");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message || "Terjadi kesalahan", icon: "error", confirmButtonColor: "#10b981" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ganti Password</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Ubah password akun admin Anda</p>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label">Password Lama</label>
          <div className="relative">
            <input type={showOld ? "text" : "password"} className="input pr-10" value={formData.oldPassword}
              onChange={e => setFormData({...formData, oldPassword: e.target.value})} required />
            <button type="button" onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showOld ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">Password Baru</label>
          <div className="relative">
            <input type={showNew ? "text" : "password"} className="input pr-10" value={formData.newPassword}
              onChange={e => setFormData({...formData, newPassword: e.target.value})} required />
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showNew ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">Konfirmasi Password Baru</label>
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} className="input pr-10" value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary w-full">
          <FiLock className="mr-2" /> {saving ? "Menyimpan..." : "Ganti Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
