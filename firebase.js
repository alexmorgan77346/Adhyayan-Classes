/* ============================================================
   ADHYAYAN CLASSES — firebase.js
   Firebase initialization (ES Module)
   ============================================================ */

import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyAYHD-U_LqBjauCdnryCdlVdy3ZcgsVz4c",
  authDomain:        "dairy-6a448.firebaseapp.com",
  databaseURL:       "https://dairy-6a448-default-rtdb.firebaseio.com",
  projectId:         "dairy-6a448",
  storageBucket:     "dairy-6a448.firebasestorage.app",
  messagingSenderId: "294131094705",
  appId:             "1:294131094705:web:a8efdd2bdb136c57a3be90",
  measurementId:     "G-2DMB0FM3CJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
