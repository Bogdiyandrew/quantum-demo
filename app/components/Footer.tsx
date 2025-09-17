import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-16">
      <div className="container mx-auto px-6 text-center text-gray-400 space-y-8">

        {/* Secțiunea de disclaimer */}
        <div className="max-w-3xl mx-auto text-xs border border-yellow-500/30 bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-yellow-400 mb-2 uppercase tracking-widest">ATENȚIE</h4>
          <p className="text-yellow-500">
            Acesta este un proiect demonstrativ pentru a evidenția abilitățile de design și dezvoltare. Nu reprezintă o aplicație reală și nu reflectă întregul potențial al serviciilor oferite de <a href="https://digitura.ro" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-300">digitura.ro</a>.
          </p>
        </div>

        {/* Conținutul principal al footer-ului */}
        <div>
          <Link href="/" className="text-2xl font-bold text-white flex items-center justify-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>Quantum</span>
          </Link>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Quantum Inc. All rights reserved.
          </p>
          <p className="text-sm mt-1 text-gray-500">
            Un demo creat cu mândrie pentru <a href="https://digitura.ro" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">digitura.ro</a>
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;