# HYDRONEXIS

Plataforma web de hidroponía (HTML, CSS y JavaScript) con Firebase, Supabase Storage y **NEXIS**, un asistente con IA (Python + Gemini).

- Sitio publicado: https://jmmm11.github.io/Hydronexis/ (GitHub Pages, sirve la raíz de `main`)
- Backend de NEXIS: https://hydronexis-chatbot.onrender.com (Render)

## Estructura

```
/                     Raíz del sitio web (GitHub Pages la publica tal cual)
├── index.html        Página de inicio
├── *.html            Resto de páginas (login, marketplace, dashboard, ...)
├── components/       Fragmentos HTML compartidos (header.html, cargado por js/header.js)
├── css/              Estilos
├── js/               Lógica del frontend (módulos ES, Firebase, carrito, NEXIS en chat.js)
├── images/           Imágenes y vídeos
├── fonts/            Tipografías
├── Documents/        Manual de usuario (PDF)
├── backend/          NEXIS: servidor Flask que habla con Gemini
│   ├── gemini_back_end.py
│   ├── requirements.txt
│   ├── test_gemini_back_end.py
│   └── .env.example  Plantilla de variables (copiar a .env)
├── firebase/         Reglas de seguridad de Firestore y Storage
├── supabase/         SQL de configuración del bucket de imágenes
├── firebase.json     Configuración de Firebase CLI (apunta a firebase/)
└── .firebaserc       Proyecto de Firebase (hydronexis-ch)
```

Las páginas `.html` están en la raíz a propósito: GitHub Pages solo publica la raíz o `/docs`, y todas las rutas relativas (`css/`, `js/`, `images/`, enlaces entre páginas y la cabecera inyectada) dependen de ello.

## Cómo funciona NEXIS

```
Navegador (js/chat.js) --POST /chat {prompt}--> backend Flask (backend/) --API--> Google Gemini
                       <-- {response} o {error} --
```

- En local (`localhost` / `127.0.0.1`) el frontend llama a `http://127.0.0.1:5000/chat`.
- Publicado, llama a `https://hydronexis-chatbot.onrender.com/chat`.
- La clave de Gemini vive **solo** en el backend (variable `GEMINI_API_KEY`). Nunca en el frontend.

## Requisitos

- Python 3.10 o superior
- Un navegador y, opcional, la extensión Live Server de VS Code (puerto 5501, ya configurado en `.vscode/settings.json`)
- Una clave de Gemini: https://aistudio.google.com/apikey

## Puesta en marcha en local

```bash
git clone https://github.com/JMMM11/Hydronexis.git
cd Hydronexis

# 1. Backend de NEXIS
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows  (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env          # macOS/Linux: cp .env.example .env
#   edita backend/.env y pon tu GEMINI_API_KEY real
python gemini_back_end.py       # queda en http://127.0.0.1:5000

# 2. Frontend (otra terminal, desde la raíz del repo)
python -m http.server 5501      # o "Open with Live Server" sobre index.html
#   abre http://127.0.0.1:5501/
```

## Variables de entorno (backend)

| Variable         | Obligatoria | Descripción |
|------------------|-------------|-------------|
| `GEMINI_API_KEY` | Sí          | Clave de Google AI Studio. En local va en `backend/.env`; en Render, en *Environment*. |
| `GEMINI_MODEL`   | No          | Modelo de Gemini. Por defecto `gemini-3.5-flash-lite`. |
| `PORT`           | No          | Puerto. Por defecto 5000 (Render lo asigna solo). |

Las claves de Firebase y Supabase de `js/firebase-config.js` y `js/supabase-config.js` son **públicas por diseño** (identifican el proyecto); la seguridad real la dan las reglas de `firebase/` y las políticas de Supabase.

## Pruebas

```bash
cd backend
.venv\Scripts\python -m unittest -v
```

No necesitan clave ni conexión: simulan a Gemini. Para probar el servicio real:

```bash
curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d "{\"prompt\":\"What plans does Hydronexis offer?\"}"
```

## Despliegue

- **Frontend:** al hacer `push` a `main`, GitHub Pages publica la raíz automáticamente.
- **Backend (Render):** *Root Directory* = `backend`, *Build Command* = `pip install -r requirements.txt`, *Start Command* = `gunicorn gemini_back_end:app`. La clave se define en *Environment* → `GEMINI_API_KEY`.
- **Reglas de Firebase:** `firebase deploy --only firestore:rules,storage` desde la raíz del repo.
