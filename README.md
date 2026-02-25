# Job Application – Post Doc Plant Volatile Interactions

Bewerbungsseite für die Stelle «Post Doc in Plant Volatile Interactions» an der Research Section Biotic Interactions (Prof. Matthias Erb), Universität Bern.

## Features

- Jobausschreibung im UniBe-Design
- PDF-Upload (max. 10 MB)
- Supabase Storage für Dateien
- Spam-Schutz: Rate Limiting (3/IP/Stunde), Honeypot
- Bestätigungsseite nach erfolgreicher Bewerbung

## Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Supabase konfigurieren

Siehe [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) für die Anleitung.

### 3. Umgebungsvariablen

Kopiere `.env.example` zu `.env.local` und trage die Supabase-Credentials ein.

### 4. Lokal starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Repository auf GitHub pushen
2. [Vercel](https://vercel.com) → New Project → GitHub-Repo verbinden
3. Environment Variables setzen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

## Technologie

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase Storage
