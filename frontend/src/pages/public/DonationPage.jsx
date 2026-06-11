import { useState, useEffect } from "react";
import Navbar from "../../components/public/Navbar";
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from "../../components/public/Footer";
import { donationService, getImageUrl } from "../../services";
import { FiDollarSign, FiTarget, FiCalendar, FiCopy, FiCheck, FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";

const DonationPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsRes, campaignsRes] = await Promise.all([
        donationService.getActiveAccounts(),
        donationService.getActiveCampaigns(),
      ]);
      setAccounts(accountsRes.data || []);
      setCampaigns(campaignsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Breadcrumb items={[{ label: "Donasi" }]} />
        <div className="pt-36 flex items-center justify-center h-64">
          <div className="spinner w-16 h-16"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Breadcrumb items={[{ label: "Donasi" }]} />
      <div className="pt-36">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Donasi
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Salurkan donasi terbaik Anda melalui masjid kami. Setiap rupiah yang Anda berikan akan digunakan untuk kemaslahatan umat.
            </p>
          </motion.div>

          {/* Campaigns Section */}
          {campaigns.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Campaign Donasi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {campaigns.map((campaign, index) => {
                  const progress = campaign.targetAmount > 0
                    ? Math.min(100, (campaign.currentAmount / campaign.targetAmount) * 100)
                    : 0;
                  return (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card overflow-hidden"
                    >
                      {campaign.image && (
                        <img
                          src={getImageUrl(campaign.image)}
                          alt={campaign.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {campaign.title}
                      </h3>
                      {campaign.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                          {campaign.description}
                        </p>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-primary-600">
                            Terkumpul: {formatCurrency(campaign.currentAmount)}
                          </span>
                          <span className="text-gray-500">
                            Target: {formatCurrency(campaign.targetAmount)}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000"
                            style={{ width: progress + "%" }}
                          ></div>
                        </div>
                        <p className="text-right text-xs text-gray-500 mt-1">
                          {Math.round(progress)}%
                        </p>
                      </div>

                      {campaign.endDate && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiCalendar className="mr-2" />
                          Berakhir: {new Date(campaign.endDate).toLocaleDateString("id-ID", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* QRIS Section */}
          {accounts.filter(a => a.qrisImage).length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Scan QRIS
              </h2>
              <div className="max-w-md mx-auto">
                {accounts.filter(a => a.qrisImage).map((account) => (
                  <div
                    key={account.id}
                    className="card text-center cursor-pointer hover:shadow-2xl transition-all"
                    onClick={() => setSelectedAccount(
                      selectedAccount?.id === account.id ? null : account
                    )}
                  >
                    <img
                      src={getImageUrl(account.qrisImage)}
                      alt={"QRIS " + account.accountName}
                      className={"mx-auto rounded-xl transition-all " + (
                        selectedAccount?.id === account.id ? "w-full max-w-sm" : "w-48 h-48 object-contain"
                      )}
                    />
                    {selectedAccount?.id === account.id && (
                      <div className="mt-4 text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {account.accountName}
                        </p>
                        <p className="text-sm text-gray-500">{account.bankName}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bank Transfer Section */}
          {accounts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Transfer Bank
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {accounts.map((account, index) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card card-hover"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <FiDollarSign className="w-7 h-7 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {account.bankName}
                        </h3>
                        <p className="text-sm text-gray-500">{account.accountName}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
                      <p className="text-xs text-gray-500 mb-1">No. Rekening</p>
                      <p className="text-2xl font-bold text-primary-600 font-mono tracking-wider">
                        {account.accountNumber}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(account.accountNumber, account.id)}
                      className={"w-full btn transition-all " + (
                        copiedId === account.id
                          ? "bg-green-500 text-white"
                          : "btn-primary"
                      )}
                    >
                      {copiedId === account.id ? (
                        <>
                          <FiCheck className="mr-2" /> Tersalin!
                        </>
                      ) : (
                        <>
                          <FiCopy className="mr-2" /> Salin No. Rekening
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {accounts.length === 0 && campaigns.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Belum ada informasi donasi
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DonationPage;
