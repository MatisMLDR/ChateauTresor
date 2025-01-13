import React from 'react';

const Enigma: React.FC<{ setCurrentPage: (page: string) => void; enigmaNumber: number }> = ({
                                                                                              setCurrentPage,
                                                                                              enigmaNumber,
                                                                                            }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 p-4">
      <h1 className="text-2xl font-bold">Énigme n°{enigmaNumber}</h1>
      <p className="text-lg">Lorem ipsum dolor sit amet consectetur.</p>
      <button
        className="bg-secondary text-text px-6 py-3 rounded hover:bg-highlight"
        onClick={() => setCurrentPage('scan-qr-code')}
      >
        Scanner le QR Code
      </button>
      <button
        className="bg-secondary text-text px-6 py-3 rounded hover:bg-highlight"
        onClick={() => setCurrentPage('hint')}
      >
        Indice n°1
      </button>
    </div>
  );
};

export default Enigma;
