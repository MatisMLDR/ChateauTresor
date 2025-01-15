
interface Indice {
  id_indice: string;
  contenu: string; // Contenu de l'indice
  degre_aide: number;
  id_enigme: string;
  ordre: number;
  type: string;
}

const IndiceDetails: React.FC<{ indice: Indice | undefined }> = ({ indice }) => {
  // Vérifier si l'indice est défini
  if (!indice) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-red-500">Aucun indice disponible.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Indice {indice.ordre}</h2>
      <p><strong>Contenu :</strong> {indice.contenu}</p>
      <p><strong>Degré d'aide :</strong> {indice.degre_aide}</p>
      <p><strong>Type :</strong> {indice.type}</p>
    </div>
  );
};

export default IndiceDetails;