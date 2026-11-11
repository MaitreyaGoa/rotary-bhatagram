/* ============================================================
   Rotary Club of Bhatagram: site configuration
   Edit ONLY this file to connect the backend.
   These Firebase web keys are meant to be public; the data is
   protected by the Firestore security rules, not by hiding keys.
   ============================================================ */
window.RC_CONFIG = {
  club: {
    name: "Rotary Club of Bhatagram",
    district: "3170",
    place: "Bicholim, Goa",
    email: "",          // public contact email (optional)
    phone: "",          // e.g. "+91 98xxxxxxx"
    whatsapp: ""        // digits only with country code, e.g. "9198xxxxxxxx"
  },

  firebase: {
    apiKey: "AIzaSyCiOzef5M5gWjKhciGsNtceF2p37FMiSPY",
    authDomain: "rotary-bhatagram.firebaseapp.com",
    projectId: "rotary-bhatagram",
    storageBucket: "rotary-bhatagram.firebasestorage.app",
    messagingSenderId: "860150869602",
    appId: "1:860150869602:web:3b75085f36d52515c3ab3b"
  },

  // Cloudinary → Settings → Upload → Upload presets → UNSIGNED preset.
  // Until these are filled, photos are compressed and stored directly in
  // the database (fine for a few dozen photos).
  cloudinary: {
    cloudName: "",
    uploadPreset: ""
  }
};
