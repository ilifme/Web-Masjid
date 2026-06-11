import { useState, useEffect } from 'react';
import { bannerService, getImageUrl } from '../../services';
import { FiPlus, FiEdit, FiTrash2, FiImage } from 'react-icons/fi';
import Swal from 'sweetalert2';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    isActive: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await bannerService.getAll();
      setBanners(response.data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editData && !imageFile) {
      Swal.fire('Error', 'Gambar banner harus diupload', 'error');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('ctaText', formData.ctaText);
    data.append('ctaLink', formData.ctaLink);
    data.append('isActive', formData.isActive);
    data.append('order', formData.order);
    if (imageFile) {
      data.append('banner', imageFile);
    }

    try {
      if (editData) {
        await bannerService.update(editData.id, data);
        Swal.fire('Berhasil!', 'Banner berhasil diupdate', 'success');
      } else {
        await bannerService.create(data);
        Swal.fire('Berhasil!', 'Banner berhasil dibuat', 'success');
      }
      setShowModal(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Terjadi kesalahan', 'error');
    }
  };

  const handleEdit = (banner) => {
    setEditData(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      ctaText: banner.ctaText || '',
      ctaLink: banner.ctaLink || '',
      isActive: banner.isActive,
      order: banner.order,
    });
    setImagePreview(getImageUrl(banner.image));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Banner?',
      text: 'Data tidak dapat dikembalikan',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await bannerService.delete(id);
        Swal.fire('Berhasil!', 'Banner berhasil dihapus', 'success');
        fetchBanners();
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Terjadi kesalahan', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditData(null);
    setFormData({
      title: '',
      description: '',
      ctaText: '',
      ctaLink: '',
      isActive: true,
      order: 0,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Banner</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola banner beranda website
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Tambah Banner</span>
        </button>
      </div>

      {/* Banner List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="card card-hover">
            <img
              src={getImageUrl(banner.image)}
              alt={banner.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              {banner.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {banner.description}
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${banner.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
              >
                {banner.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {editData ? 'Edit Banner' : 'Tambah Banner'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="label">Gambar Banner *</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <FiImage className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Klik untuk upload gambar
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="label">Judul *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="label">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="textarea"
                    rows="3"
                  ></textarea>
                </div>

                {/* CTA Text */}
                <div>
                  <label className="label">Teks Tombol CTA</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="input"
                    placeholder="Lihat Selengkapnya"
                  />
                </div>

                {/* CTA Link */}
                <div>
                  <label className="label">Link Tombol CTA</label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="input"
                    placeholder="/kegiatan"
                  />
                </div>

                {/* Order & Active */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Urutan</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select
                      value={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                      className="input"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Nonaktif</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editData ? 'Update' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn btn-secondary flex-1"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;

