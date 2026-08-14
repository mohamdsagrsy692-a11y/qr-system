const firebaseConfig = {
  apiKey: "AIzaSyDAXHBPfJUr2quRe_80yhEDqGrHaneNmcc",
  authDomain: "qr-system-45702.firebaseapp.com",
  databaseURL: "https://qr-system-45702-default-rtdb.firebaseio.com",
  projectId: "qr-system-45702",
  storageBucket: "qr-system-45702.firebasestorage.app",
  messagingSenderId: "983573164670",
  appId: "1:983573164670:web:4b352977dd6085b0649e2f"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

let qrCode = null;
let uploadedLogo = "";

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("logoUpload");

  if (el) {
    el.addEventListener("change", (e) => {
      const f = e.target.files[0];

      if (!f) return;

      const r = new FileReader();

      r.onload = (ev) => {
        uploadedLogo = ev.target.result;

        const preview = document.getElementById("logoPreview");

        if (preview) {
          preview.src = uploadedLogo;
          preview.style.display = "block";
        }

        if (typeof createQR === "function") {
          createQR();
        }
      };

      r.readAsDataURL(f);
    });
  }
});
