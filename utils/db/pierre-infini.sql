-- Supprimer les vues si elles existent
DROP VIEW IF EXISTS vue_chasses_valides, 
                    vue_chasse_en_attente_de_validation, 
                    vue_demandes_appartenance_equipe,
                    vue_equipes_verifiees CASCADE;

DROP TABLE IF EXISTS public.Chateau,
    public.Equipe_Organisatrice,
    public.Membre_equipe,
    public.Appartenance_Equipe,
    public.Invitations_Equipe,
    public.Participant,
    public.Chasse,
    public.Participation,
    public.Avis,
    public.Recompense,
    public.Enigme,
    public.Indice,
    public.Haut_fait,
    public.Profiles,
    public.proprietaire_chateau,
    public.enigme_participant,
    public.indice_participant,
    public.haut_fait_participant CASCADE;

-- Supprimer les triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS public.handle_new_user;


CREATE
EXTENSION IF NOT EXISTS "pgcrypto";

-- Table users in schema public
CREATE TABLE public.profiles
(
    id            uuid references auth.users on delete cascade not null primary key,
    username      text UNIQUE                                  NOT NULL,
    updated_at    timestamp with time zone,
    email         text UNIQUE                                  NOT NULL,
    birthday      date,
    email_confirm boolean                                               DEFAULT false,
    nom           text                                                  default 'Non spécifié',
    prenom        text                                                  default 'Non spécifié',
    adresse       text                                                  default 'Non spécifiée',
    ville         text                                                  default 'Non spécifiée',
    code_postal   text                                                  default 'Non spécifié',
    stripe_id     text,
    plan          text                                         NOT NULL DEFAULT 'none'
);

alter table profiles
    enable row level security;

create
policy "Public profiles are viewable by everyone." on profiles
  for
select using (true);

create
policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create
policy "Users can update own profile." on profiles
  for
update using ((select auth.uid()) = id);


-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create
OR REPLACE function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
insert into public.profiles (
  id, 
  email, 
  username,
  nom,
  prenom,
  adresse,
  ville,
  code_postal
)
values (
  new.id, 
  new.email, 
  new.raw_user_meta_data ->> 'username', 
  new.raw_user_meta_data ->> 'nom', 
  new.raw_user_meta_data ->> 'prenom', 
  new.raw_user_meta_data ->> 'adresse', 
  new.raw_user_meta_data ->> 'ville', 
  new.raw_user_meta_data ->> 'code_postal'
);
return new;
end;
$$
language plpgsql security definer;

create
OR REPLACE trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Table Proprietaire_Chateau
CREATE TABLE public.Proprietaire_Chateau
(
    id_proprietaire UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    id_user         UUID             NOT NULL REFERENCES auth.users ON DELETE CASCADE
);

-- Table Chateau
CREATE TABLE public.Chateau
(
    id_chateau      UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    nom             VARCHAR(255)              DEFAULT 'Château inconnu',
    adresse_postale VARCHAR(255)              DEFAULT 'Non spécifiée',
    localisation    VARCHAR(255)              DEFAULT 'Non spécifiée',
    capacite        INT                       DEFAULT 0,
    prix_location   NUMERIC(10, 2)            DEFAULT 0.00,
    telephone       VARCHAR(20)               DEFAULT NULL,
    description     TEXT                      DEFAULT 'Pas de description',
    image           VARCHAR(255)              DEFAULT NULL,
    site_web        VARCHAR(255)              DEFAULT NULL,
    id_proprietaire UUID             NOT NULL REFERENCES Proprietaire_Chateau (id_proprietaire) ON DELETE CASCADE
);

-- Table Equipe_Organisatrice
CREATE TABLE public.Equipe_Organisatrice
(
    id_equipe       UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    nom             VARCHAR(255) UNIQUE NOT NULL,
    type            VARCHAR(255) NOT NULL DEFAULT 'Société' CHECK (
        type IN ('Société', 'Particulier')
        ),
    n_siret         VARCHAR(255) DEFAULT NULL,
    id_taxes        VARCHAR(255) DEFAULT NULL,
    site_web        VARCHAR(255) DEFAULT NULL,
    adresse_postale VARCHAR(255) DEFAULT 'Non spécifiée',
    statut_verification VARCHAR(255) NOT NULL DEFAULT 'En attente de vérification'
    CHECK (statut_verification IN ('En attente de vérification', 'Vérifiée', 'Refusée')),
    carte_identite_chef VARCHAR(255) DEFAULT NULL,
    telephone       VARCHAR(20) DEFAULT NULL,
    description     TEXT DEFAULT 'Pas de description'
);

-- Table Membre_equipe
CREATE TABLE public.Membre_equipe
(
    id_membre      UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    id_user        UUID             NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE
);

-- Table Appartenance_Equipe
CREATE TABLE public.Appartenance_Equipe
(
    id_membre         UUID NOT NULL,
    id_equipe         UUID NOT NULL,
    date_appartenance DATE DEFAULT CURRENT_DATE,
    statut            VARCHAR(50)         NOT NULL DEFAULT 'En attente de validation' CHECK (
        statut IN ('En attente de validation', 'Validé', 'Refusé')
        ),
    date_demande      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_demande   TEXT DEFAULT 'Pas de message',
    role_equipe    VARCHAR(255)              DEFAULT 'Invité' CHECK (
        role_equipe IN ('Invité', 'Créateur', 'Administrateur', 'Modérateur', 'Organisateur', 'Trésorier', 'Autre')
        ),
    PRIMARY KEY (id_membre, id_equipe),
    FOREIGN KEY (id_membre) REFERENCES Membre_equipe (id_membre) ON DELETE CASCADE,
    FOREIGN KEY (id_equipe) REFERENCES Equipe_Organisatrice (id_equipe) ON DELETE CASCADE
);

CREATE TABLE public.Invitations_Equipe
(
    id_invitation  UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    id_equipe      UUID NOT NULL REFERENCES Equipe_Organisatrice (id_equipe) ON DELETE CASCADE,
    email_invite   VARCHAR(255) NOT NULL,
    statut         VARCHAR(50) NOT NULL DEFAULT 'Envoyée'
    CHECK (statut IN ('Envoyée', 'Acceptée', 'Refusée')),
    date_invitation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Participant
CREATE TABLE public.Participant
(
    id_participant UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    id_user        UUID             NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE
);

-- Table Chasse
CREATE TABLE public.Chasse
(
    id_chasse         UUID PRIMARY KEY    NOT NULL DEFAULT uuid_generate_v4(),
    titre             VARCHAR(255) UNIQUE NOT NULL,
    capacite          INT                          DEFAULT 0,
    description       TEXT                         DEFAULT 'Pas de description',
    age_requis        INT                          DEFAULT 0,
    image             VARCHAR(255)                 DEFAULT NULL,
    date_creation     TIMESTAMP                    DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP                    DEFAULT CURRENT_TIMESTAMP,
    date_debut        TIMESTAMP                    DEFAULT NULL,
    date_fin          TIMESTAMP                    DEFAULT NULL,
    prix              NUMERIC(10, 2)               DEFAULT 0.00,
    difficulte        INT                          DEFAULT 1 CHECK (
        difficulte BETWEEN 1
            AND 3
        ),
    duree_estime INTERVAL DEFAULT INTERVAL '00:00:00',
    theme             VARCHAR(255)                 DEFAULT 'Aucun thème',
    statut            VARCHAR(50)         NOT NULL DEFAULT 'En attente de validation' CHECK (
        statut IN ('En attente de validation', 'Validée', 'En cours', 'Finie')
        ),
    id_chateau        UUID                NOT NULL REFERENCES Chateau (id_chateau) ON DELETE CASCADE,
    id_equipe         UUID                NOT NULL REFERENCES Equipe_Organisatrice (id_equipe) ON DELETE CASCADE
);

-- Table Participation
CREATE TABLE public.Participation
(
    id_participant      UUID NOT NULL,
    id_chasse           UUID NOT NULL,
    duree_totale INTERVAL DEFAULT INTERVAL '00:00:00',
    score               INT       DEFAULT 0,
    jour                DATE NOT NULL,
    nb_enigmes_resolues INT       DEFAULT 0,
    date_achat          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    est_terminee        BOOLEAN   DEFAULT FALSE,
    PRIMARY KEY (id_participant, id_chasse, jour),
    FOREIGN KEY (id_participant) REFERENCES Participant (id_participant) ON DELETE CASCADE,
    FOREIGN KEY (id_chasse) REFERENCES Chasse (id_chasse) ON DELETE CASCADE
);

-- Table Avis
CREATE TABLE public.Avis
(
    id_avis           UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    note              INT                       DEFAULT 0,
    titre             VARCHAR(255)              DEFAULT 'Sans titre',
    description       TEXT                      DEFAULT 'Pas de description',
    nb_likes          INT                       DEFAULT 0,
    date_modification TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP,
    id_participant    UUID             NOT NULL REFERENCES Participant (id_participant) ON DELETE CASCADE,
    id_chasse         UUID             NOT NULL REFERENCES Chasse (id_chasse) ON DELETE CASCADE
);

-- Table Recompense
CREATE TABLE public.Recompense
(
    id_recompense     UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    nom               VARCHAR(255)              DEFAULT 'Nouvelle Récompense',
    description       TEXT                      DEFAULT 'Pas de description',
    type              VARCHAR(255)              DEFAULT 'Générique',
    valeur            NUMERIC(10, 2)            DEFAULT 0.00,
    quantite_dispo    INT                       DEFAULT 0,
    prix_reel         NUMERIC(10, 2)            DEFAULT 0.00,
    image             VARCHAR(255)              DEFAULT NULL,
    date_modification TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP,
    id_chasse         UUID             NOT NULL REFERENCES Chasse (id_chasse) ON DELETE CASCADE
);

-- Table Enigme
CREATE TABLE public.Enigme
(
    id_enigme           UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre               VARCHAR(255)              DEFAULT 'Nouvelle Énigme',
    description         TEXT                      DEFAULT 'Pas de description',
    ordre               INT                       DEFAULT 1,
    degre_difficulte    INT                       DEFAULT 1 CHECK (degre_difficulte BETWEEN 1 AND 3),
    temps_max INTERVAL DEFAULT INTERVAL '00:30:00',
    code_reponse        VARCHAR(255)              DEFAULT NULL,
    endroit_qrcode      VARCHAR(255)              DEFAULT NULL,
    description_reponse TEXT                      DEFAULT 'Pas de description',
    image_reponse       VARCHAR(255)              DEFAULT NULL,
    id_chasse           UUID NOT NULL REFERENCES Chasse (id_chasse) ON DELETE CASCADE
);

-- Table Enigme_Participant
CREATE TABLE public.Enigme_Participant
(
    id_enigme       UUID NOT NULL,
    id_participant  UUID NOT NULL,
    est_resolue     BOOLEAN   DEFAULT FALSE,
    duree           REAL      DEFAULT 0.00,
    date_resolution TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_enigme, id_participant),
    FOREIGN KEY (id_enigme) REFERENCES Enigme (id_enigme) ON DELETE CASCADE,
    FOREIGN KEY (id_participant) REFERENCES Participant (id_participant) ON DELETE CASCADE
);

-- Table Indice
CREATE TABLE public.Indice
(
    id_indice  UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    contenu    TEXT                      DEFAULT 'Pas de contenu',
    ordre      INT                       DEFAULT 1,
    degre_aide INT                       DEFAULT 1 CHECK (
        degre_aide BETWEEN 1
            AND 5
        ),
    type       text                      DEFAULT 'text' CHECK (
        type IN ('text', 'image', 'son')
        ),
    id_enigme  UUID             NOT NULL REFERENCES Enigme (id_enigme) ON DELETE CASCADE
);

-- Table Indice_Participant
CREATE TABLE public.Indice_Participant
(
    id_indice        UUID NOT NULL,
    id_participant   UUID NOT NULL,
    est_decouvert    BOOLEAN   DEFAULT FALSE,
    date_utilisation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_indice, id_participant),
    FOREIGN KEY (id_indice) REFERENCES Indice (id_indice) ON DELETE CASCADE,
    FOREIGN KEY (id_participant) REFERENCES Participant (id_participant) ON DELETE CASCADE
);

-- Table Haut_Fait
CREATE TABLE public.Haut_Fait
(
    id_haut_fait UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    titre        VARCHAR(255)              DEFAULT 'Nouveau Haut Fait',
    description  TEXT                      DEFAULT 'Pas de description',
    conditions   TEXT                      DEFAULT 'Pas de conditions',
    image_badge  VARCHAR(255)              DEFAULT NULL,
    date         DATE                      DEFAULT CURRENT_DATE
);

-- Table Haut_Fait_Participant
CREATE TABLE public.Haut_Fait_Participant
(
    id_haut_fait     UUID NOT NULL,
    id_participant   UUID NOT NULL,
    est_acquis       BOOLEAN   DEFAULT FALSE,
    date_acquisition TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_haut_fait, id_participant),
    FOREIGN KEY (id_haut_fait) REFERENCES Haut_Fait (id_haut_fait) ON DELETE CASCADE,
    FOREIGN KEY (id_participant) REFERENCES Participant (id_participant) ON DELETE CASCADE
);

-- Indexation des tables
CREATE INDEX idx_profiles_email ON profiles (email);
CREATE INDEX idx_chateau_nom ON Chateau (nom);
CREATE INDEX idx_chateau_localisation ON Chateau (localisation);
CREATE INDEX idx_equipe_nom ON Equipe_Organisatrice (nom);
CREATE INDEX idx_profiles_username ON profiles (username);
CREATE INDEX idx_chasse_titre ON Chasse (titre);
CREATE INDEX idx_chasse_theme ON Chasse (theme);
CREATE INDEX idx_chasse_statut ON Chasse (statut);

-- Triggers pour les dates de modification
CREATE
OR REPLACE FUNCTION update_modification_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date_modification
= CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Exemple : Appliquer aux chasses
CREATE
OR REPLACE TRIGGER update_chasse_modification_date
  BEFORE
UPDATE ON Chasse
    FOR EACH ROW
    EXECUTE FUNCTION update_modification_date();

-- Appliquer le trigger à la table Avis
CREATE
OR REPLACE TRIGGER update_avis_modification_date
  BEFORE
UPDATE ON Avis
    FOR EACH ROW
    EXECUTE FUNCTION update_modification_date();

-- Appliquer le trigger à la table Recompense
CREATE
OR REPLACE TRIGGER update_recompense_modification_date
  BEFORE
UPDATE ON Recompense
    FOR EACH ROW
    EXECUTE FUNCTION update_modification_date();

-- Insert data into profiles
INSERT INTO public.profiles (id, username, updated_at, email, birthday, email_confirm, nom, adresse, ville, code_postal,
                             stripe_id, plan, prenom)
VALUES ('b302ddb0-c4b4-42d8-8956-00bcb2c0589e', 'ParticipantTest', null, 'testparticipant@chateautresor.com', null,
        'true', 'PARTICIPANT', '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'Participant'),
       ('bfdc30a0-7e79-4037-9024-184f814cb57a', 'ProprietaireTest', null, 'tesproprietairechateau@chateautresor.com',
        null, 'true', 'PROPRIETAIRE', '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'Proprietaire'),
       ('12b02e4a-34a8-4a83-838e-6206b201e948', 'OrganisateurTest', null, 'testorganisateur@chateautresor.com', null,
        'true', 'ORGANISATEUR', '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'Organisateur'),
       ('a27901fd-3c67-4891-b7ac-55dd04a2f122', 'MembreEquipeTest', null, 'testmembreequipe@chateautresor.com', null,
        'true', 'MEMBRE', '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'Membre'),
       ('16be6621-2b7e-4719-8937-ca30a4b9e3f3', 'Simon', null, 'simonzeru08@gmail.com', null, 'false', 'ZERU',
        '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'Simon'),
       ('4d7acb04-c25a-4d9f-8759-198d3fc80153', 'Rahim', null, 'rahim.boughendjour@gmail.com', null, 'false',
        'BOUGHENDJOUR', '2 Pl. Doyen Gosse', 'Grenoble', '38000', 'cus_RXiLEp77Wa0ndo', 'Standard', 'Rahim'),
       ('514e8181-1f82-4f81-8c16-00bf216d3b0a', 'Paul-ML', null, 'paul.moncenix-larue@gmail.com', null, 'false',
        'MONCENIX-LARUE', '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'Paul'),
       ('5eae781d-4d1d-4551-8d42-0349fba17678', 'Matis', null, 'matismld38@gmail.com', null, 'false', 'MALANDRINO',
        '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'Matis'),
       ('82fac1a4-bcb2-4b1b-8f1d-c0d0c04310dc', 'ChateauTresor', null, 'chateautresor@gmail.com', null, 'false',
        'CHATEAU TRESOR', '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'CHATEAU TRESOR'),
       ('d07d6711-4a1c-48b6-ab23-a726ae0c5586', 'SuperAdmin', null, 'superadmin@chateautresor.fr', null, 'false',
        'SUPERADMIN', '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'SUPERADMIN'),
       ('d566eb81-3bf9-4470-a89c-30ea8da57087', 'Paul', null, 'paul.moncenix@gmail.com', null, 'false',
        'MONCENIX-LARUE', '2 Pl. Doyen Gosse', 'Grenoble', '38000', null, 'Standard', 'Paul'),
       ('e74e5007-b174-4c89-a439-d59d3d63e926', 'Yvan', null, 'yvan.d-ettorre@etu.univ-grenoble-alpes.fr', null,
        'false', 'D''ETTORRE', '2 Pl. Doyen Gosse', 'Grenoble', '38000', 'cus_RY00lPy1E9anl3', 'Standard',
        'Yvan') ON CONFLICT (id) DO NOTHING;

-- Insert data into Proprietaire_Chateau
INSERT INTO public.Proprietaire_Chateau (id_proprietaire, id_user)
VALUES ('530a3302-4d03-49c0-a262-a72b3d434da9',
        'bfdc30a0-7e79-4037-9024-184f814cb57a') ON CONFLICT (id_proprietaire) DO NOTHING;

-- Insert data into Chateau
INSERT INTO public.Chateau (id_chateau, nom, adresse_postale, localisation, capacite, prix_location, telephone,
                            description, image, site_web, id_proprietaire)
VALUES ('63e923ce-db26-4024-90cb-ff43eccfdbcb', 'IUT 2', ' 2 Place du Doyen Gosse', '45.191841, 5.716785', '1000',
        '1.00', '04 76 28 45 09', 'Pour apprendre à recréer CHATEAUTRESOR',
        'https://cdn-s-www.ledauphine.com/images/6BD74FC8-7546-4962-A9D4-F0B5D539A191/FB1200/photo-1580471774.jpg',
        'https://iut2.univ-grenoble-alpes.fr/', '530a3302-4d03-49c0-a262-a72b3d434da9'),
       ('2aab1306-2875-426c-b0d3-f440f05fa8b8', 'Château de Chambord', 'Château, 41250 Chambord, France',
        '47.616833, 1.516992', '1000', '10000.00', '+33 2 54 50 40 00',
        'Le Château de Chambord est un joyau de la Renaissance française. Construit au XVIᵉ siècle sous François Ier,il est célèbre pour son architecture unique, son escalier à double révolution et ses vastes jardins.',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chambord_Castle_Northwest_facade.jpg/2880px-Chambord_Castle_Northwest_facade.jpg',
        'https://www.chambord.org/', '530a3302-4d03-49c0-a262-a72b3d434da9'),
       ('909c1f3e-19cf-4ddc-a26b-f0c7dde8b9cd', 'Château de Chenonceau',
        'Château de Chenonceau, 37150 Chenonceaux, France', '47.324406, 1.070545', '0', '0.00', '+33 2 47 23 90 07',
        'Le Château de Chenonceau, surnommé le Château des Dames, est connu pour son élégance architecturale enjambant la rivière Cher. Son histoire est marquée par des figures féminines telles que Diane de Poitiers et Catherine de Médicis.',
        'https://fr.wikipedia.org/wiki/Ch%C3%A2teau_de_Chenonceau#/media/Fichier:Chenonceau-20050320.jpg',
        'https://www.chenonceau.com/', '530a3302-4d03-49c0-a262-a72b3d434da9'),
       ('509a1015-d989-4382-8d27-ff391c5367d9', 'Château d’Amboise',
        'Montée de l''Émir Abd-el-Kader, 37400 Amboise, France', '47.413780, 0.987703', '0', '0.00',
        '+33 2 47 57 00 98',
        'Le Château d’Amboise est un symbole de la Renaissance française. Résidence royale au XVᵉ et XVIᵉ siècles, il offre une vue imprenable sur la Loire et abrite la tombe présumée de Léonard de Vinci.',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Ch%C3%A2teau_et_tour_des_Minimes_%28Amboise%29.jpg/2560px-Ch%C3%A2teau_et_tour_des_Minimes_%28Amboise%29.jpg',
        'https://www.chateau-amboise.com/', '530a3302-4d03-49c0-a262-a72b3d434da9') ON CONFLICT (id_chateau) DO NOTHING;


-- Insert data into Equipe_Organisatrice
INSERT INTO public.Equipe_Organisatrice (id_equipe, nom, type, n_siret, id_taxes, site_web, adresse_postale,
                                         telephone, statut_verification)
VALUES ('5da884fa-d39c-4e99-8644-a18e2bf34a60', 'EquipeTest', 'Particulier', null, null, null, null, null, 'Vérifiée'),
       ('42fdbebf-d919-4bc2-a7b7-f00688f706af', 'Samsung', 'Société', '33436749700172', 'FR89334367497', 
        'https://www.samsung.com/fr/', '6 RUE FRUCTIDOR 93400 SAINT-OUEN-SUR-SEINE ',
        '01 44 04 70 00', 'Vérifiée') ON CONFLICT (id_equipe) DO NOTHING;

-- Insert data into Membre_equipe
INSERT INTO public.Membre_equipe (id_membre, id_user)
VALUES ('73078d78-ce50-49b5-bf29-b692c76345bd', 'a27901fd-3c67-4891-b7ac-55dd04a2f122'),
       ('aa877810-9602-45a6-8591-cffaa4824aae', 
        'd566eb81-3bf9-4470-a89c-30ea8da57087') ON CONFLICT (id_membre) DO NOTHING;

-- Insert data into Appartenance_Equipe
INSERT INTO public.Appartenance_Equipe (id_membre, id_equipe, date_appartenance)
VALUES ('73078d78-ce50-49b5-bf29-b692c76345bd', '5da884fa-d39c-4e99-8644-a18e2bf34a60', '2024-01-01'),
       ('aa877810-9602-45a6-8591-cffaa4824aae', '42fdbebf-d919-4bc2-a7b7-f00688f706af',
        '2024-01-01') ON CONFLICT (id_membre, id_equipe) DO NOTHING;

-- Insert data into Participant
INSERT INTO public.Participant (id_participant, id_user)
VALUES ('d2f1e8a4-3b6e-4d8e-9b8e-1f2e8a4d8e9b', 'b302ddb0-c4b4-42d8-8956-00bcb2c0589e'),
       ('e3f2a9b5-4c7f-5d9f-0c9f-2f3a9b5d9f0c', '16be6621-2b7e-4719-8937-ca30a4b9e3f3'),
       ('5dafc8db-7ca3-48f8-b6ef-8305c70e1987', 'e74e5007-b174-4c89-a439-d59d3d63e926'),
       ('0a56d11b-224c-4017-ab6c-b0cf5eef2470',
        '5eae781d-4d1d-4551-8d42-0349fba17678') ON CONFLICT (id_participant) DO NOTHING;

-- Insert data into Chasse
INSERT INTO public.Chasse (id_chasse, titre, capacite, description, age_requis, image, date_creation, date_modification,
                           date_debut, date_fin, prix, difficulte, duree_estime, theme, statut, id_chateau, id_equipe)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Chasse au trésor 1', '100', 'Une chasse excitante.', '16', 'image.jpg',
        '2025-01-01 00:00:00', '2025-01-01 00:00:00', '2025-01-20 00:00:00', '2025-01-25 00:00:00', '10.00', '2',
        '02:00:00', 'Theme de la chasse', 'Validée', '63e923ce-db26-4024-90cb-ff43eccfdbcb',
        '5da884fa-d39c-4e99-8644-a18e2bf34a60'),
       ('550e8400-e29b-41d4-a716-446655440000', 'Chasse de Chambord', '300',
        'Découvrez le château de Chambord comme vous ne l''avez jamais vu à travers une chasse aux trésors et des énigmes pour éveiller vos sens de détectives !',
        '16', 'https://www.valdeloire-france.com/app/uploads/2024/01/chambord-02-credit-drone-contrast.webp',
        '2025-01-07 09:00:00', '2025-01-07 09:00:00', '2025-01-29 10:00:00', '2025-01-31 16:00:00', '8.00', '1',
        '02:00:00', 'Dynastie royale', 'Validée', '2aab1306-2875-426c-b0d3-f440f05fa8b8',
        '42fdbebf-d919-4bc2-a7b7-f00688f706af') ON CONFLICT (id_chasse) DO NOTHING;

-- Insert data into Participation
INSERT INTO public.Participation (id_participant, id_chasse, score, jour, est_terminee)
VALUES ('d2f1e8a4-3b6e-4d8e-9b8e-1f2e8a4d8e9b', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 80, '01/07/2025', TRUE),
       ('e3f2a9b5-4c7f-5d9f-0c9f-2f3a9b5d9f0c', '550e8400-e29b-41d4-a716-446655440000', 80, '05/07/2025', FALSE),
       ('5dafc8db-7ca3-48f8-b6ef-8305c70e1987', '550e8400-e29b-41d4-a716-446655440000', 80, '01/01/2025', FALSE),
       ('0a56d11b-224c-4017-ab6c-b0cf5eef2470', '550e8400-e29b-41d4-a716-446655440000', 80, '01/05/2025',
        FALSE) ON CONFLICT (id_participant, id_chasse, jour) DO NOTHING;

-- Insert data into Avis
INSERT INTO public.Avis (id_avis, note, titre, description, id_participant, id_chasse)
VALUES ('b9e404a6-a8f4-4804-b756-c4077c544119', 5, 'Super expérience', 'Jai adoré la chasse.',
        '5dafc8db-7ca3-48f8-b6ef-8305c70e1987', '550e8400-e29b-41d4-a716-446655440000'),
       ('a8f4b9e4-404a-4804-756c-4077c544119b', 4, 'Très bien', 'Jai passé un bon moment.',
        '0a56d11b-224c-4017-ab6c-b0cf5eef2470',
        '550e8400-e29b-41d4-a716-446655440000') ON CONFLICT (id_avis) DO NOTHING;

-- Insert data into Recompense
INSERT INTO public.Recompense (id_recompense, nom, description, type, valeur, quantite_dispo, id_chasse)
VALUES ('e5fcaed4-3453-4c94-be22-4193b15d4ff7', 'Récompense 1', 'Une récompense.', 'Objet', '10.00', 10,
        'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
       ('74e67f8a-fb15-4c9f-adad-65cbb22c90c6', 'Récompense 2', 'Une récompense.', 'Objet', '10.00', 10,
        'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
       ('f8a74e67-b22c-4c9f-5cbb-90c674e67f8a', 'Récompense 3', 'Une récompense.', 'Objet', '10.00', 10,
        'f47ac10b-58cc-4372-a567-0e02b2c3d479') ON CONFLICT (id_recompense) DO NOTHING;

-- Insert data into Enigme
INSERT INTO public.Enigme (id_enigme, titre, description, ordre, degre_difficulte, id_chasse, code_reponse)
VALUES ('b56a35e2-097c-49f9-8fbf-3bffd1cfd0ba', 'Énigme 1', 'Résolvez ce mystère.', 1, 1,
        'f47ac10b-58cc-4372-a567-0e02b2c3d479', '111111'),
       ('09709c49-8fbf-ffd1-cfd0-baba35e20970', 'Énigme 2', 'Une énigme complexe.', 2, 3,
        'f47ac10b-58cc-4372-a567-0e02b2c3d479', '222222'),
       ('22403fb9-f993-4863-8745-cc130960712f', 'Énigme 3', 'Résolvez ce mystère.', 3, 2,
        'f47ac10b-58cc-4372-a567-0e02b2c3d479', '333333'),
       ('d8567307-6c72-4e56-bf52-001989822807', 'Énigme 4', 'Une énigme complexe.', 4, 3,
        'f47ac10b-58cc-4372-a567-0e02b2c3d479', '444444') ON CONFLICT (id_enigme) DO NOTHING;

-- Insert data into Indice
INSERT INTO public.Indice (id_indice, contenu, ordre, degre_aide, id_enigme)
VALUES ('75f4e5c2-f44b-45a5-879a-45d5d20cb51d', 'Indice pour énigme 1.', 1, 1, 'b56a35e2-097c-49f9-8fbf-3bffd1cfd0ba'),
       ('4b75a5a7-9a45-d5d0-cb51-d75f4e5c2f44', 'Indice pour énigme 5.', 1, 5, '09709c49-8fbf-ffd1-cfd0-baba35e20970'),
       ('b75a5a79-a45d-5d0c-b51d-75f4e5c2f44b', 'Indice pour énigme 1.', 2, 1, 'b56a35e2-097c-49f9-8fbf-3bffd1cfd0ba'),
       ('b75b5a79-a45d-5d1c-b51d-75f4e5c2f44b', 'Indice pour énigme 1.', 2, 1, '22403fb9-f993-4863-8745-cc130960712f'),
       ('b75a5b79-a45d-5d2c-b51d-75f4e5c2f44b', 'Indice pour énigme 1.', 2, 1, 'd8567307-6c72-4e56-bf52-001989822807'),
       ('b75c5a79-a45d-5d3c-b51d-75f4e5c2f44b', 'Indice pour énigme 1.', 2, 1,
        'd8567307-6c72-4e56-bf52-001989822807') ON CONFLICT (id_indice) DO NOTHING;

INSERT INTO public.haut_fait (id_haut_fait, titre, description, conditions, image_badge, date)
VALUES ('f35a1787-d883-4ba7-8e9b-d8dc2dd6c84d', 'Seigneur de Chambord', 'Pas de description',
        'Terminer au moins une chasse aux trésors dans le château de Chambord',
        'https://us-tuna-sounds-images.voicemod.net/742f87e9-77b0-48fc-8cdc-7db10472cf16-1692130617115.png',
        '2025-01-07'),
       ('d6bb9967-6b28-4c32-a5c8-f4179dab068f', 'Seigneur de Chenonceau', 'Pas de description',
        'Terminer au moins une chasse aux trésors dans le château de Chenonceau',
        'https://us-tuna-sounds-images.voicemod.net/742f87e9-77b0-48fc-8cdc-7db10472cf16-1692130617115.png',
        '2025-01-07'),
       ('57be79ad-b153-4122-a0ba-4b60e0ee496b', 'Seigneur d''Amboise', 'Pas de description',
        'Terminer au moins une chasse aux trésors dans le château d''Amboise',
        'https://us-tuna-sounds-images.voicemod.net/742f87e9-77b0-48fc-8cdc-7db10472cf16-1692130617115.png',
        '2025-01-07') ON CONFLICT (id_haut_fait) DO NOTHING;

-- Insert data into Haut_Fait_Participant
INSERT INTO public.Haut_Fait_Participant (id_haut_fait, id_participant, est_acquis, date_acquisition)
VALUES ('f35a1787-d883-4ba7-8e9b-d8dc2dd6c84d', 'd2f1e8a4-3b6e-4d8e-9b8e-1f2e8a4d8e9b', TRUE, '2025-01-07'),
       ('d6bb9967-6b28-4c32-a5c8-f4179dab068f', 'e3f2a9b5-4c7f-5d9f-0c9f-2f3a9b5d9f0c', TRUE, '2025-01-07'),
       ('57be79ad-b153-4122-a0ba-4b60e0ee496b', '5dafc8db-7ca3-48f8-b6ef-8305c70e1987', TRUE,
        '2025-01-07') ON CONFLICT (id_haut_fait, id_participant) DO NOTHING;

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