-- Création de la vue pour les chasses non terminées
CREATE OR REPLACE VIEW vue_chasses_valides AS
SELECT
   id_chasse,
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
FROM
   public.Chasse
WHERE
   date_fin > CURRENT_TIMESTAMP
   AND statut = 'Validée';

CREATE OR REPLACE VIEW vue_chasse_en_attente_de_validation AS
SELECT
   id_chasse,
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
FROM
   public.Chasse
WHERE
   statut = 'En attente de validation';

CREATE OR REPLACE VIEW vue_demandes_appartenance_equipe AS
SELECT
   ae.id_membre,
   ae.id_equipe,
   ae.date_appartenance,
   ae.statut,
   ae.date_demande,
   ae.message_demande,
   ae.role_equipe,
   p.nom,
   p.prenom,
   p.email
FROM
   public.Appartenance_Equipe AS ae
   JOIN public.Membre_equipe AS m ON ae.id_membre = m.id_membre
   JOIN public.Profiles AS p ON m.id_user = p.id
WHERE
   ae.statut = 'En attente de validation';

CREATE OR REPLACE VIEW vue_equipes_verifiees AS
SELECT
   id_equipe,
   nom,
   type,
   n_siret,
   id_taxes,
   site_web,
   adresse_postale,
   statut_verification,
   carte_identite_chef,
   telephone,
   description
FROM
   public.Equipe_Organisatrice
WHERE
   statut_verification = 'Vérifiée';