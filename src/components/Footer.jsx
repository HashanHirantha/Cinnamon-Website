import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Music2, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
    quickLinks: [
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/shop' },
        { label: 'Our Story', to: '/about' },
        { label: 'Ceylon Cinnamon', to: '/ceylon-cinnamon' },
        { label: 'Contact', to: '/contact' },
    ],
    customerCare: [
        { label: 'Shipping', to: '/shipping' },
        { label: 'Returns', to: '/returns' },
        { label: 'FAQ', to: '/faq' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
    ],
};

const socials = [
    { Icon: Instagram, href: '#', label: 'Instagram' },
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Youtube, href: '#', label: 'YouTube' },
    { Icon: Music2, href: '#', label: 'TikTok' },
];

const Footer = () => {
    return (
        <footer className="bg-cinnamon-900 text-cream-100">
            {/* Trust bar */}
            <div className="border-b border-cinnamon-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { icon: '🌿', title: '100% Natural', sub: 'No additives' },
                            { icon: '🏆', title: 'Premium Grade', sub: 'Export quality' },
                            { icon: '🌍', title: 'Ships Worldwide', sub: '14+ countries' },
                            { icon: '🇱🇰', title: 'Sri Lankan', sub: 'Authentic origin' },
                        ].map(({ icon, title, sub }) => (
                            <div key={title} className="flex flex-col items-center gap-1">
                                <span className="text-3xl">{icon}</span>
                                <p className="text-sm font-semibold text-cream-100">{title}</p>
                                <p className="text-xs text-cream-100/60">{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 tracking-wider">PURE GOLD <span className="text-gold-400">Products</span></span>
                        <p className="text-xs text-cinnamon-400 tracking-widest uppercase mt-1 mb-4">Pure Ceylon Cinnamon</p>
                        <p className="text-sm text-cream-100/60 leading-relaxed mb-6">
                            Bringing the finest authentic Ceylon cinnamon from the lush gardens of Sri Lanka to your home.
                            Premium quality, naturally grown, carefully crafted.
                        </p>
                        {/* Socials */}
                        <div className="flex items-center gap-3">
                            {socials.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-cinnamon-800 text-cream-100/70 hover:bg-cinnamon-600 hover:text-white transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-sm font-semibold text-cream-100 uppercase tracking-widest mb-5">Quick Links</h4>
                        <ul className="space-y-3">
                            {footerLinks.quickLinks.map(({ label, to }) => (
                                <li key={label}>
                                    <Link
                                        to={to}
                                        className="text-sm text-cream-100/60 hover:text-cream-100 transition-colors hover:pl-1 duration-200 block"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer care */}
                    <div>
                        <h4 className="text-sm font-semibold text-cream-100 uppercase tracking-widest mb-5">Customer Care</h4>
                        <ul className="space-y-3">
                            {footerLinks.customerCare.map(({ label, to }) => (
                                <li key={label}>
                                    <Link
                                        to={to}
                                        className="text-sm text-cream-100/60 hover:text-cream-100 transition-colors hover:pl-1 duration-200 block"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-cream-100 uppercase tracking-widest mb-5">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-cinnamon-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-cream-100/50 mb-0.5">Email</p>
                                    <a href="mailto:hello@ceylone.com" className="text-sm text-cream-100/80 hover:text-cream-100 transition-colors">
                                        hello@ceylone.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-cinnamon-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-cream-100/50 mb-0.5">Phone</p>
                                    <a href="tel:+94771234567" className="text-sm text-cream-100/80 hover:text-cream-100 transition-colors">
                                        +94 77 123 4567
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-cinnamon-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-cream-100/50 mb-0.5">Location</p>
                                    <p className="text-sm text-cream-100/80">Galle, Sri Lanka 🇱🇰</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-cinnamon-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-cream-100/50 text-center">
                            © {new Date().getFullYear()} PURE GOLD Products. All rights reserved. Made with pride in Sri Lanka 🇱🇰
                        </p>
                        <div className="flex items-center gap-4">
                            <Link to="/privacy" className="text-xs text-cream-100/50 hover:text-cream-100/80 transition-colors">Privacy</Link>
                            <Link to="/terms" className="text-xs text-cream-100/50 hover:text-cream-100/80 transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
