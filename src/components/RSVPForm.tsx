import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Loader2, Heart, Sparkles, Phone } from 'lucide-react';
import { SCRIPT_URL } from '../config';

const emptyForm = {
  fullName: '',
  phone: '',
  attendance: 'Attending',
  guests: '1',
  message: '',
};

const inputClass =
  'w-full bg-white/80 px-6 py-4 rounded-full border border-stone-200/60 focus:ring-2 focus:ring-brand-beige/30 focus:border-brand-beige-deep/40 outline-none transition-all duration-300 font-serif italic text-lg shadow-inner placeholder:text-stone-300';

export const RSVPForm: React.FC = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const payload = new URLSearchParams();
      payload.append('sheet', 'RSVP');
      payload.append('name', formData.fullName);
      payload.append('phone', formData.phone);
      payload.append('attendance', formData.attendance);
      payload.append('guests', formData.attendance === 'Attending' ? formData.guests : '0');
      payload.append('message', formData.message);

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
      });

      setStatus('success');
      setFormData(emptyForm);
    } catch (error) {
      console.error('Error sending RSVP: ', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 relative py-10">
      {/* Premium ambient backdrop & glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-brand-beige/15 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="glass p-10 sm:p-14 lg:p-16 rounded-[3rem] border border-white/40 shadow-[0_30px_60px_rgba(176,137,104,0.1)] relative overflow-hidden bg-white/60 backdrop-blur-3xl lg:flex items-center gap-16"
      >
        {/* Soft top border line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-champagne via-brand-beige-deep/80 to-brand-champagne" />

        {/* Left Side: Elegant Text */}
        <div className="lg:w-1/2 lg:pr-10 mb-12 lg:mb-0 relative text-center lg:text-left">
          <Sparkles className="absolute -top-6 -left-6 w-12 h-12 text-brand-beige/30 animate-pulse" />

          <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-6">
            <span className="text-brand-beige-deep uppercase tracking-[0.5em] text-[10px] sm:text-[11px] font-bold drop-shadow-sm">
              Kindly Respond
            </span>
            <div className="hidden lg:block w-16 h-[1px] bg-gradient-to-r from-brand-beige-deep/60 to-transparent" />
          </div>

          <h2 className="text-5xl sm:text-6xl font-display text-stone-800 tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Kindly <span className="italic font-light text-brand-beige-deep">R.S.V.P</span>
          </h2>

          <p className="text-stone-500/90 font-serif text-lg leading-relaxed mb-6">
            We will be honoured by your gracious presence and blessings. RSVP (regrets only) by{' '}
            <span className="font-semibold text-brand-beige-deep">31.12.2026</span>.
          </p>

          <div className="w-12 h-[1px] bg-brand-beige/50 mx-auto lg:mx-0 mb-8" />

          <div className="flex flex-col gap-3 items-center lg:items-start">
            <a href="tel:+94773016669" className="inline-flex items-center gap-3 text-stone-700 font-serif text-lg hover:text-brand-beige-deep transition-colors">
              <Phone className="w-4 h-4 text-brand-beige-deep" />
              Pubudu <span className="text-brand-beige-deep">|</span> 077 301 6669
            </a>
            <a href="tel:+94702032398" className="inline-flex items-center gap-3 text-stone-700 font-serif text-lg hover:text-brand-beige-deep transition-colors">
              <Phone className="w-4 h-4 text-brand-beige-deep" />
              Kavindya <span className="text-brand-beige-deep">|</span> 070 203 2398
            </a>
          </div>
        </div>

        {/* Right Side: Flowing Form */}
        <div className="lg:w-1/2 relative z-10">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16 px-8 bg-white/70 rounded-[2rem] border border-white shadow-xl"
              >
                <div className="w-24 h-24 bg-green-50/80 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-4xl font-display text-stone-800 mb-4 tracking-tight drop-shadow-sm">With Gratitude</h3>
                <p className="text-stone-500/90 leading-relaxed font-serif text-lg mb-8">
                  Your response has been warmly received. Thank you for letting us know!
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 rounded-full border border-brand-beige/30 text-brand-beige-deep font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-brand-beige/10 transition-all duration-300 shadow-sm"
                >
                  Update Response
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 bg-white/40 p-8 sm:p-10 rounded-[2.5rem] border border-white shadow-[0_15px_30px_rgba(0,0,0,0.05)]"
              >
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 ml-2">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="E.g., Mr. & Mrs. Perera"
                    className={inputClass}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 ml-2">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="E.g., 077 123 4567"
                    className={inputClass}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 ml-2">Will You Attend?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'Attending', label: 'Joyfully Accept' },
                      { value: 'Not Attending', label: 'Regretfully Decline' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, attendance: opt.value })}
                        className={`px-3 py-4 rounded-full border font-serif italic text-sm sm:text-base transition-all duration-300 ${
                          formData.attendance === opt.value
                            ? 'bg-stone-800 text-brand-champagne border-stone-800 shadow-md'
                            : 'bg-white/80 text-stone-600 border-stone-200/60 hover:border-brand-beige-deep/40'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.attendance === 'Attending' && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 ml-2">Number of Guests</label>
                    <div className="relative group">
                      <select
                        className="w-full bg-white/80 px-6 py-4 rounded-full border border-stone-200/60 focus:ring-2 focus:ring-brand-beige/30 focus:border-brand-beige-deep/40 outline-none transition-all duration-300 appearance-none font-serif italic text-lg shadow-inner text-stone-700 cursor-pointer"
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      >
                        <option value="1">Just Me (1 Guest)</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5">5 Guests</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-beige-deep transition-transform duration-300 group-hover:scale-110">
                        <Heart className="w-5 h-5 fill-brand-beige/30 drop-shadow-sm" />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 ml-2">Message (Optional)</label>
                  <textarea
                    placeholder="A note for the couple..."
                    className="w-full bg-white/80 px-6 py-4 rounded-[2rem] border border-stone-200/60 focus:ring-2 focus:ring-brand-beige/30 focus:border-brand-beige-deep/40 outline-none transition-all duration-300 h-28 resize-none font-serif italic text-lg shadow-inner placeholder:text-stone-300"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-center text-sm text-red-500 font-serif italic">
                    Something went wrong. Please try again or call us directly.
                  </p>
                )}

                <div className="pt-4">
                  <button
                    disabled={status === 'loading'}
                    type="submit"
                    className="w-full bg-stone-800 text-brand-champagne py-5 rounded-full font-sans tracking-[0.3em] font-bold text-[11px] uppercase hover:bg-stone-900 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Send Response'
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
