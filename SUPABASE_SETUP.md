# Supabase Setup für Job Application Site

## 1. Neues Supabase-Projekt erstellen

1. Gehe zu [supabase.com/dashboard](https://supabase.com/dashboard)
2. Klicke auf "New Project"
3. Wähle Organisation, gib dem Projekt einen Namen (z.B. `job-application-erb`)
4. Setze ein sicheres Datenbank-Passwort
5. Wähle Region (z.B. Frankfurt für Schweiz)
6. Klicke "Create new project"

## 2. Storage Bucket erstellen

1. Im Supabase Dashboard: **Storage** → **New bucket**
2. Name: `job-applications`
3. **Private bucket** (nicht öffentlich – nur mit Service Role Key zugreifbar)
4. Optional: **File size limit** auf 10 MB setzen
5. Optional: **Allowed MIME types** auf `application/pdf` beschränken
6. Klicke "Create bucket"

### Bucket via SQL (Alternative)

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-applications',
  'job-applications',
  false,
  10485760,  -- 10 MB
  ARRAY['application/pdf']
);
```

## 3. API Keys holen

1. **Project Settings** → **API**
2. Kopiere:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** (unter "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Wichtig:** Der `service_role` Key umgeht alle RLS-Policies. Niemals im Frontend verwenden!

## 4. Umgebungsvariablen setzen

1. Kopiere `.env.example` zu `.env.local`
2. Trage die Werte ein:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Optional: RLS für Storage

Der Bucket ist privat. Uploads erfolgen über den Service Role Key in der API-Route. Es sind keine zusätzlichen RLS-Policies nötig, da der Client nie direkt auf Storage zugreift.

## Spam-Schutz (bereits implementiert)

- **Rate Limiting:** Max. 3 Bewerbungen pro IP pro Stunde
- **Honeypot:** Verstecktes Feld, das Bots ausfüllen – echte Nutzer sehen es nicht
- **Validierung:** Nur PDF, max. 10 MB

Für Produktion mit mehreren Server-Instanzen: Rate Limiting z.B. mit [Upstash Redis](https://upstash.com/) oder Supabase-Tabelle mit `submissions(ip, created_at)` erweitern.
