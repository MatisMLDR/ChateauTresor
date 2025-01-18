-- Création de la vue pour les chasses non terminées
CREATE VIEW vue_chasses_valides AS
SELECT id_chasse,
       titre,
       capacite,
       description,
       age_requis,
       image,
       date_creation,
       date_modification,
       date_debut,
       date_fin,
       prix,
       difficulte,
       duree_estime,
       theme,
       statut,
       id_chateau,
       id_equipe
FROM public.Chasse
WHERE date_fin > CURRENT_TIMESTAMP
   AND statut = 'Validée';

CREATE VIEW vue_chasse_en_attente_de_validation AS
SELECT id_chasse,
       titre,
       capacite,
       description,
       age_requis,
       image,
       date_creation,
       date_modification,
       date_debut,
       date_fin,
       prix,
       difficulte,
       duree_estime,
       theme,
       statut,
       id_chateau,
       id_equipe
FROM public.Chasse
WHERE statut = 'En attente de validation';

CREATE VIEW vue_demandes_appartenance_equipe AS
SELECT id_demande,
       date_demande,
       statut,
       id_equipe,
       id_utilisateur
FROM public.Appartenance_Equipe
WHERE statut = 'En attente de validation';
