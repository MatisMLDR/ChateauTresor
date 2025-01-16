import React from 'react';
import Link from 'next/link';

const PopUpChateau: React.FC<{ chateau: any }> = ({ chateau }) => {
  return (
    <div style={{ width: '100%', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
      {/* Section principale du château */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          borderBottom: '1px solid #ddd',
          marginBottom: '16px',
          paddingBottom: '16px',
        }}
      >
        {/* Texte à gauche */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{chateau.nom}</h2>
          <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#666' }}>{chateau.description}</p>
        </div>

        {/* Image à droite */}
        {chateau.image && (
          <div style={{ marginLeft: '16px' }}>
            <img
              src={chateau.image}
              alt={chateau.nom}
              style={{
                width: '150px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />
          </div>
        )}
      </div>

      {/* Bouton pour accéder à la page du château */}
      <div style={{ marginBottom: '16px' }}>
        <Link href={`/participants/dashboard/chateaux/${chateau.id_chateau}`}>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Voir la page du château
          </button>
        </Link>
      </div>

      {/* Liste des chasses associées */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
          Chasses disponibles
        </h3>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {chateau.chasses && chateau.chasses.length > 0 ? (
            chateau.chasses.map((chasse: any) => (
              <li
                key={chasse.id_chasse}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                }}
              >
                {/* Image de la chasse */}
                {chasse.image && (
                  <img
                    src={chasse.image}
                    alt={chasse.titre}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginRight: '16px',
                    }}
                  />
                )}

                {/* Détails de la chasse */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {chasse.titre}
                  </h4>
                  <p style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>
                    {chasse.description}
                  </p>
                  <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                    Difficulté : {chasse.difficulte} / 3 | Prix : {chasse.prix} €
                  </p>
                  <Link href={`/participants/dashboard/chasses/${chasse.id_chasse}`}>
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Voir plus
                    </button>
                  </Link>
                </div>
              </li>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: '#999' }}>Aucune chasse disponible pour ce château.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PopUpChateau;