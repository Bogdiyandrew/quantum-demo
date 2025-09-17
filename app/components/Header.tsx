import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-lg">
      <nav className="container mx-auto flex items-center justify-between p-4 px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <span>Quantum</span>
        </Link>
        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm text-gray-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
        </div>
        {/* CTA Button */}
        <Link 
            href="/get-started"
            className="hidden md:block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
};

export default Header;