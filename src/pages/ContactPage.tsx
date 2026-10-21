import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { lang, settings } = useApp();
  const strings = t[lang];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setSubject('');
      setMessage('');
      setSent(false);
    }, 4000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-[#0A5C4B]/10 px-3.5 py-1 rounded-full">
          {settings.licenseNumber}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A5C4B] font-cairo">
          {strings.contact}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {lang === 'ar'
            ? `تواصل مباشرة مع إدارة ${settings.orgNameAr} بشبرا الخيمة وكافة فروعنا الميدانية.`
            : 'Get in touch for donor inquiries, orphan sponsorships, or field visit coordinations.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-gray-900 font-cairo">
              {lang === 'ar' ? 'بيانات التواصل الرسمية' : 'Official Coordinates'}
            </h3>

            <div className="space-y-3 text-xs text-gray-700">
              {/* Phones from card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <div className="text-xs font-bold text-[#0A5C4B] flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#C9A227]" />
                  <span>{lang === 'ar' ? 'أرقام الاتصال المباشر:' : 'Direct Phone Lines:'}</span>
                </div>
                <div className="flex flex-col gap-1.5 font-bold text-gray-900 text-sm">
                  <a href={`tel:${settings.phone1}`} className="hover:text-[#0A5C4B] transition-colors flex items-center justify-between">
                    <span>{settings.phone1}</span>
                    <span className="text-[10px] text-gray-500 font-normal">{lang === 'ar' ? 'متاح واتساب وتليفون' : 'WhatsApp & Call'}</span>
                  </a>
                  <a href={`tel:${settings.phone2}`} className="hover:text-[#0A5C4B] transition-colors flex items-center justify-between">
                    <span>{settings.phone2}</span>
                    <span className="text-[10px] text-gray-500 font-normal">{lang === 'ar' ? 'خط ساخن وتنسيق' : 'Hotline'}</span>
                  </a>
                </div>
              </div>

              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-100/70 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-[#25D366] text-white">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">{strings.whatsapp}</div>
                  <div className="font-bold text-sm text-gray-900 dir-ltr">{settings.whatsappNumber}</div>
                </div>
              </a>

              {/* Exact Address from Card */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2.5 rounded-xl bg-gray-200 text-gray-700 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">{lang === 'ar' ? 'المقر الرئيسي المعتمد' : 'Official Headquarters'}</div>
                  <div className="font-bold text-xs text-gray-900 leading-relaxed mt-0.5">{settings.address}</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2.5 rounded-xl bg-gray-200 text-gray-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">{lang === 'ar' ? 'البريد الرسمي' : 'Email'}</div>
                  <div className="font-bold text-xs text-gray-900">{settings.officialEmail}</div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2.5 rounded-xl bg-gray-200 text-gray-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">{lang === 'ar' ? 'مواعيد العمل' : 'Working Hours'}</div>
                  <div className="font-bold text-xs text-gray-900">{lang === 'ar' ? 'السبت - الخميس (9:00 ص - 6:00 م)' : 'Sat - Thu (9:00 AM - 6:00 PM)'}</div>
                </div>
              </div>

            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-4 rounded-2xl bg-[#0A5C4B]/5 border border-[#0A5C4B]/20 text-xs text-gray-600 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#C9A227] shrink-0" />
            <span>{settings.licenseNumber} - {settings.taxNumber}</span>
          </div>

        </div>

        {/* Message Form & Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 font-cairo mb-4">
              {lang === 'ar' ? 'أرسل لنا رسالة مباشرة' : 'Send Direct Inquiry'}
            </h3>

            {sent ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#0A5C4B] mx-auto" />
                <h4 className="font-bold text-sm text-emerald-950 font-cairo">
                  {lang === 'ar' ? 'تم استلام رسالتك بنجاح' : 'Message Sent!'}
                </h4>
                <p className="text-xs text-emerald-800">
                  {lang === 'ar' ? 'سيتواصل معك ممثل خدمة المتبرعين خلال ساعات العمل.' : 'Our representative will reach out soon.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {strings.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {strings.phoneNumber} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'موضوع الرسالة' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: استفسار عن كفالة أيتام، تبرع سقيا ماء، تطوع...' : 'e.g. Orphan care inquiry...'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'نص الرسالة' : 'Message'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0A5C4B] hover:bg-[#073229] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Interactive Google Maps Embed with pointer for Shubra El-Kheima */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A227]" />
                <span>{settings.address}</span>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Google Maps</span>
            </div>
            <div className="aspect-video w-full">
              <iframe
                title="Shubra El Kheima Egypt Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110419.64658097968!2d31.2285!3d30.1285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145841029df4ec67%3A0xbc4e52bf445b2064!2sShubra%20Al%20Khaimah%2C%20Al-Qalyubia%20Governorate%2C%20Egypt!5e0!3m2!1sen!2seg!4v1710000000000!5m2!1sen!2seg"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
