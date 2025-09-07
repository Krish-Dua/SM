import React from 'react';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#101014]">
      <div className="backdrop-blur-md bg-black/40 rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center animate-fade-in-slow">
        <div className="animate-bounce mb-6">
          <svg width="90" height="90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#3b3b4f" fillOpacity="0.25" />
            <path d="M12 8v4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1.2" fill="#60a5fa" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg animate-fade-in mb-2">Oops!</h1>
        <p className="text-lg text-gray-300 mb-8 animate-fade-in-slow text-center max-w-md">
          Something went wrong or the page you are looking for does not exist.<br />
          Please check the URL or return to the homepage.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-full shadow-lg font-semibold text-lg hover:scale-105 transition-transform duration-200 animate-fade-in-slow border border-blue-900/40"
        >
          Go Home
        </a>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in-slow {
          animation: fade-in 1.5s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
