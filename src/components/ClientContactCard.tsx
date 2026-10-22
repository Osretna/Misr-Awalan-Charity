import React, { useState } from 'react';
import { useContactSettings } from '../context/ContactContext';
import {
  buildTelUrl,
  buildWhatsAppUrl,
  copyTextToClipboard,
  formatDisplayNumber,
} from '../utils/phoneUtils';
import {
  Phone,
  PhoneCall,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Sparkles,
  Clock,
  ShieldCheck,
  Radio,
} from 'lucide-react';

interface Props {
  onOpenQr?: (type: 'whatsapp' | 'phone', number: string) => void;
  showAdminShortcuts?: boolean;
  onOpenDashboard?: () => void;
}

export const ClientContactCard: React.FC<Props> = ({
  onOpenQr,
  showAdminShortcuts = false,
  onOpenDashboard,
}) => {
  const { settings, lastSavedAt } = useContactSettings();
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [activeCallFeedback, setActiveCallFeedback] = useState<string | null>(null);

  const handleCopy = async (num: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const success = await copyTextToClipboard(num);
    if (success) {
      setCopiedNumber(num);
      setTimeout(() => setCopiedNumber(null), 2500);
    }
  };

  const handleCall = (num: string) => {
    setActiveCallFeedback(num);
    setTimeout(() => setActiveCallFeedback(null), 3000);
  };

  return (
    <div className="w-full max-w-md mx-auto text-white select-none">
      {/* Toast feedback for call or copy */}
      {copiedNumber && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold border border-emerald-400 animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span>تم نسخ الرقم ({copiedNumber}) إلى الحافظة بنجاح!</span>
        </div>
      )}

      {activeCallFeedback && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0d4f3b] text-amber-300 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold border border-amber-500/50">
          <PhoneCall className="w-4 h-4 animate-pulse text-amber-400" />
          <span>جاري بدء الاتصال بالرقم المحدث: {activeCallFeedback}</span>
        </div>
      )}

      {/* Main Container mirroring the exact layout & styling */}
      <div className="bg-[#031d14] border border-[#0d4533] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        {/* Glow ambient background effects */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header: Match screenshot • التواصل المباشر */}
        <div className="flex items-center justify-between pb-3 border-b border-[#0f4e39]/70 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f3ba2f] shadow-[0_0_8px_#f3ba2f] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {settings.sectionTitle || 'التواصل المباشر'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-[#052e22] px-2.5 py-1 rounded-full border border-emerald-800/60 text-[11px] text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>محدث فورياً</span>
          </div>
        </div>

        {/* Card 1: Official Phone Numbers (أرقام الهواتف الرسمية:) */}
        <div className="bg-[#062c21]/95 border border-[#11543f] rounded-2xl p-5 mb-4 shadow-lg transition-all duration-200 hover:border-[#1a7356] group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#34d399] font-bold text-base sm:text-lg flex items-center gap-2">
              <span>أرقام الهواتف الرسمية:</span>
            </h3>
            <span className="text-[11px] text-emerald-400/70 font-medium">
              اضغط للاتصال أو النسخ
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Primary Phone */}
            <div className="flex items-center justify-between bg-[#042017]/80 hover:bg-[#06271c] p-2.5 rounded-xl border border-transparent hover:border-emerald-700/50 transition-colors">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(settings.primaryPhone)}
                  className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800/60 text-emerald-300 hover:text-white transition-colors"
                  title="نسخ الرقم"
                >
                  {copiedNumber === settings.primaryPhone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                {onOpenQr && (
                  <button
                    type="button"
                    onClick={() => onOpenQr('phone', settings.primaryPhone)}
                    className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800/60 text-emerald-300 hover:text-white transition-colors"
                    title="رمز QR للاتصال"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Number and Golden Handset Icon on the right */}
              <a
                href={buildTelUrl(settings.primaryPhone)}
                onClick={() => handleCall(settings.primaryPhone)}
                className="flex items-center gap-3 text-white hover:text-amber-300 transition-colors group/link"
              >
                <span className="font-extrabold text-lg sm:text-xl tracking-wider font-mono direction-ltr">
                  {formatDisplayNumber(settings.primaryPhone)}
                </span>
                <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover/link:border-amber-400 group-hover/link:bg-amber-500/20 transition-all">
                  <Phone className="w-4 h-4 text-[#e6af2e] group-hover/link:text-amber-300 transition-transform group-hover/link:rotate-12" />
                </div>
              </a>
            </div>

            {/* Secondary Phone */}
            {settings.secondaryPhone && (
              <div className="flex items-center justify-between bg-[#042017]/80 hover:bg-[#06271c] p-2.5 rounded-xl border border-transparent hover:border-emerald-700/50 transition-colors">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(settings.secondaryPhone)}
                    className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800/60 text-emerald-300 hover:text-white transition-colors"
                    title="نسخ الرقم"
                  >
                    {copiedNumber === settings.secondaryPhone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {onOpenQr && (
                    <button
                      type="button"
                      onClick={() => onOpenQr('phone', settings.secondaryPhone)}
                      className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800/60 text-emerald-300 hover:text-white transition-colors"
                      title="رمز QR للاتصال"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Number and Golden Handset Icon on the right */}
                <a
                  href={buildTelUrl(settings.secondaryPhone)}
                  onClick={() => handleCall(settings.secondaryPhone)}
                  className="flex items-center gap-3 text-white hover:text-amber-300 transition-colors group/link"
                >
                  <span className="font-extrabold text-lg sm:text-xl tracking-wider font-mono direction-ltr">
                    {formatDisplayNumber(settings.secondaryPhone)}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover/link:border-amber-400 group-hover/link:bg-amber-500/20 transition-all">
                    <Phone className="w-4 h-4 text-[#e6af2e] group-hover/link:text-amber-300 transition-transform group-hover/link:rotate-12" />
                  </div>
                </a>
              </div>
            )}

            {/* Any Additional Phones configured by admin */}
            {settings.additionalPhones &&
              settings.additionalPhones
                .filter((p) => p.active && p.number)
                .map((extra) => (
                  <div
                    key={extra.id}
                    className="flex items-center justify-between bg-[#042017]/80 hover:bg-[#06271c] p-2.5 rounded-xl border border-transparent hover:border-emerald-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(extra.number)}
                        className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800/60 text-emerald-300 hover:text-white transition-colors"
                        title="نسخ الرقم"
                      >
                        {copiedNumber === extra.number ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <a
                      href={buildTelUrl(extra.number)}
                      onClick={() => handleCall(extra.number)}
                      className="flex items-center gap-3 text-white hover:text-amber-300 transition-colors"
                    >
                      <div className="text-right">
                        <span className="font-extrabold text-base sm:text-lg tracking-wider font-mono block">
                          {formatDisplayNumber(extra.number)}
                        </span>
                        {extra.label && (
                          <span className="text-[10px] text-emerald-400 block">
                            {extra.label}
                          </span>
                        )}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <Phone className="w-4 h-4 text-[#e6af2e]" />
                      </div>
                    </a>
                  </div>
                ))}
          </div>
        </div>

        {/* Card 2: WhatsApp Box (واتساب مباشر) */}
        <div className="bg-[#062c21]/95 border border-[#11543f] rounded-2xl p-5 shadow-lg transition-all duration-200 hover:border-[#25D366]/50 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#34d399] font-bold text-base sm:text-lg">
              واتساب مباشر
            </span>

            {/* Official WhatsApp Green Badge Icon matching the screenshot */}
            <a
              href={buildWhatsAppUrl(settings.whatsappNumber, settings.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center shadow-md shadow-[#25D366]/20 hover:scale-105 active:scale-95 transition-transform"
              title="محادثة واتساب فورية"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.82 2.791.82 3.181 0 5.768-2.587 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm3.374 8.219c-.14.394-.716.744-1.023.774-.294.029-.672.046-2.133-.561-1.867-.775-3.056-2.678-3.149-2.8-.093-.122-.756-1.006-.756-1.919 0-.913.48-1.362.65-1.547.17-.185.372-.232.496-.232.124 0 .248.001.356.006.115.006.269-.044.421.321.156.375.534 1.302.58 1.396.047.094.078.204.016.328-.063.125-.094.204-.187.313-.094.11-.197.246-.282.33-.094.094-.192.196-.083.383.11.187.488.805 1.047 1.303.721.642 1.328.841 1.516.935.187.094.296.078.406-.047.11-.125.468-.546.593-.733.125-.187.25-.156.421-.094.172.062 1.093.515 1.28.608.187.094.312.141.359.219.047.078.047.453-.093.847z" />
              </svg>
            </a>
          </div>

          <div className="flex items-center justify-between bg-[#042017]/80 hover:bg-[#06271c] p-2.5 rounded-xl border border-transparent hover:border-[#25D366]/40 transition-colors">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(settings.whatsappNumber)}
                className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800/60 text-emerald-300 hover:text-white transition-colors"
                title="نسخ رقم الواتساب"
              >
                {copiedNumber === settings.whatsappNumber ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              {onOpenQr && (
                <button
                  type="button"
                  onClick={() => onOpenQr('whatsapp', settings.whatsappNumber)}
                  className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800/60 text-[#25D366] hover:text-white transition-colors"
                  title="رمز QR لمحادثة الواتساب"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <a
              href={buildWhatsAppUrl(settings.whatsappNumber, settings.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-[#25D366] transition-colors group/wa"
            >
              <span className="font-extrabold text-lg sm:text-xl tracking-wider font-mono direction-ltr">
                {formatDisplayNumber(settings.whatsappNumber)}
              </span>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover/wa:opacity-100 group-hover/wa:translate-x-0.5 transition-all text-[#25D366]" />
            </a>
          </div>

          {/* Quick Action Button */}
          <a
            href={buildWhatsAppUrl(settings.whatsappNumber, settings.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#20ba5a] to-[#25D366] hover:from-[#1da851] hover:to-[#22bf5c] text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md shadow-[#25D366]/20 transition-all active:scale-[0.98]"
          >
            <span>بدء محادثة واتساب الآن</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Working Hours & Availability Footer */}
        <div className="mt-5 pt-3.5 border-t border-[#0e4b37]/60 flex items-center justify-between text-xs text-emerald-300/80">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{settings.workingHours || 'متاحون لخدمتكم يومياً'}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-amber-300/90 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>أرقام معتمدة رسمياً</span>
          </div>
        </div>

        {/* Optional Dashboard trigger if in standalone client view */}
        {showAdminShortcuts && onOpenDashboard && (
          <div className="mt-4 pt-3 text-center border-t border-emerald-900/30">
            <button
              onClick={onOpenDashboard}
              className="text-xs text-emerald-400/80 hover:text-emerald-300 hover:underline inline-flex items-center gap-1"
            >
              <span>⚙️ تعديل هذه الأرقام من لوحة التحكم</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
