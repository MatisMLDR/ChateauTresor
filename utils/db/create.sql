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
    date_creation   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    id_user        UUID             NOT NULL UNIQUE REFERENCES public.profiles ON DELETE CASCADE
);

-- Table Appartenance_Equipe
CREATE TABLE public.Appartenance_Equipe
(
    id_membre         UUID NOT NULL,
    id_equipe         UUID NOT NULL,
    date_appartenance DATE DEFAULT NULL,
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
    id_user        UUID             NOT NULL UNIQUE REFERENCES public.profiles ON DELETE CASCADE
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
    horaire_debut     TIME                         DEFAULT NULL,
    horaire_fin       TIME                         DEFAULT NULL,
    prix              NUMERIC(10, 2)               DEFAULT 0.00,
    difficulte        INT                          DEFAULT 1 CHECK (
        difficulte BETWEEN 1
            AND 3
        ),
    duree_estime INTERVAL DEFAULT INTERVAL '00:00:00',
    theme             VARCHAR(255)                 DEFAULT 'Aucun thème',
    statut            VARCHAR(50)         NOT NULL DEFAULT 'En attente de validation' CHECK (
        statut IN ('En attente de validation', 'Validée', 'En cours', 'Finie', 'Refusée')
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

CREATE OR REPLACE FUNCTION update_date_appartenance_on_validation()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le statut devient "Validé", mettre à jour date_appartenance
  IF NEW.statut = 'Validé' THEN
    NEW.date_appartenance = CURRENT_DATE;
  -- Si le statut passe de "Validé" à autre chose, réinitialiser date_appartenance
  ELSIF OLD.statut = 'Validé' AND NEW.statut <> 'Validé' THEN
    NEW.date_appartenance = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Création du trigger pour les mises à jour
CREATE OR REPLACE TRIGGER trig_update_date_appartenance
BEFORE UPDATE ON public.Appartenance_Equipe
FOR EACH ROW
WHEN (OLD.statut IS DISTINCT FROM NEW.statut) -- Déclenché uniquement si le statut change
EXECUTE FUNCTION update_date_appartenance_on_validation();

-- Création du trigger pour les insertions
CREATE OR REPLACE TRIGGER trig_insert_date_appartenance
BEFORE INSERT ON public.Appartenance_Equipe
FOR EACH ROW
EXECUTE FUNCTION update_date_appartenance_on_validation();