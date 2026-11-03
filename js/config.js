/* ============================================================
   Rotary Club of Bhatagram — site configuration
   Edit ONLY this file to connect the live backend.
   While firebase.apiKey is empty, the site runs in DEMO MODE
   (sample content, data saved only in your own browser).
   ============================================================ */
window.RC_CONFIG = {
  club: {
    name: "Rotary Club of Bhatagram",
    district: "3170",
    place: "Bicholim, Goa",
    email: "",          // e.g. "contact@yourdomain.in"
    phone: "",          // e.g. "+91 98xxxxxxx"
    whatsapp: ""        // digits only with country code, e.g. "9198xxxxxxxx"
  },

  // Firebase → Project settings → Your apps → Web app → config
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },

  // Cloudinary → Settings → Upload → Upload presets → add UNSIGNED preset
  cloudinary: {
    cloudName: "",
    uploadPreset: ""
  }
};
