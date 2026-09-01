import fs from 'node:fs';
const path='android/app/src/main/AndroidManifest.xml';
let xml=fs.readFileSync(path,'utf8');
const perms=[
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_BACKGROUND_LOCATION',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_LOCATION'
];
for(const p of perms){
  if(!xml.includes(p)) xml=xml.replace('<application',`<uses-permission android:name="${p}" />\n    <application`);
}
fs.writeFileSync(path,xml);
console.log('Android permissions patched.');
