"use client";

import { useState } from "react";
import Link from "next/link";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 10 MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setError("Please enter your last name.");
      return;
    }
    if (firstName.length > 100 || lastName.length > 100) {
      setError("First name and last name must not exceed 100 characters each.");
      return;
    }
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    // Honeypot: if filled, it's a bot - silently succeed
    if (honeypot) {
      window.location.href = "/success";
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      window.location.href = "/success";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* UniBe Header */}
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

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-[var(--unibe-red)] mb-2">
          Post Doc in Plant Volatile Interactions (100%)
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Prof. Matthias Erb · University of Bern, Switzerland
        </p>

        <div className="prose prose-gray max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed mb-6">
            The Research Section Biotic Interactions (Prof. Matthias Erb), University of Bern,
            Switzerland, is inviting applications for a Post Doc in Plant Volatile Interactions (100%).
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Our laboratory studies how small molecules govern plant-environment interactions. We use
            an interdisciplinary approach that builds on a mechanistic understanding and manipulation
            of small molecule biosynthesis and perception to quantify biological and ecological effects.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            To strengthen our research group, we are looking for a post doc interested in deciphering
            the role of plant volatiles in plant-plant interactions. Over the last years, we have built
            a globally unique mutant panel and new methods to measure volatile dynamics between plants
            and have made significant progress in understanding how plants perceive volatiles. Thus,
            this is a great moment to push the frontiers of knowledge and generate new insights into
            this fascinating phenomenon.
          </p>

          <h2 className="text-lg font-semibold text-[var(--unibe-red)] mt-8 mb-4">
            What we expect
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>
              PhD in a relevant field (planned or completed), including significant contributions to
              scientific enterprise, including for instance publications of high quality and originality.
            </li>
            <li>
              Experience in chemical ecology, analytical chemistry, molecular biology, biochemistry,
              or plant genetics.
            </li>
            <li>
              An interest in performing interdisciplinary research from genes to agroecosystems is crucial.
            </li>
            <li>Good writing and communication skills are essential.</li>
            <li>Willingness to pursue a long-term academic career.</li>
          </ul>

          <h2 className="text-lg font-semibold text-[var(--unibe-red)] mt-8 mb-4">
            What we offer
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>A unique opportunity to push the boundaries of knowledge in a dynamic research team.</li>
            <li>Active, personalized mentoring towards an independent scientific career.</li>
            <li>Attractive remuneration according to Swiss salary rates.</li>
            <li>
              The project will be tailored to the skills and needs of the applicant in order to maximize
              their training, scientific and personal development.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-[var(--unibe-red)] mt-8 mb-4">
            How to apply
          </h2>
          <p className="text-gray-700 mb-6">
            Upload your CV, a brief letter of motivation explaining your reason to apply, your three most
            noteworthy achievements and contact details of two academic references as a single PDF
            (max. 10 MB). The position is open until filled. Earliest starting date is 1. September 2026.
          </p>

          <p className="text-sm text-gray-600">
            <strong>More Information:</strong>{" "}
            <a
              href="https://www.ips.unibe.ch/research/interactions/index_eng.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--unibe-red)] hover:underline"
            >
              https://www.ips.unibe.ch/research/interactions/index_eng.html
            </a>
          </p>
        </div>

        {/* Application Form */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-xl font-semibold text-[var(--unibe-red)] mb-6">
            Submit your application
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot - hidden from users, bots will fill it */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name
                </label>
                <input
                  id="first-name"
                  type="text"
                  required
                  maxLength={100}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[var(--unibe-red)] focus:outline-none focus:ring-1 focus:ring-[var(--unibe-red)]"
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name
                </label>
                <input
                  id="last-name"
                  type="text"
                  required
                  maxLength={100}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[var(--unibe-red)] focus:outline-none focus:ring-1 focus:ring-[var(--unibe-red)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="pdf-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload your application (PDF, max. 10 MB)
              </label>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[var(--unibe-red)] file:text-white hover:file:bg-[var(--unibe-red-dark)] file:cursor-pointer"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={!firstName.trim() || !lastName.trim() || !file || isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-[var(--unibe-red)] text-white font-medium rounded hover:bg-[var(--unibe-red-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Uploading…" : "Submit application"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
