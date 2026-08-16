import React, { useState, useRef } from "react";
import { Eye, BookOpen, Compass, Upload, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

const SERVICES = [
  {
    id: "proof",
    name: "Proofreading & Editing",
    desc: "Focused on clarity, flow, and grammar.",
    rateUSD: 0.005,
    rateINR: 0.1,
    type: "per-word",
    icon: Eye,
  },
  {
    id: "dev",
    name: "Developmental Feedback",
    desc: "Deep-dive expert advice on plot and structure.",
    rateUSD: 0.01,
    rateINR: 0.2,
    type: "per-word",
    icon: BookOpen,
  },
  {
    id: "publish",
    name: "Publishing Consultation",
    desc: "1-on-1 session to navigate the industry.",
    rateUSD: 50,
    rateINR: 1000,
    type: "flat",
    icon: Compass,
  },
];

export default function ConsultationView({ currency = "USD" }) {
  const { user, setIsAuthModalOpen } = useAuth();

  const [selectedService, setSelectedService] = useState("proof");
  const [wordCount, setWordCount] = useState("50000");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(""); // '', 'sending', 'success'

  const fileInputRef = useRef(null);

  const activeService =
    SERVICES.find((s) => s.id === selectedService) || SERVICES[0];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split(".").pop().toLowerCase();

      if (["doc", "docx", "pdf"].includes(ext)) {
        setFileName(file.name);
        setSelectedFile(file);
      } else {
        alert("Please upload only .doc, .docx, or .pdf files.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split(".").pop().toLowerCase();

      if (["doc", "docx", "pdf"].includes(ext)) {
        setFileName(file.name);
        setSelectedFile(file);
      } else {
        alert("Please upload only .doc, .docx, or .pdf files.");
        e.target.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setBookingStatus("sending");

      const token = await user.getIdToken();

      await api.submitConsultation({
        sourcePage: 'Weaver Mode > Expert Consultation',
        service: activeService.name,
        userName: user.displayName || "Unknown User",
        userEmail: user.email || "",
        wordCount: wordCount || "",
        notes: notes || "",
        file: selectedFile
      }, token);

      setBookingStatus("success");
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.message || "Submission failed");
      setBookingStatus("");
    }
  };

  const calculateTotal = () => {
    if (activeService.type === "flat") {
      return activeService[currency === "USD" ? "rateUSD" : "rateINR"];
    }

    const count = parseInt(wordCount) || 0;
    const rate = activeService[currency === "USD" ? "rateUSD" : "rateINR"];
    return count * rate;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Title Header */}
      <div>
        <span className="text-xs font-mono font-bold tracking-[0.25em] text-purple-400 uppercase">Expert Sanctuary</span>
        <h1 className="text-4xl font-serif text-white tracking-tight mt-1.5">Publishing Atelier & Sanctuary</h1>
        <p className="text-slate-400 text-sm font-light leading-relaxed mt-2 max-w-3xl">
          Receive proofreading, developmental feedback, and publishing consultations from our industry experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SERVICES.map((srv) => {
          const IconComponent = srv.icon;
          const isActive = selectedService === srv.id;

          return (
            <div
              key={srv.id}
              onClick={() => setSelectedService(srv.id)}
              className={`relative overflow-hidden group rounded-3xl p-7 transition-all duration-300 cursor-pointer select-none border ${
                isActive
                  ? "border-purple-500/40 bg-[#0d0b17]/60"
                  : "border-slate-900 bg-[#0B0F19]/40"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-md">
                <IconComponent className="w-5 h-5" />
              </div>

              <h3 className="font-serif font-semibold text-xl text-slate-100 mt-5 leading-snug">
                {srv.name}
              </h3>

              <p className="text-slate-400 font-light text-base leading-relaxed mt-2.5">
                {srv.desc}
              </p>

              <span className="text-base font-mono text-purple-300 font-medium mt-4 block">
                {srv.type === "flat"
                  ? currency === "USD"
                    ? `$${srv.rateUSD} flat`
                    : `₹${srv.rateINR.toLocaleString()} flat`
                  : currency === "USD"
                  ? `$${srv.rateUSD} per word`
                  : `₹${srv.rateINR} per word`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col justify-between h-full bg-[#0B0F19]/25 border border-slate-900/60 p-8 rounded-3xl">
          <div>
            <h2 className="font-serif font-semibold text-3xl text-white">
              Price Calculator
            </h2>

            <p className="text-slate-400 font-light text-base mt-1.5">
              Estimates update as you type.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                  Service
                </label>

                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-[#07090e]/60 border border-slate-900 rounded-xl p-3.5 text-slate-200"
                >
                  {SERVICES.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                  Total Word Count
                </label>

                <input
                  type="text"
                  value={wordCount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setWordCount(val);
                  }}
                  disabled={activeService.type === "flat"}
                  className="w-full bg-[#07090e]/60 border border-slate-900 rounded-xl p-3.5 text-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 bg-[#04060A]/85 border border-slate-900/60 p-6 rounded-2xl">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest block">
              Estimated Total
            </span>

            <span className="font-serif font-medium text-4xl text-white mt-2 block">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>

        <div className="bg-[#0B0F19]/25 border border-slate-900/60 p-8 rounded-3xl">
          {bookingStatus === "success" ? (
            <div className="text-center py-16">
              <h3 className="text-3xl text-white font-serif">
                Submission Successful
              </h3>

              <p className="text-slate-400 mt-4">
                Your consultation request has been sent successfully.
              </p>

              <button
                onClick={() => {
                  setBookingStatus("");
                  setFileName("");
                  setSelectedFile(null);
                  setNotes("");
                }}
                className="mt-8 px-6 py-3 rounded-xl bg-purple-600 text-white"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-between h-full space-y-6"
            >
              <div>
                <h2 className="font-serif font-semibold text-3xl text-white">
                  Secure Upload Portal
                </h2>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group mt-6 border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-purple-500/60 bg-purple-950/20"
                      : fileName
                      ? "border-emerald-500/40 bg-emerald-950/10"
                      : "border-slate-800/90"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".doc,.docx,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex justify-center mb-4">
                    <Upload className="w-6 h-6 text-purple-400" />
                  </div>

                  {fileName ? (
                    <p className="text-emerald-400">{fileName}</p>
                  ) : (
                    <p className="text-slate-400">Drop manuscript here</p>
                  )}
                </div>

                <div className="mt-6">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes for your expert..."
                    className="w-full bg-[#07090e]/60 border border-slate-900 rounded-xl p-4 text-slate-200 h-24 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingStatus === "sending"}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold"
              >
                {bookingStatus === "sending"
                  ? "Submitting..."
                  : "Submit to the Sanctuary"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}