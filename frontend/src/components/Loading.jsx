function Loading({ children }) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500 mb-6"></div>

      <h5 className="text-xl font-semibold text-gray-700 mb-2">{children}</h5>
      <p className="text-gray-500">Please wait a moment.</p>
    </div>
  );
}

export default Loading;
