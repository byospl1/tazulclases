# English Class · Biblioteca virtual

Sitio web de la biblioteca de inglés de **Teacher Azul Covarrubias**.
Material por materia (PDFs, audios, vídeos de YouTube y documentos), con panel
de administración. Hecho para funcionar **gratis** en GitHub Pages + Firebase.

## Archivos

| Archivo        | Para qué sirve |
|----------------|----------------|
| `index.html`   | La página. No necesitas editarla. |
| `styles.css`   | Los estilos (colores, tipografías, tarjetas). |
| `app.js`       | La lógica: materias, recursos, login, agregar/eliminar. |
| `config.js`    | **Aquí pegas tu configuración de Firebase.** |
| `.nojekyll`    | Le dice a GitHub Pages que no procese los archivos. Déjalo tal cual. |

## Puesta en marcha (resumen)

1. **Firebase** → crea un proyecto, activa **Firestore** y **Authentication**
   (Correo/contraseña). Crea tu usuaria admin. Copia el objeto `firebaseConfig`
   y pégalo en `config.js`.
2. **Reglas de Firestore** (lectura pública, escritura con sesión):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /recursos/{doc} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **GitHub Pages** → sube estos archivos a un repositorio y actívalo en
   *Settings → Pages* (rama `main`, carpeta `/root`).

> **Modo demo:** mientras no pegues tu configuración en `config.js`, la página
> funciona con material de ejemplo y podrás entrar al panel escribiendo
> cualquier cosa. Al conectar Firebase, todo se guarda de verdad.

La guía detallada paso a paso está en el documento **“Guía de puesta en marcha”**.

## Estructura de cada recurso en Firestore (colección `recursos`)

```
titulo:      "Present Perfect: guía completa"
materia:     "grammar"   // grammar · vocab · reading · listening · speaking · writing
tipo:        "PDF"       // PDF · Audio · Video · Doc
enlace:      "https://drive.google.com/.../preview"
descargable: true
fecha:       "2026-07-07"
```
