"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/components/Providers";

export default function ContactPage() {
  const { toast } = useToast();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast("Please fill in all required fields.", "warning");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast(`Message sent successfully! We will get back to ${email} shortly.`, "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  const contactDetails = [
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: "Support Email",
      value: "support@careermate.io",
      href: "mailto:support@careermate.io"
    },
    {
      icon: <Phone className="w-5 h-5 text-secondary" />,
      title: "Direct Helpline",
      value: "+1 (800) 555-0199",
      href: "tel:+18005550199"
    },
    {
      icon: <MapPin className="w-5 h-5 text-accent" />,
      title: "Office Headquarters",
      value: "100 Pine St, San Francisco, CA 94111",
      href: "https://maps.google.com"
    }
  ];

  return (
    <div className="flex-1 bg-brand-bg py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Get in Touch with CareerMate
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Need support with pricing plans, account configuration, or resume parsing? Our success team is ready to help.
          </p>
        </div>

        {/* Form and info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Details Sidebar (col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact cards */}
            <div className="space-y-4">
              {contactDetails.map((detail, idx) => (
                <a
                  key={idx}
                  href={detail.href}
                  target={detail.title.includes("Headquarters") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/30 transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                    {detail.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">{detail.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-800 font-extrabold mt-1">{detail.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Embedded Map Representation */}
            <div className="premium-card p-6 rounded-card space-y-4 overflow-hidden">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4.5 h-4.5 text-slate-400" />
                Office Coordinates
              </h4>

              {/* Visual Map graphic layout */}
              <div className="w-full h-44 bg-slate-100 rounded-xl relative flex flex-col justify-end p-4 border border-slate-200 overflow-hidden shadow-inner">
                {/* Abstract grid lines simulating Map */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                
                {/* Mock GPS Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center border-2 border-white shadow text-white font-bold text-[9px] relative">
                    CM
                  </div>
                </div>

                <div className="bg-white/95 p-3 rounded-lg border border-slate-200 shadow-sm relative z-10 space-y-0.5">
                  <span className="font-bold text-[10px] text-slate-800 uppercase tracking-wide block">San Francisco HQ</span>
                  <span className="text-[9px] text-slate-500 font-semibold block">100 Pine Street, Downtown SF</span>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form panel (col 7) */}
          <div className="lg:col-span-7 premium-card p-8 rounded-card">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-1.5 mb-6">
              <MessageSquare className="w-5 h-5 text-primary" />
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary text-slate-800 font-semibold"
                  />
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary text-slate-800 font-semibold"
                  />
                </div>

              </div>

              {/* Subject */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Plan upgrade issue, resume parse error"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary text-slate-800 font-semibold"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Message Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your support details here..."
                  rows={4}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary text-slate-800 font-semibold leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
