import React from 'react';
import { X, QrCode, ExternalLink, Copy, Check } from 'lucide-react';
import { buildTelUrl, buildWhatsAppUrl, copyTextToClipboard } from '../utils/phoneUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'whatsapp' | 'phone';
  number: string;
  whatsappMessage?: string;
}

export const QRCodeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  type,
  number,
  whatsappMessage,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const targetUrl =
    type === 'whatsapp'
      ? buildWhatsAppUrl(number, whatsappMessage)
      : buildTelUrl(number);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    targetUrl
  )}`;

  const handleCopy = async () => {
    const success = await copyTextToClipboard(number);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#04241a] border border-[#0f543e] rounded-3xl p-6 shadow-2xl text-white text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl mx-auto mb-3 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <QrCode className="w-6 h-6 text-emerald-400" />
        </div>

        <h3 className="font-black text-lg text-white">
          {type === 'whatsapp' ? 'رمز QR لمحادثة الواتساب' : 'رمز QR للاتصال الهاتفي'}
        </h3>
        <p className="text-xs text-emerald-300/80 mt-1">
          وجّه كاميرا هاتفك لمسح الرمز وبدء التواصل فوراً مع الرقم المحدث
        </p>

        {/* QR Code image */}
        <div className="my-5 p-3 bg-white rounded-2xl inline-block shadow-xl">
          <img
            src={qrImageUrl}
            alt="QR Code"
            className="w-48 h-48 mx-auto rounded-lg object-contain"
          />
        </div>

        <div className="bg-[#021811] p-3 rounded-xl border border-emerald-800/50 mb-4 flex items-center justify-between">
          <span className="font-mono text-base font-bold text-emerald-300" dir="ltr">
            {number}
          </span>
          <button
            onClick={handleCopy}
            className="text-xs flex items-center gap-1 text-emerald-400 hover:text-white bg-emerald-900/60 px-2.5 py-1 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>
        </div>

        <a
          href={targetUrl}
          target={type === 'whatsapp' ? '_blank' : undefined}
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all ${
            type === 'whatsapp'
              ? 'bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[#25D366]/20'
              : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
          }`}
        >
          <span>{type === 'whatsapp' ? 'فتح في واتساب الآن' : 'بدء الاتصال الآن'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
