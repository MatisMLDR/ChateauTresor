import React from 'react';

const ScanQRCode: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-2xl font-bold">Scanner le QR Code</h1>
      <div className="w-48 h-48 bg-gray-300 rounded">[QR Code]</div>
      <p className="text-lg">
        Vous n'avez pas de caméra ?{' '}
        <a
          className="text-highlight underline cursor-pointer"
          onClick={() => setCurrentPage('enter-code')}
        >
          Saisir le code
        </a>
      </p>
    </div>
  );
};

export default ScanQRCode;
