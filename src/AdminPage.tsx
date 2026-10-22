import React, { useState } from 'react';
import { Copy, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
  PREFIXES,
  GROOM_NAME,
  BRIDE_NAME,
  buildDisplayName,
  buildGuestLink,
  buildInvitationMessage,
} from './guest';

export function AdminPage() {
  const [prefix, setPrefix] = useState<string>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [displayName, setDisplayName] = useState('');

  const message = generatedLink ? buildInvitationMessage(displayName, generatedLink) : '';

  const handleGenerate = () => {
    if (!guestName.trim()) return;
    setDisplayName(buildDisplayName(prefix, guestName));
    setGeneratedLink(buildGuestLink(window.location.origin, prefix, guestName));
  };

  const copyText = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Could not copy. Please copy manually.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-[0_8px_30px_rgba(176,137,104,0.15)] overflow-hidden border border-brand-beige/50">
        <div className="px-6 py-8 sm:px-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-2 text-stone-800">Link Generator</h2>
            <p className="text-stone-500 font-sans text-sm uppercase tracking-[0.2em]">
              {GROOM_NAME} &amp; {BRIDE_NAME} — personalized invitations
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Select Prefix
              </label>
              <select
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-beige focus:ring-2 focus:ring-brand-beige-deep focus:border-transparent outline-none transition-all bg-white font-sans"
              >
                {PREFIXES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Guest Name
              </label>
              <input
                type="text"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Sanjaya"
                className="w-full px-4 py-3 rounded-lg border border-brand-beige focus:ring-2 focus:ring-brand-beige-deep focus:border-transparent outline-none transition-all bg-white font-sans"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!guestName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-beige-deep text-white font-sans text-sm tracking-[0.2em] uppercase shadow-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <LinkIcon className="w-5 h-5" />
              Generate Link
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => copyText(generatedLink, 'Link copied!')}
                disabled={!generatedLink}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-beige-deep text-brand-beige-deep font-sans text-xs tracking-[0.15em] uppercase hover:bg-brand-beige/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Copy className="w-4 h-4" />
                Copy Link Only
              </button>
              <button
                onClick={() => copyText(message, 'Message copied!')}
                disabled={!generatedLink}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-stone-800 text-brand-champagne font-sans text-xs tracking-[0.15em] uppercase hover:bg-stone-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                Copy Full Message
              </button>
            </div>

            {generatedLink && (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                  <p className="text-xs text-stone-500 mb-2 font-semibold uppercase tracking-[0.15em]">Generated Link</p>
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block break-all text-sm text-brand-beige-deep underline underline-offset-2"
                  >
                    {generatedLink}
                  </a>
                </div>

                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                  <p className="text-xs text-stone-500 mb-2 font-semibold uppercase tracking-[0.15em]">Message Preview</p>
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm text-stone-600 leading-relaxed">{message}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
