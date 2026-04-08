import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { isAuthenticated, user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [animated, setAnimated] = useState({});

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Detect active section
            const sections = ['home', 'services', 'about', 'contact'];
            const scrollPos = window.scrollY + 100;
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                        setActiveSection(section);
                    }
                }
            }
        };

        // Animate elements on scroll
        const handleAnimate = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100;
                if (isVisible) {
                    el.classList.add('animated');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleAnimate);
        handleAnimate();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleAnimate);
        };
    }, []);

    const stats = [
        { value: '20+', label: 'Years Experience', icon: '🏆' },
        { value: '5000+', label: 'Companies Served', icon: '🏭' },
        { value: '24/7', label: 'Customer Support', icon: '💬' },
        { value: '100%', label: 'Satisfaction Rate', icon: '⭐' },
    ];

    const services = [
        { icon: '🔬', title: 'Laboratory Analysis', desc: 'Comprehensive testing for various industries', color: 'from-blue-500 to-cyan-500' },
        { icon: '📋', title: 'Product Certification', desc: 'LSPro certification for quality assurance', color: 'from-green-500 to-emerald-500' },
        { icon: '⚙️', title: 'Calibration Services', desc: 'Precise calibration for laboratory equipment', color: 'from-purple-500 to-pink-500' },
        { icon: '🎓', title: 'Consultant & Training', desc: 'Expert consultation and professional training', color: 'from-orange-500 to-red-500' },
    ];

    const certifications = [
        { title: 'ISO', subtitle: 'Certified Laboratory', bg: 'bg-gradient-to-br from-blue-500 to-blue-700' },
        { title: 'KAN', subtitle: 'Accredited', bg: 'bg-gradient-to-br from-green-500 to-green-700' },
        { title: '24/7', subtitle: 'Support Available', bg: 'bg-gradient-to-br from-yellow-500 to-orange-600' },
        { title: '100+', subtitle: 'Expert Team', bg: 'bg-gradient-to-br from-purple-500 to-pink-600' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Custom Cursor */}
            <div className="hidden lg:block fixed w-8 h-8 border-2 border-petrolab-primary rounded-full pointer-events-none z-50 transition-transform duration-100 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: 'var(--x, 0)', top: 'var(--y, 0)' }} />

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl py-3' : 'bg-transparent py-6'
                }`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-petrolab-primary rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                            <img
                                src="/petrolab_icon.jpg"
                                alt="Petrolab Logo"
                                className="relative h-12 w-12 object-contain rounded-full"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-petrolab-primary to-blue-600 bg-clip-text text-transparent">
                            Petrolab
                        </span>
                    </div>

                    <div className="hidden md:flex space-x-8">
                        {['home', 'services', 'about', 'contact'].map((item) => (
                            <a
                                key={item}
                                href={`#${item}`}
                                className={`relative text-gray-700 hover:text-petrolab-primary transition-all duration-300 font-medium group ${activeSection === item ? 'text-petrolab-primary' : ''
                                    }`}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-petrolab-primary transform transition-transform duration-300 ${activeSection === item ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`}></span>
                            </a>
                        ))}
                    </div>

                    <div className="flex space-x-4">
                        {isAuthenticated ? (
                            <Link
                                to="/dashboard"
                                className="px-6 py-2.5 bg-gradient-to-r from-petrolab-primary to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 text-petrolab-primary border-2 border-petrolab-primary rounded-xl hover:bg-petrolab-primary hover:text-white transition-all duration-300 font-semibold"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-gradient-to-r from-petrolab-primary to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-petrolab-primary rounded-full opacity-10 blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-petrolab-primary to-blue-600 rounded-full opacity-5 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="lg:w-1/2 text-center lg:text-left animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                            <div className="inline-block px-4 py-1.5 bg-petrolab-primary/10 rounded-full mb-6">
                                <span className="text-petrolab-primary font-semibold text-sm">🌟 Welcome to Petrolab</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                Professional & Reliable
                                <span className="bg-gradient-to-r from-petrolab-primary to-blue-600 bg-clip-text text-transparent"> Independent Analysis</span>
                                Laboratory
                            </h1>
                            <p className="text-gray-600 text-lg mt-6 mb-8 leading-relaxed">
                                Petrolab provides world-class laboratory services for energy, manufacturing,
                                oil, mining, and transportation industries across Indonesia and Southeast Asia.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {!isAuthenticated && (
                                    <Link
                                        to="/register"
                                        className="group px-8 py-3.5 bg-gradient-to-r from-petrolab-primary to-blue-600 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                                    >
                                        Get Started
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                )}
                                <a
                                    href="#services"
                                    className="px-8 py-3.5 border-2 border-petrolab-primary text-petrolab-primary rounded-xl hover:bg-petrolab-primary hover:text-white transition-all duration-300 font-semibold text-center"
                                >
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div className="lg:w-1/2 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-petrolab-primary to-blue-600 rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
                                <img
                                    src="/petrolab_icon.jpg"
                                    alt="Laboratory"
                                    className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Petrolab' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <a href="#services" className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1.5 h-3 bg-petrolab-primary rounded-full mt-2 animate-ping"></div>
                    </a>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-petrolab-primary via-blue-700 to-petrolab-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center text-white animate-on-scroll opacity-0 translate-y-10 transition-all duration-700" style={{ transitionDelay: `${index * 100}ms` }}>
                                <div className="text-5xl mb-3">{stat.icon}</div>
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-sm opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                        <span className="text-petrolab-primary font-semibold text-sm uppercase tracking-wider">What We Do</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                            Our Premium Services
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-petrolab-primary to-blue-600 mx-auto rounded-full"></div>
                        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                            We provide world-class laboratory services tailored to your specific industry requirements
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="group animate-on-scroll opacity-0 translate-y-10 transition-all duration-700" style={{ transitionDelay: `${index * 100}ms` }}>
                                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                                    <p className="text-gray-600">{service.desc}</p>
                                    <div className="mt-4">
                                        <div className={`w-12 h-1 bg-gradient-to-r ${service.color} rounded-full group-hover:w-24 transition-all duration-300`}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 animate-on-scroll opacity-0 translate-x-[-30px] transition-all duration-700">
                            <div className="relative">
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-petrolab-primary/10 rounded-full"></div>
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/10 rounded-full"></div>
                                <img
                                    src="/petrolab_icon.jpg"
                                    alt="About Petrolab"
                                    className="relative w-full rounded-2xl shadow-xl"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400?text=Petrolab' }}
                                />
                            </div>
                        </div>
                        <div className="lg:w-1/2 animate-on-scroll opacity-0 translate-x-[30px] transition-all duration-700">
                            <span className="text-petrolab-primary font-semibold text-sm uppercase tracking-wider">About Us</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
                                Who We Are
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                PETROLAB Services is a fast-growing analytical laboratory with clients in various
                                industrial sectors including energy, manufacturing, oil, mining, transportation,
                                and lube-oil blending plants.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                We are supported by a team of dedicated experts with years of experience both in
                                the lab and on the field. We are highly competent, professional, and backed with
                                exceptionally reliable Laboratory Information System.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {certifications.map((cert, idx) => (
                                    <div key={idx} className={`${cert.bg} p-4 rounded-xl text-center text-white transform hover:scale-105 transition duration-300 shadow-lg`}>
                                        <div className="text-2xl font-bold">{cert.title}</div>
                                        <div className="text-sm opacity-90">{cert.subtitle}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-petrolab-primary to-blue-700">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-white text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust Petrolab for their laboratory needs
                        </p>
                        {!isAuthenticated ? (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/register"
                                    className="group px-8 py-3.5 bg-white text-petrolab-primary rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold inline-flex items-center gap-2"
                                >
                                    Create Free Account
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-3.5 border-2 border-white text-white rounded-xl hover:bg-white hover:text-petrolab-primary transition-all duration-300 font-semibold"
                                >
                                    Sign In
                                </Link>
                            </div>
                        ) : (
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-petrolab-primary rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold"
                            >
                                Go to Dashboard
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                        <span className="text-petrolab-primary font-semibold text-sm uppercase tracking-wider">Contact Us</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                            Get In Touch
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-petrolab-primary to-blue-600 mx-auto rounded-full"></div>
                        <p className="text-gray-600 mt-6">Reach out to our team for any inquiries</p>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
                        <div className="lg:w-1/2 space-y-6">
                            {[
                                { icon: '📧', title: 'Email', value: 'info@petrolab.co.id', desc: 'Send us an email anytime' },
                                { icon: '📞', title: 'Phone', value: '+62 21 1234 5678', desc: 'Mon-Fri from 8am to 5pm' },
                                { icon: '📍', title: 'Address', value: 'Jakarta, Indonesia', desc: 'Visit our office' },
                            ].map((contact, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 group">
                                    <div className="text-3xl group-hover:scale-110 transition">{contact.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{contact.title}</h3>
                                        <p className="text-gray-600">{contact.value}</p>
                                        <p className="text-sm text-gray-400">{contact.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:w-1/2">
                            <form className="space-y-4 bg-white p-6 rounded-2xl shadow-xl">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-petrolab-primary focus:border-transparent transition"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-petrolab-primary focus:border-transparent transition"
                                />
                                <textarea
                                    rows="4"
                                    placeholder="Your Message"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-petrolab-primary focus:border-transparent transition resize-none"
                                ></textarea>
                                <button className="w-full px-6 py-3 bg-gradient-to-r from-petrolab-primary to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <img
                                    src="/petrolab_icon.jpg"
                                    alt="Logo"
                                    className="h-12 w-12 object-contain rounded-full bg-white/10 p-1"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                />
                                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Petrolab
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Professional and reliable independent analysis laboratory serving industries across Indonesia and Southeast Asia.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                                <li><a href="#about" className="hover:text-white transition">About</a></li>
                                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Our Services</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>Laboratory Analysis</li>
                                <li>Product Certification</li>
                                <li>Calibration Services</li>
                                <li>Consultant & Training</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
                            <div className="flex space-x-3">
                                {['📘', '🐦', '📷', '💼'].map((icon, idx) => (
                                    <a key={idx} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-petrolab-primary transition-all duration-300 hover:scale-110">
                                        <span className="text-xl">{icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} Petrolab. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .animate-on-scroll {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.7s ease-out;
                }
                .animate-on-scroll.animated {
                    opacity: 1;
                    transform: translateY(0);
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Home;