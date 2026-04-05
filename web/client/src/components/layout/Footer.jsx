/**
 * Footer Component
 * Footer yang ditampilkan di semua halaman
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-petrolab-secondary text-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src="/petrolab_icon.jpg"
                                alt="Petrolab Logo"
                                className="h-10 w-10 object-contain bg-white rounded-full p-1"
                            />
                            <span className="text-lg font-bold">Petrolab</span>
                        </div>
                        <p className="text-sm text-gray-300">
                            Professional and reliable independent analysis laboratory serving industries across Indonesia and Southeast Asia.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                            <li><a href="/items" className="hover:text-white transition-colors">Items</a></li>
                            <li><a href="/profile" className="hover:text-white transition-colors">Profile</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold mb-4">Our Services</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>Laboratory Analysis</li>
                            <li>Product Certification</li>
                            <li>Laboratory Calibration</li>
                            <li>Consultant & Training</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Jakarta, Indonesia</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@petrolab.co.id</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+62 21 1234 5678</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; {currentYear} Petrolab. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;