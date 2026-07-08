/* =========================================================================
   CONFIGURACIÓN DE FIREBASE
   -------------------------------------------------------------------------
   1. Entra a  console.firebase.google.com  →  tu proyecto
   2. ⚙ Configuración del proyecto → Tus apps → Web (</>)
   3. Copia el objeto firebaseConfig y pégalo en window.FIREBASE_CONFIG.
      IMPORTANTE: la primera línea debe decir  window.FIREBASE_CONFIG = {
      (NO "const firebaseConfig = {").
   ========================================================================= */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBcKTuhb1N5uRvp9c6grI1eZlm-xxsTMGI",
  authDomain: "english-class-6fd4d.firebaseapp.com",
  projectId: "english-class-6fd4d",
  storageBucket: "english-class-6fd4d.firebasestorage.app",
  messagingSenderId: "15293151275",
  appId: "1:15293151275:web:9b5acf012dc7c2a123926e"
};

/* =========================================================================
   CORREOS DE ADMINISTRADOR (solo estos ven el panel para subir material)
   -------------------------------------------------------------------------
   Pon aquí TU correo (el mismo con el que inicias sesión). Los alumnos que
   se registren solo podrán consultar la biblioteca, no editarla.
   Puedes poner varios separados por coma: ["a@x.com", "b@x.com"]
   ========================================================================= */

window.ADMIN_EMAILS = [azulcovar7@gmail.com];
