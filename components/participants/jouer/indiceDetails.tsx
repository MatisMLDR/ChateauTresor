import { UUID } from 'crypto';

interface Indice {
  id_indice: UUID;
  contenu: string;
  degre_aide: number;
  id_enigme: string;
  ordre: number;
  type: string;
}

const IndiceDetails: React.FC<{ indice: Indice | undefined }> = ({ indice }) => {
  if (!indice) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-red-500">Aucun indice disponible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Indice {indice.ordre}</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p><strong>Contenu :</strong> {indice.contenu}</p>
      </div>
    </div>
  );
};

export default IndiceDetails;