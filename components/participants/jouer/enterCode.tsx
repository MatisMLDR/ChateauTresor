import React from 'react';

const EnterCode: React.FC<{
  code: string;
  setCode: (code: string) => void;
  validCode: string;
  setCurrentPage: (page: string) => void;
  onCodeValid: () => void;
}> = ({ code, setCode, validCode, setCurrentPage, onCodeValid }) => {
  const handleValidate = () => {
    if (code === validCode) {
      onCodeValid();
    } else {
      alert('Code incorrect, essayez encore !');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 p-4">
      <h1 className="text-2xl font-bold">Saisir le code</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="px-4 py-2 border rounded w-64 text-black"
        placeholder="Entrez le code ici"
      />
      <button
        className="bg-secondary text-text px-6 py-3 rounded hover:bg-highlight"
        onClick={handleValidate}
      >
        Valider
      </button>
      <p className="text-lg">
        Vous préférez utiliser votre caméra ?{' '}
        <a
          className="text-highlight underline cursor-pointer"
          onClick={() => setCurrentPage('scan-qr-code')}
        >
          Scanner le code
        </a>
      </p>
    </div>
  );
};

export default EnterCode;
