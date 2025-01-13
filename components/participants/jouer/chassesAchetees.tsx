import { useEffect, useState } from 'react';

const ChassesAchetees = ({ participantId, setSelectedChasse }) => {
  const [chasses, setChasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const response = await fetch(`/api/participants/chasse?id_participant=${participantId}`);
        const data = await response.json();
        if (response.ok) {
          setChasses(data);
        } else {
          console.error('Erreur :', data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des chasses :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChasses();
  }, [participantId]);

  if (loading) return <p>Chargement...</p>;

  if (chasses.length === 0) return <p>Aucune chasse disponible.</p>;

  return (
    <div>
      <h2>Chasses achetées</h2>
      <ul>
        {chasses.map((chasse) => (
          <li key={chasse.id_chasse}>
            <div>
              <h3>{chasse.titre}</h3>
              <p>{chasse.description}</p>
              <button onClick={() => setSelectedChasse(chasse)}>Jouer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChassesAchetees;
