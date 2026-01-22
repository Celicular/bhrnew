import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

const footerLinks = {
  main: [
    { label: "Home", href: "#" },
    { label: "Find Rentals", href: "#" },
    { label: "Become a Host", href: "#" },
  ],
  about: [
    { label: "About Us", href: "#" },
    { label: "Support", href: "#" },
  ],
  support: [
    { label: "Help & Support", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1f2e] text-[#c5c3bd] pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <img
              src="/assets/logo.png"
              alt="BHR Logo"
              className="h-10"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p className="text-[#9baab8] font-light leading-relaxed max-w-sm">
              Your trusted partner for exceptional vacation rentals across the
              United States. Discover, book, and experience unforgettable stays.
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h4 className="text-[#faf8f5] mb-6 uppercase tracking-wider text-xs font-semibold">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.main.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#9baab8] hover:text-[#d4af37] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Support */}
          <div>
            <h4 className="text-[#faf8f5] mb-6 uppercase tracking-wider text-xs font-semibold">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#9baab8] hover:text-[#d4af37] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-[#faf8f5] mb-6 uppercase tracking-wider text-xs font-semibold">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#9baab8] hover:text-[#d4af37] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[#faf8f5] mb-6 uppercase tracking-wider text-xs font-semibold">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#9baab8] hover:text-[#d4af37] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Copyright */}
          <div className="text-sm text-[#9baab8]">
            © 2026 Book Holiday Rental. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-300 group"
              >
                <social.icon className="w-5 h-5 text-[#9baab8] group-hover:text-[#d4af37] transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
