import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { BackgroundGeolocation } from '@capgo/background-geolocation';

let lastPosition = null;
let context = { store: '', visitId: '' };
let trackingBase = null;

function normalizeLocation(location) {
  if (!location) return null;
  return {
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
    accuracy: Number(location.accuracy || 0),
    altitude: location.altitude ?? null,
    altitudeAccuracy: location.altitudeAccuracy ?? null,
    speed: location.speed ?? null,
    bearing: location.bearing ?? null,
    simulated: Boolean(location.simulated),
    time: location.time ?? Date.now(),
  };
}

function headers() {
  if (!trackingBase) return {};
  return {
    'X-RI-Tracking-Token': String(trackingBase.trackingToken || ''),
    'X-RI-Shift-Id': String(trackingBase.shiftId || ''),
    'X-RI-Seller-Code': String(trackingBase.sellerCode || ''),
    'X-RI-Seller-Name': String(trackingBase.sellerName || ''),
    'X-RI-Device-Id': String(trackingBase.deviceId || ''),
    'X-RI-Store': String(context.store || ''),
    'X-RI-Visit-Id': String(context.visitId || ''),
  };
}

async function start(opts) {
  if (!Capacitor.isNativePlatform()) return false;
  trackingBase = { ...opts };
  await BackgroundGeolocation.start(
    {
      backgroundTitle: 'Reposição Inteligente',
      backgroundMessage: 'Expediente ativo — localização sendo registrada.',
      requestPermissions: true,
      stale: false,
      distanceFilter: Number(opts.distanceFilter ?? 0),
      minIntervalMs: Number(opts.minIntervalMs ?? 15000),
      url: String(opts.url),
      headers: headers(),
    },
    (location, error) => {
      if (error) {
        window.dispatchEvent(new CustomEvent('ri-native-tracking-error', { detail: { message: error.message, code: error.code || null } }));
        return;
      }
      const p = normalizeLocation(location);
      if (!p) return;
      lastPosition = p;
      window.dispatchEvent(new CustomEvent('ri-native-location', { detail: p }));
    }
  );
  return true;
}

async function stop() {
  if (!Capacitor.isNativePlatform()) return;
  await BackgroundGeolocation.stop();
  trackingBase = null;
  context = { store: '', visitId: '' };
}

async function updateContext(next = {}) {
  context = { ...context, ...next };
  if (Capacitor.isNativePlatform() && trackingBase) {
    await BackgroundGeolocation.updateHeaders({ headers: headers() });
  }
}

async function getCurrentPosition() {
  if (!Capacitor.isNativePlatform()) throw new Error('Native GPS unavailable');
  const p = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 });
  const coords = p.coords || {};
  const out = {
    lat: Number(coords.latitude),
    lon: Number(coords.longitude),
    accuracy: Number(coords.accuracy || 0),
    speed: coords.speed ?? null,
    heading: coords.heading ?? null,
  };
  lastPosition = {
    latitude: out.lat, longitude: out.lon, accuracy: out.accuracy,
    speed: out.speed, bearing: out.heading, simulated: false, time: p.timestamp || Date.now()
  };
  return out;
}

async function deviceInfo() {
  if (!Capacitor.isNativePlatform()) return { platform: 'web', appVersion: 'web' };
  const info = await Device.getInfo();
  return { platform: info.platform || Capacitor.getPlatform(), appVersion: '6.0.0', model: info.model || '', osVersion: info.osVersion || '' };
}

async function checkPermissions() {
  if (!Capacitor.isNativePlatform()) return { native: false };
  const [background, foreground] = await Promise.all([
    BackgroundGeolocation.checkPermissions(),
    Geolocation.checkPermissions(),
  ]);
  return { native: true, background, foreground };
}

async function rehydrate(opts) {
  trackingBase = { ...opts };
  if (Capacitor.isNativePlatform()) {
    try { await BackgroundGeolocation.updateHeaders({ headers: headers() }); } catch {}
  }
  return true;
}

window.NativeTracking = {
  isNative: Capacitor.isNativePlatform(),
  start,
  stop,
  updateContext,
  getCurrentPosition,
  getLastPosition: () => lastPosition,
  deviceInfo,
  checkPermissions,
  rehydrate,
  openSettings: () => BackgroundGeolocation.openSettings(),
};
