const axios = require('axios');
const { PrayerTime } = require('../models');
const config = require('../config');

const prayerTimeController = {
  // Get prayer time settings
  getSettings: async (req, res) => {
    try {
      const settings = await PrayerTime.findOne();
      
      if (!settings) {
        return res.status(404).json({
          success: false,
          message: 'Pengaturan waktu sholat tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update prayer time settings
  updateSettings: async (req, res) => {
    try {
      const { city, country, latitude, longitude, method, timezone } = req.body;
      
      let settings = await PrayerTime.findOne();
      
      if (!settings) {
        settings = await PrayerTime.create({
          city,
          country,
          latitude,
          longitude,
          method,
          timezone,
        });
      } else {
        await settings.update({
          city: city || settings.city,
          country: country || settings.country,
          latitude: latitude !== undefined ? latitude : settings.latitude,
          longitude: longitude !== undefined ? longitude : settings.longitude,
          method: method !== undefined ? method : settings.method,
          timezone: timezone || settings.timezone,
        });
      }
      
      res.json({
        success: true,
        message: 'Pengaturan waktu sholat berhasil diupdate',
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get today's prayer times
  getToday: async (req, res) => {
    try {
      const settings = await PrayerTime.findOne();
      
      if (!settings) {
        return res.status(404).json({
          success: false,
          message: 'Pengaturan waktu sholat tidak ditemukan. Silakan konfigurasi terlebih dahulu.',
        });
      }
      
      const today = new Date();
      const date = ${today.getDate()}--;
      
      const response = await axios.get(${config.prayerTimeApi}/, {
        params: {
          city: settings.city,
          country: settings.country,
          method: settings.method,
        },
      });
      
      if (response.data.code !== 200) {
        throw new Error('Gagal mendapatkan data waktu sholat');
      }
      
      const timings = response.data.data.timings;
      
      res.json({
        success: true,
        data: {
          date: response.data.data.date.readable,
          hijri: response.data.data.date.hijri,
          timings: {
            fajr: timings.Fajr,
            sunrise: timings.Sunrise,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
          },
          location: {
            city: settings.city,
            country: settings.country,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil waktu sholat',
        error: error.message,
      });
    }
  },
  
  // Get monthly prayer times
  getMonthly: async (req, res) => {
    try {
      const settings = await PrayerTime.findOne();
      
      if (!settings) {
        return res.status(404).json({
          success: false,
          message: 'Pengaturan waktu sholat tidak ditemukan',
        });
      }
      
      const { month, year } = req.query;
      const currentDate = new Date();
      const targetMonth = month || currentDate.getMonth() + 1;
      const targetYear = year || currentDate.getFullYear();
      
      const response = await axios.get(
        https://api.aladhan.com/v1/calendarByCity//,
        {
          params: {
            city: settings.city,
            country: settings.country,
            method: settings.method,
          },
        }
      );
      
      if (response.data.code !== 200) {
        throw new Error('Gagal mendapatkan data waktu sholat');
      }
      
      const calendar = response.data.data.map(day => ({
        date: day.date.readable,
        hijri: day.date.hijri,
        timings: {
          fajr: day.timings.Fajr,
          sunrise: day.timings.Sunrise,
          dhuhr: day.timings.Dhuhr,
          asr: day.timings.Asr,
          maghrib: day.timings.Maghrib,
          isha: day.timings.Isha,
        },
      }));
      
      res.json({
        success: true,
        data: {
          month: targetMonth,
          year: targetYear,
          calendar,
          location: {
            city: settings.city,
            country: settings.country,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil waktu sholat',
        error: error.message,
      });
    }
  },
};

module.exports = prayerTimeController;
