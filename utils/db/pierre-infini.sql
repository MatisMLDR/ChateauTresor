DROP TABLE IF EXISTS
    public.Chateau,
    public.Equipe_Organisatrice,
    public.Membre_equipe,
    public.Appartenance_Equipe,
    public.Participant,
    public.Chasse,
    public.Participation,
    public.Avis,
    public.Recompense,
    public.Enigme,
    public.Indice,
    public.Image_indice,
    public.Son_indice,
    public.Texte,
    public.Haut_fait,
    public.Profiles,
    public.proprietaire_chateau,
    public.enigme_participant,
    public.indice_participant
CASCADE;

DROP TRIGGER IF EXISTS
    on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS
    public.handle_new_user;

-- Table users in schema public
CREATE TABLE public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    username text UNIQUE NOT NULL,
    updated_at timestamp with time zone,
    email text UNIQUE NOT NULL,
    birthday date,
    email_confirm boolean DEFAULT false,
    nom text default 'Non spécifié',
    prenom text default 'Non spécifié',
    adresse text default 'Non spécifiée',
    ville text default 'Non spécifiée',
    code_postal text default 'Non spécifié',
    stripe_id text,
    plan text NOT NULL DEFAULT 'none'
);

alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);


-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Table Proprietaire_Chateau
CREATE TABLE public.Proprietaire_Chateau (
    id_proprietaire SERIAL PRIMARY KEY,
    id_stripe VARCHAR(255) NOT NULL,
    id_user UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE
);

-- Table Chateau
CREATE TABLE public.Chateau (
    id_chateau SERIAL PRIMARY KEY,
    nom VARCHAR(255) DEFAULT 'Château inconnu',
    adresse_postale VARCHAR(255) DEFAULT 'Non spécifiée',
    localisation VARCHAR(255) DEFAULT 'Non spécifiée',
    capacite INT DEFAULT 0,
    prix_location NUMERIC(10, 2) DEFAULT 0.00,
    telephone VARCHAR(20) DEFAULT NULL,
    description TEXT DEFAULT 'Pas de description',
    image VARCHAR(255) DEFAULT NULL,
    site_web VARCHAR(255) DEFAULT NULL,
    id_proprietaire INT DEFAULT NULL REFERENCES Proprietaire_Chateau(id_proprietaire) ON DELETE CASCADE
);

-- Table Equipe_Organisatrice
CREATE TABLE public.Equipe_Organisatrice (
    id_equipe SERIAL PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(255) DEFAULT 'Association',
    n_siret VARCHAR(255) DEFAULT NULL,
    id_taxes VARCHAR(255) DEFAULT NULL,
    nb_membres INT DEFAULT 0,
    site_web VARCHAR(255) DEFAULT NULL,
    adresse_postale VARCHAR(255) DEFAULT 'Non spécifiée',
    telephone VARCHAR(20) DEFAULT NULL,
    id_user UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE
);

-- Table Membre_equipe
CREATE TABLE public.Membre_equipe (
    id_membre SERIAL PRIMARY KEY,
    carte_identite VARCHAR(255) DEFAULT NULL,
    est_verifie BOOLEAN DEFAULT FALSE,
    role_equipe VARCHAR(255) DEFAULT 'Membre',
    id_user UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE
);

-- Table Appartenance_Equipe
CREATE TABLE public.Appartenance_Equipe (
    id_membre INT,
    id_equipe INT,
    date_appartenance DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_membre, id_equipe),
    FOREIGN KEY (id_membre) REFERENCES Membre_equipe(id_membre) ON DELETE CASCADE,
    FOREIGN KEY (id_equipe) REFERENCES Equipe_Organisatrice(id_equipe) ON DELETE CASCADE
);

-- Table Participant
CREATE TABLE public.Participant (
    id_participant SERIAL PRIMARY KEY,
    id_user UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE
);

-- Table Chasse
CREATE TABLE public.Chasse (
    id_chasse SERIAL PRIMARY KEY,
    titre VARCHAR(255) UNIQUE NOT NULL,
    capacite INT DEFAULT 0,
    description TEXT DEFAULT 'Pas de description',
    age_requis INT DEFAULT 0,
    image VARCHAR(255) DEFAULT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_debut TIMESTAMP DEFAULT NULL,
    date_fin TIMESTAMP DEFAULT NULL,
    prix NUMERIC(10, 2) DEFAULT 0.00,
    difficulte INT DEFAULT 1 CHECK (
        difficulte BETWEEN 1
        AND 3
    ),
    duree_estime INTERVAL DEFAULT INTERVAL '00:00:00',
    theme VARCHAR(255) DEFAULT 'Aucun thème',
    statut VARCHAR(50) DEFAULT 'Inactif',
    id_chateau INT DEFAULT NULL REFERENCES Chateau(id_chateau) ON DELETE CASCADE,
    id_equipe INT DEFAULT NULL REFERENCES Equipe_Organisatrice(id_equipe) ON DELETE CASCADE
);

-- Table Participation
CREATE TABLE public.Participation (
    id_participant INT,
    id_chasse INT,
    duree_totale INTERVAL DEFAULT INTERVAL '00:00:00',
    score INT DEFAULT 0,
    nb_enigmes_resolues INT DEFAULT 0,
    est_terminee BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_participant, id_chasse),
    FOREIGN KEY (id_participant) REFERENCES Participant(id_participant) ON DELETE CASCADE,
    FOREIGN KEY (id_chasse) REFERENCES Chasse(id_chasse) ON DELETE CASCADE
);

-- Table Avis
CREATE TABLE public.Avis (
    id_avis SERIAL PRIMARY KEY,
    note INT DEFAULT 0,
    titre VARCHAR(255) DEFAULT 'Sans titre',
    description TEXT DEFAULT 'Pas de description',
    nb_likes INT DEFAULT 0,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_participant INT UNIQUE REFERENCES Participant(id_participant) ON DELETE CASCADE,
    id_chasse INT UNIQUE REFERENCES Chasse(id_chasse) ON DELETE CASCADE
);

-- Table Recompense
CREATE TABLE public.Recompense (
    id_recompense SERIAL PRIMARY KEY,
    nom VARCHAR(255) DEFAULT 'Nouvelle Récompense',
    description TEXT DEFAULT 'Pas de description',
    type VARCHAR(255) DEFAULT 'Générique',
    valeur NUMERIC(10, 2) DEFAULT 0.00,
    quantite_dispo INT DEFAULT 0,
    prix_reel NUMERIC(10, 2) DEFAULT 0.00,
    image VARCHAR(255) DEFAULT NULL,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_chasse INT REFERENCES Chasse(id_chasse) ON DELETE CASCADE
);

-- Table Enigme
CREATE TABLE public.Enigme (
    id_enigme INT PRIMARY KEY,
    titre VARCHAR(255) DEFAULT 'Nouvelle Énigme',
    description TEXT DEFAULT 'Pas de description',
    ordre INT DEFAULT 1,
    degre_difficulte INT DEFAULT 1 CHECK (degre_difficulte BETWEEN 1 AND 3),
    temps_max INTERVAL DEFAULT INTERVAL '00:30:00',
    code_reponse VARCHAR(255) DEFAULT NULL,
    endroit_qrcode VARCHAR(255) DEFAULT NULL,
    description_reponse TEXT DEFAULT 'Pas de description',
    image_reponse VARCHAR(255) DEFAULT NULL,
    id_chasse INT REFERENCES Chasse(id_chasse) ON DELETE CASCADE
);

-- Table Enigme_Participant
CREATE TABLE public.Enigme_Participant (
    id_enigme INT,
    id_participant INT,
    est_resolue BOOLEAN DEFAULT FALSE,
    duree REAL DEFAULT 0.00,
    date_resolution TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_enigme, id_participant),
    FOREIGN KEY (id_enigme) REFERENCES Enigme(id_enigme) ON DELETE CASCADE,
    FOREIGN KEY (id_participant) REFERENCES Participant(id_participant) ON DELETE CASCADE
);

-- Table Indice
CREATE TABLE public.Indice (
    id_indice SERIAL PRIMARY KEY,
    contenu TEXT DEFAULT 'Pas de contenu',
    ordre INT DEFAULT 1,
    degre_aide INT DEFAULT 1 CHECK (
        degre_aide BETWEEN 1
        AND 5
    ),
    type text DEFAULT 'Text' CHECK (
        type IN ('Text', 'Image', 'Son')
    ),
    id_enigme INT REFERENCES Enigme(id_enigme) ON DELETE CASCADE
);

-- Table Indice_Participant
CREATE TABLE public.Indice_Participant (
    id_indice INT,
    id_participant INT,
    est_decouvert BOOLEAN DEFAULT FALSE,
    date_utilisation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_indice, id_participant),
    FOREIGN KEY (id_indice) REFERENCES Indice(id_indice) ON DELETE CASCADE,
    FOREIGN KEY (id_participant) REFERENCES Participant(id_participant) ON DELETE CASCADE
);

-- Table Image_indice
CREATE TABLE public.Image_indice (
    id_image SERIAL PRIMARY KEY,
    chemin_img VARCHAR(255) DEFAULT NULL,
    id_indice INT REFERENCES Indice(id_indice) ON DELETE CASCADE
);

-- Table Son_indice
CREATE TABLE public.Son_indice (
    id_son SERIAL PRIMARY KEY,
    chemin_son VARCHAR(255) DEFAULT NULL,
    id_indice INT REFERENCES Indice(id_indice) ON DELETE CASCADE
);

-- Table Texte
CREATE TABLE public.Texte (
    id_texte SERIAL PRIMARY KEY,
    contenu TEXT DEFAULT 'Pas de contenu',
    id_indice INT REFERENCES Indice(id_indice) ON DELETE CASCADE
);

-- Table Haut_Fait
CREATE TABLE public.Haut_Fait (
    id_haut_fait SERIAL PRIMARY KEY,
    titre VARCHAR(255) DEFAULT 'Nouveau Haut Fait',
    description TEXT DEFAULT 'Pas de description',
    conditions TEXT DEFAULT 'Pas de conditions',
    image_badge VARCHAR(255) DEFAULT NULL,
    date DATE DEFAULT CURRENT_DATE
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
CREATE OR REPLACE FUNCTION update_modification_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date_modification = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Exemple : Appliquer aux chasses
CREATE TRIGGER update_chasse_modification_date
  BEFORE UPDATE ON Chasse
  FOR EACH ROW
  EXECUTE FUNCTION update_modification_date();

-- Insert data into profiles
INSERT INTO public.profiles (id, username, updated_at, email, birthday, email_confirm, nom, adresse, ville, code_postal, stripe_id, plan, prenom)
VALUES
    ('b302ddb0-c4b4-42d8-8956-00bcb2c0589e', 'ParticipantTest', null, 'testparticipant@chateautresor.com', null, 'true', 'Test', 'Participant', '2 Pl. Doyen Gosse', 'Grenoble', '38000', 'Standard', 'Participant'),
    ('bfdc30a0-7e79-4037-9024-184f814cb57a', 'ProprietaireTest', null, 'tesproprietairechateau@chateautresor.com', null, 'true', 'Test', 'Proprietaire', '2 Pl. Doyen Gosse', 'Grenoble', '38000', 'Standard', 'Proprietaire'),
    ('12b02e4a-34a8-4a83-838e-6206b201e948', 'OrganisateurTest', null, 'testorganisateur@chateautresor.com', null, 'true', 'Test', 'Organisateur', '2 Pl. Doyen Gosse', 'Grenoble', '38000', 'Standard', 'Organisateur'),
    ('a27901fd-3c67-4891-b7ac-55dd04a2f122', 'MembreEquipeTest', null, 'testmembreequipe@chateautresor.com', null, 'true', 'Test', 'MembreEquipe', '2 Pl. Doyen Gosse', 'Grenoble', '38000', 'Standard', 'MembreEquipe'),
    ('16be6621-2b7e-4719-8937-ca30a4b9e3f3', 'Simon', null, 'simonzeru08@gmail.com', null, 'false', 'Jean Neymar', 'Non spécifiée', 'Non spécifiée', 'Non spécifié', null, 'Standard', 'Non spécifié'),
    ('4d7acb04-c25a-4d9f-8759-198d3fc80153', 'Rahim', null, 'rahim.boughendjour@gmail.com', null, 'false', 'Jean Neymar', 'Non spécifiée', 'Non spécifiée', 'Non spécifié', 'cus_RXiLEp77Wa0ndo', 'Standard', 'Non spécifié'),
    ('514e8181-1f82-4f81-8c16-00bf216d3b0a', 'Paul-ML', null, 'paul.moncenix-larue@gmail.com', null, 'false', 'Jean Neymar', 'Non spécifiée', 'Non spécifiée', 'Non spécifié', null, 'Standard', 'Non spécifié'),
    ('5eae781d-4d1d-4551-8d42-0349fba17678', 'Matis', null, 'matismld38@gmail.com', null, 'false', 'Jean Neymar', 'Non spécifiée', 'Non spécifiée', 'Non spécifié', null, 'Standard', 'Non spécifié'),
    ('82fac1a4-bcb2-4b1b-8f1d-c0d0c04310dc', 'ChateauTresor', null, 'chateautresor@gmail.com', null, 'false', 'Jean Neymar', 'Non spécifiée', 'Non spécifiée', 'Non spécifié', null, 'Standard', 'Non spécifié'),
    ('d07d6711-4a1c-48b6-ab23-a726ae0c5586', 'SuperAdmin', null, 'superadmin@chateautresor.fr', null, 'false', '"Non spécifié"', 'Non spécifiée', 'Non spécifiée', 'Non spécifié', null, 'Standard', 'Non spécifié'),
    ('d566eb81-3bf9-4470-a89c-30ea8da57087', 'Paul', null, 'paul.moncenix@gmail.com', null, 'false', 'Jean Neymar', 'Non spécifiée', 'Non spécifiée', 'Non spécifié', null, 'Standard', 'Non spécifié'),
    ('e74e5007-b174-4c89-a439-d59d3d63e926', 'Yvan', null, 'yvan.d-ettorre@etu.univ-grenoble-alpes.fr', null, 'false', 'Jean Neymar', 'Non spécifiée', 'Non spécifiée', 'Non spécifié', 'cus_RY00lPy1E9anl3', 'Standard', 'Non spécifié')
ON CONFLICT (id) DO NOTHING;

-- Insert data into Proprietaire_Chateau
INSERT INTO public.Proprietaire_Chateau (id_proprietaire, id_stripe, id_user)
VALUES
    (1, 'stripe_12345', 'bfdc30a0-7e79-4037-9024-184f814cb57a')
ON CONFLICT (id_proprietaire) DO NOTHING;

-- Insert data into Chateau
INSERT INTO public.Chateau (id_chateau, nom, adresse_postale, localisation, capacite, prix_location, telephone, description, image, site_web, id_proprietaire)
VALUES
    ('1', 'IUT 2', ' 2 Place du Doyen Gosse', '45.191841, 5.716785', '1000', '1.00', '04 76 28 45 09', 'L''IUT2 pour les jobbeurs qui jobbent alors qu''ils sont jobless','https://cdn-s-www.ledauphine.com/images/6BD74FC8-7546-4962-A9D4-F0B5D539A191/FB1200/photo-1580471774.jpg', 'https://iut2.univ-grenoble-alpes.fr/', null),
    ('318', 'Château de Chambord', 'Château, 41250 Chambord, France', '47.616833, 1.516992', '1000', '10000.00','+33 2 54 50 40 00', 'Le Château de Chambord est un joyau de la Renaissance française. Construit au XVIᵉ siècle sous François Ier,il est célèbre pour son architecture unique, son escalier à double révolution et ses vastes jardins.','https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chambord_Castle_Northwest_facade.jpg/2880px-Chambord_Castle_Northwest_facade.jpg','https://www.chambord.org/', null),
    ('319', 'Château de Chenonceau', 'Château de Chenonceau, 37150 Chenonceaux, France', '47.324406, 1.070545', '0', '0.00', '+33 2 47 23 90 07','Le Château de Chenonceau, surnommé le Château des Dames, est connu pour son élégance architecturale enjambant la rivière Cher. Son histoire est marquée par des figures féminines telles que Diane de Poitiers et Catherine de Médicis.','https://fr.wikipedia.org/wiki/Ch%C3%A2teau_de_Chenonceau#/media/Fichier:Chenonceau-20050320.jpg', 'https://www.chenonceau.com/', null),
    ('320', 'Château d’Amboise', 'Montée de l''Émir Abd-el-Kader, 37400 Amboise, France', '47.413780, 0.987703', '0', '0.00', '+33 2 47 57 00 98','Le Château d’Amboise est un symbole de la Renaissance française. Résidence royale au XVᵉ et XVIᵉ siècles, il offre une vue imprenable sur la Loire et abrite la tombe présumée de Léonard de Vinci.','https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Ch%C3%A2teau_et_tour_des_Minimes_%28Amboise%29.jpg/2560px-Ch%C3%A2teau_et_tour_des_Minimes_%28Amboise%29.jpg','https://www.chateau-amboise.com/', null)
ON CONFLICT (id_chateau) DO NOTHING;

-- Insert data into Equipe_Organisatrice
INSERT INTO public.Equipe_Organisatrice (id_equipe, nom, type, n_siret, id_taxes, nb_membres, site_web, adresse_postale, telephone, id_user)
VALUES
    ('1', 'EquipeTest', 'Association', null, null, '1', null, null, null, '12b02e4a-34a8-4a83-838e-6206b201e948'),
    ('2', 'Samsung', 'Entreprise', '33436749700172', 'FR89334367497', '0', 'https://www.samsung.com/fr/', '6 RUE FRUCTIDOR 93400 SAINT-OUEN-SUR-SEINE ', '01 44 04 70 00', '82fac1a4-bcb2-4b1b-8f1d-c0d0c04310dc')
ON CONFLICT (id_equipe) DO NOTHING;

-- Insert data into Membre_equipe
INSERT INTO public.Membre_equipe (id_membre, carte_identite, est_verifie, role_equipe, id_user)
VALUES
    (1, null, TRUE, 'Chef', 'a27901fd-3c67-4891-b7ac-55dd04a2f122'),
    (2, null, TRUE, 'Organisateur', 'd566eb81-3bf9-4470-a89c-30ea8da57087')
ON CONFLICT (id_membre) DO NOTHING;

-- Insert data into Appartenance_Equipe
INSERT INTO public.Appartenance_Equipe (id_membre, id_equipe, date_appartenance)
VALUES
    (1, 1, '2024-01-01'),
    (2, 2, '2024-01-01')
ON CONFLICT (id_membre, id_equipe) DO NOTHING;

-- Insert data into Participant
INSERT INTO public.Participant (id_participant, id_user)
VALUES
    ('1', 'b302ddb0-c4b4-42d8-8956-00bcb2c0589e'),
    ('2', '16be6621-2b7e-4719-8937-ca30a4b9e3f3'),
    ('4', '4d7acb04-c25a-4d9f-8759-198d3fc80153'),
    ('5', 'e74e5007-b174-4c89-a439-d59d3d63e926'),
    ('7', '5eae781d-4d1d-4551-8d42-0349fba17678')
ON CONFLICT (id_participant) DO NOTHING;

-- Insert data into Chasse
INSERT INTO public.Chasse (id_chasse, titre, capacite, description, age_requis, image, date_creation, date_modification, date_debut, date_fin, prix, difficulte, duree_estime, theme, statut, id_chateau, id_equipe)
VALUES
    ('1', 'Chasse au trésor 1', '100', 'Une chasse excitante.', '16', 'image.jpg', '2025-01-01 00:00:00', '2025-01-01 00:00:00', '2025-01-20 00:00:00', '2025-01-25 00:00:00', '10.00', '2', '02:00:00', 'Theme de la chasse', 'Inactif', '1', '1'),
    ('8', 'KIRIKOU', '300', 'Découvrez le château de Chambord comme vous ne l''avez jamais vu à travers une chasse aux trésors et des énigmes pour éveiller vos sens de détectives !', '16', 'https://www.valdeloire-france.com/app/uploads/2024/01/chambord-02-credit-drone-contrast.webp', '2025-01-07 09:00:00', '2025-01-07 09:00:00', '2025-01-29 10:00:00', '2025-01-31 16:00:00', '8.00', '1', '02:00:00', 'Dynastie royale', 'Inactif', '318', '2')
ON CONFLICT (id_chasse) DO NOTHING;

-- Insert data into Participation
INSERT INTO public.Participation (id_participant, id_chasse, score, est_terminee)
VALUES
    (1, 1, 80, TRUE)
ON CONFLICT (id_participant, id_chasse) DO NOTHING;

-- Insert data into Avis
INSERT INTO public.Avis (id_avis, note, titre, description, id_participant, id_chasse)
VALUES
    (1, 5, 'Super expérience', 'Jai adoré la chasse.', 1, 1)
ON CONFLICT (id_avis) DO NOTHING;

-- Insert data into Recompense
INSERT INTO public.Recompense (id_recompense, nom, description, type, valeur, quantite_dispo, id_chasse)
VALUES
    (1, 'Trophée d''or', 'Récompense exceptionnelle.', 'Trophée', 100.00, 10, 1)
ON CONFLICT (id_recompense) DO NOTHING;

-- Insert data into Enigme
INSERT INTO public.Enigme (id_enigme, titre, description, ordre, degre_difficulte, id_chasse)
VALUES
    (1, 'Énigme 1', 'Résolvez ce mystère.', 1, 2, 1),
    (2, 'Énigme 2', 'Une énigme complexe.', 2, 3, 1)
ON CONFLICT (id_enigme) DO NOTHING;

-- Insert data into Indice
INSERT INTO public.Indice (id_indice, contenu, ordre, degre_aide, id_enigme)
VALUES
    (1, 'Indice pour énigme 1.', 1, 1, 1),
    (2, 'Indice pour énigme 2.', 1, 2, 2)
ON CONFLICT (id_indice) DO NOTHING;

INSERT INTO public.haut_fait (id_haut_fait, titre, description, conditions, image_badge, date)
VALUES
    (1, 'Seigneur de Chambord', 'Pas de description', 'Terminer la chasse aux trésors du châteaux de Chambords', 'https://us-tuna-sounds-images.voicemod.net/742f87e9-77b0-48fc-8cdc-7db10472cf16-1692130617115.png', '2025-01-07')
ON CONFLICT (id_haut_fait) DO NOTHING;