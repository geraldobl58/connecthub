import Image from "next/image";

import { ForgotPassword } from "@/features/forgot-password/components/forgot-password";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main content container */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Card wrapper */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-10 space-y-8 border border-white/20">
          {/* Logo and Header */}
          <div className="space-y-3 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-linear-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Image
                  src="/assets/images/logo.svg"
                  width={48}
                  height={48}
                  alt="ConnectHub"
                  className="w-12 h-12"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ConnectHub
            </h1>
            <p className="text-gray-600 text-sm">
              Recupere sua senha em três etapas fáceis
            </p>
          </div>

          {/* Form Component */}
          <ForgotPassword />
        </div>

        {/* Trust badge */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-xs flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            100% Seguro e Criptografado
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
