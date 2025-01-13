import { useEffect, useState } from 'react';

const Enigmes = ({ chasseId }) => {
  const [enigmes, setEnigmes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnigmes = async () => {
      try {
        const response = await fetch(`/api/enigmes/chasse?id_chasse=${chasseId}`);
        const data = await response.json();
        if (response.ok) {
          setEnigmes(data);
        } else {
          console.error('Erreur :', data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des énigmes :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnigmes();
  }, [chasseId]);

  if (loading) return <p>Chargement des énigmes...</p>;

  if (enigmes.length === 0) return <p>Aucune énigme trouvée pour cette chasse.</p>;

  return (
    <div>
      <h2>Énigmes</h2>
      <ul>
        {enigmes.map((enigme) => (
          <li key={enigme.id_enigme}>
            <h3>{enigme.titre}</h3>
            <p>{enigme.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Enigmes;
