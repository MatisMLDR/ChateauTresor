-- Création de la vue pour les chasses non terminées
CREATE VIEW vue_chasses_non_terminees AS
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
WHERE date_fin IS NULL
   OR date_fin > CURRENT_TIMESTAMP;

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
