export const Footer = () => {
  return (
    <footer className="mt-12 bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🐉</span>
              <h3 className="text-xl font-bold text-amber-400">TibiaGG</h3>
            </div>
            <p className="text-gray-400 text-sm max-w-sm">
              Your ultimate Tibia gaming hub. Discover hunting places, quest
              guides, and character tools for all vocations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/hunting-places"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Hunting Places
                </a>
              </li>
              <li>
                <a
                  href="/quest-guides"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Quest Guides
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 TibiaGG. All rights reserved. • Made with ⚔️ for Tibia
            adventurers
          </div>
          <div className="text-gray-500 text-xs">
            TibiaGG is not affiliated with CipSoft GmbH. Tibia is a trademark of
            CipSoft GmbH.
          </div>
        </div>
      </div>
    </footer>
  );
};
