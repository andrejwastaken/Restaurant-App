function Footer() {
  return (
    <footer className="bg-gray-100 shadow-inner mt-10 w-full">
      <div className="w-max mx-auto px-4 py-6 flex flex-col sm:flex-row justify-center items-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} ФатиМаса. All rights reserved.</p>

        </div>
    </footer>
  );
}

export default Footer;
