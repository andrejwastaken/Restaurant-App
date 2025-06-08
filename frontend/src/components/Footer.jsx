function Footer() {
  return (
    <footer className="bg-white shadow-inner w-full vertical-align-bottom">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-2 text-center sm:text-left">
        <p>&copy; {new Date().getFullYear()} ФатиМаса. All rights reserved.</p>
        <p className="text-xs text-gray-400">Made with ❤️ in Macedonia!</p>
      </div>
    </footer>
  );
}

export default Footer;
