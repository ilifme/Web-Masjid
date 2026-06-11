import { useState, useEffect } from "react";
import { donationService, getImageUrl } from "../../services";
import { FiPlus, FiEdit, FiTrash2, FiDollarSign } from "react-icons/fi";
import Swal from "sweetalert2";

const DonationManagement = () => {
  const [tab, setTab] = useState("accounts");
  const [accounts, setAccounts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [a, c] = await Promise.all([donationService.getAllAccounts(), donationService.getAllCampaigns()]);
      setAccounts(a.data); setCampaigns(c.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    for (const key in formData) fd.append(key, formData[key]);
    if (file) fd.append(tab === "accounts" ? "qris" : "image", file);
    try {
      if (tab === "accounts") {
        if (editData) { await donationService.updateAccount(editData.id, fd); } else { await donationService.createAccount(fd); }
      } else {
        if (editData) { await donationService.updateCampaign(editData.id, fd); } else { await donationService.createCampaign(fd); }
      }
      Swal.fire("Berhasil!", "Data berhasil disimpan", "success");
      setShowModal(false); resetForm(); fetchData();
    } catch (err) { Swal.fire("Error", err.response?.data?.message || "Terjadi kesalahan", "error"); }
  };

  const handleEdit = (item) => { setEditData(item); setFormData(item); setShowModal(true); };

  const handleDelete = async (id, type) => {
    const res = await Swal.fire({ title: "Hapus?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Ya, Hapus" });
    if (res.isConfirmed) {
      try {
        if (type === "account") await donationService.deleteAccount(id); else await donationService.deleteCampaign(id);
        Swal.fire("Berhasil!", "Data berhasil dihapus", "success"); fetchData();
      } catch (err) { Swal.fire("Error", err.response?.data?.message, "error"); }
    }
  };

  const resetForm = () => { setEditData(null); setFile(null); setFormData({}); };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner w-12 h-12"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Donasi</h1><p className="text-gray-600 dark:text-gray-400 mt-2">Rekening donasi dan campaign</p></div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary flex items-center gap-2"><FiPlus /><span>Tambah</span></button>
      </div>
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
        <button onClick={() => setTab("accounts")} className={"px-4 py-2 rounded-lg text-sm font-medium " + (tab === "accounts" ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm" : "text-gray-500")}>Rekening</button>
        <button onClick={() => setTab("campaigns")} className={"px-4 py-2 rounded-lg text-sm font-medium " + (tab === "campaigns" ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm" : "text-gray-500")}>Campaign</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(tab === "accounts" ? accounts : campaigns).length === 0 && <p className="col-span-full text-center text-gray-500 py-12">Belum ada data</p>}
        {(tab === "accounts" ? accounts : campaigns).map(item => (
          <div key={item.id} className="card card-hover">
            {tab === "accounts" ? (
              <div>
                <div className="flex items-center justify-between mb-4"><FiDollarSign className="w-8 h-8 text-primary-600" /><span className={"px-2 py-1 text-xs rounded-full " + (item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500")}>{item.isActive ? "Aktif" : "Nonaktif"}</span></div>
                {item.qrisImage && <img src={getImageUrl(item.qrisImage)} alt="QRIS" className="w-32 h-32 mx-auto object-contain mb-4" />}
                <h3 className="font-bold text-lg">{item.bankName}</h3>
                <p className="text-2xl font-bold text-primary-600 my-2">{item.accountNumber}</p>
                <p className="text-sm text-gray-500">a.n. {item.accountName}</p>
              </div>
            ) : (
              <div>
                {item.image && <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-4" />}
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2"><div className="bg-primary-500 h-full rounded-full" style={{width: Math.min((item.currentAmount / item.targetAmount) * 100, 100)}}></div></div>
                <p className="text-xs text-gray-500">Rp {parseFloat(item.currentAmount || 0).toLocaleString()} / Rp {parseFloat(item.targetAmount || 0).toLocaleString()}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FiEdit /></button>
              <button onClick={() => handleDelete(item.id, tab === "accounts" ? "account" : "campaign")} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-6">{editData ? "Edit" : "Tambah"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="input" placeholder="Nama Bank / Judul" value={formData.bankName || formData.title || ""} onChange={e => setFormData({...formData, bankName: e.target.value, title: e.target.value})} required />
              {tab === "accounts" && <><input className="input" placeholder="Nomor Rekening" value={formData.accountNumber || ""} onChange={e => setFormData({...formData, accountNumber: e.target.value})} required /><input className="input" placeholder="Atas Nama" value={formData.accountName || ""} onChange={e => setFormData({...formData, accountName: e.target.value})} required /><input type="file" accept="image/*" className="input" onChange={e => setFile(e.target.files[0])} /></>}
              {tab === "campaigns" && <><textarea className="textarea" placeholder="Deskripsi" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} /><input type="number" className="input" placeholder="Target (Rp)" value={formData.targetAmount || ""} onChange={e => setFormData({...formData, targetAmount: e.target.value})} /><input type="number" className="input" placeholder="Terkumpul (Rp)" value={formData.currentAmount || ""} onChange={e => setFormData({...formData, currentAmount: e.target.value})} /><input type="file" accept="image/*" className="input" onChange={e => setFile(e.target.files[0])} /></>}
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

export default DonationManagement;