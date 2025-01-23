import React from 'react'
import Image from 'next/image' // Si vous utilisez Next.js

const Preview = ({ type = "participant" }: { type?: "participant" | "organisateur" }) => {
  // Données exemple - à remplacer par vos imports réels
  const participantPreview = [
    {
      title: "Découvrez des chasses passionnantes",
      text: "Parcourez notre catalogue de chasses au trésor...",
      image: "/chasses.png", // A REMPLACER AVEC PREVIEW EN GIF
      alt: "Marketplace de chasses au trésor"
    },
    {
      title: "Participer sur place à l'aide de votre smartphone",
      text: "Résolvez des énigmes et gagnez des récompenses...",
      image: "/jouer.png", // A REMPLACER AVEC PREVIEW EN GIF
      alt: "Chasse au trésor intéractive"
    },
    {
      title: "Dashboard de progression & classements",
      text: "Visualisez votre progression et comparez vos résultats...",
      image: "/profil_participant.png", // A REMPLACER AVEC PREVIEW EN GIF
      alt: "Tableau de bord participant"
    },
  ];

  const organisateurPreview = [
    {
      title: "Créez vos propres chasses",
      text: "Notre interface intuitive vous permet de créer des énigmes...",
      image:"/creer_chasse.png", // A REMPLACER AVEC PREVIEW EN GIF
      alt: "Éditeur de chasses"
    },
    {
      title: "Analytiques détaillées",
      text: "Suivez les performances de vos chasses avec des statistiques...",
      image:"/analytics.png", // A REMPLACER AVEC PREVIEW EN GIF
      alt: "Tableau d'analytiques"
    },
    {
      title: "Configurer votre équipe",
      text: "Ajoutez des membres à votre équipe et gérez leurs rôles...",
      image:"/equipes.png", // A REMPLACER AVEC PREVIEW EN GIF
      alt: "Gestion d'équipe"
    },
  ];

  const data = type === "participant" ? participantPreview : organisateurPreview;

  return (
    <section id="preview" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {data.map((item, index) => (
          <div 
            key={index}
            className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Partie Texte */}
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">{item.title}</h2>
              <p className="text-lg text-gray-600">{item.text}</p>
            </div>

            {/* Partie Image */}
            <div className="md:w-1/2 relative rounded-xl overflow-hidden shadow-lg">
              <Image
                src={item.image}
                alt={item.alt}
                width={800}
                height={450}
                className="w-full h-auto"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Preview