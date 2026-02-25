import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[var(--unibe-red)] text-white py-6 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="https://www.unibe.ch/index_eng.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm opacity-90 hover:opacity-100 transition-opacity"
          >
            University of Bern
          </Link>
          <p className="text-sm mt-1 opacity-80">
            Institute of Plant Sciences · Research Section Biotic Interactions
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-semibold text-[var(--unibe-red)] mb-4">
            Application received. Thank you!
          </h1>
          <p className="text-gray-700 leading-relaxed">
            If you are shortlisted, you will hear from us in the coming weeks. Please note that we do
            not send out rejection messages for people who are not shortlisted in order to conserve
            resources. If you do not hear from us within 6 weeks, you were likely not shortlisted.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-[var(--unibe-red)] hover:underline font-medium"
        >
          ← Back to job posting
        </Link>
      </main>
    </div>
  );
}
