-- Table users in schema public
CREATE TABLE public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    username text unique default 'anonyme',
    updated_at timestamp with time zone,
    email text UNIQUE NOT NULL,
    birthday date,
    email_confirm boolean DEFAULT false,
    full_name text default 'Jean Neymar',
    adresse text default 'Non spécifiée',
    ville text default 'Non spécifiée',
    code_postal text default 'Non spécifié',
    stripe_id uuid UNIQUE,
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
  insert into public.profiles (id, email)
  values (new.id, new.email);
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
    id_proprietaire INT DEFAULT NULL REFERENCES Proprietaire_Chateau(id_proprietaire)
);

-- Table Equipe_Organisatrice
CREATE TABLE public.Equipe_Organisatrice (
    id_equipe SERIAL PRIMARY KEY,
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
    role_equipe VARCHAR(255) DEFAULT 'Membre',
    id_user UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE
);

-- Table Appartenance_Equipe
CREATE TABLE public.Appartenance_Equipe (
    id_membre INT,
    id_equipe INT,
    date_appartenance DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_membre, id_equipe),
    FOREIGN KEY (id_membre) REFERENCES Membre_equipe(id_membre),
    FOREIGN KEY (id_equipe) REFERENCES Equipe_Organisatrice(id_equipe)
);

-- Table Participant
CREATE TABLE public.Participant (
    id_participant SERIAL PRIMARY KEY,
    nb_participations INT DEFAULT 0,
    nb_chasses_terminees INT DEFAULT 0,
    score_moyen NUMERIC(5, 2) DEFAULT 0.00,
    duree_moyenne INTERVAL DEFAULT INTERVAL '00:00:00',
    id_user UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE
);

-- Table Chasse
CREATE TABLE public.Chasse (
    id_chasse SERIAL PRIMARY KEY,
    titre VARCHAR(255) DEFAULT 'Nouvelle Chasse',
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
    nb_enigmes INT DEFAULT 0,
    theme VARCHAR(255) DEFAULT 'Aucun thème',
    statut VARCHAR(50) DEFAULT 'Inactif',
    nb_enigmes_resolues INT DEFAULT 0,
    note_moyenne NUMERIC(3, 2) DEFAULT 0.00,
    recompenses_attribuees INT DEFAULT 0,
    reussite_moyenne NUMERIC(5, 2) DEFAULT 0.00,
    duree_moyenne INTERVAL DEFAULT INTERVAL '00:00:00',
    id_chateau INT DEFAULT NULL REFERENCES Chateau(id_chateau),
    id_equipe INT DEFAULT NULL REFERENCES Equipe_Organisatrice(id_equipe)
);

-- Table Participation
CREATE TABLE public.Participation (
    id_participant INT,
    id_chasse INT,
    duree_totale INTERVAL DEFAULT INTERVAL '00:00:00',
    score INT DEFAULT 0,
    nb_enigmes_resolues INT DEFAULT 0,
    PRIMARY KEY (id_participant, id_chasse),
    FOREIGN KEY (id_participant) REFERENCES Participant(id_participant),
    FOREIGN KEY (id_chasse) REFERENCES Chasse(id_chasse)
);

-- Table Avis
CREATE TABLE public.Avis (
    id_avis SERIAL PRIMARY KEY,
    note INT DEFAULT 0,
    titre VARCHAR(255) DEFAULT 'Sans titre',
    description TEXT DEFAULT 'Pas de description',
    nb_likes INT DEFAULT 0,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_participant INT UNIQUE REFERENCES Participant(id_participant),
    id_chasse INT UNIQUE REFERENCES Chasse(id_chasse)
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
    id_chasse INT REFERENCES Chasse(id_chasse)
);

-- Table Enigme
CREATE TABLE public.Enigme (
    id_enigme SERIAL PRIMARY KEY,
    titre VARCHAR(255) DEFAULT 'Nouvelle Énigme',
    description TEXT DEFAULT 'Pas de description',
    ordre INT DEFAULT 1,
    degre_difficulte VARCHAR(50) DEFAULT 'Facile',
    temps_max INTERVAL DEFAULT INTERVAL '00:30:00',
    code_reponse VARCHAR(255) DEFAULT NULL,
    endroit_qrcode VARCHAR(255) DEFAULT NULL,
    description_reponse TEXT DEFAULT 'Pas de description',
    image_reponse VARCHAR(255) DEFAULT NULL,
    id_chasse INT REFERENCES Chasse(id_chasse)
);

-- Table Indice
CREATE TABLE public.Indice (
    id_indice SERIAL PRIMARY KEY,
    contenu TEXT DEFAULT 'Pas de contenu',
    ordre INT DEFAULT 1,
    degre_difficulte INT DEFAULT 1 CHECK (
        degre_difficulte BETWEEN 1
        AND 5
    ),
    est_decouvert BOOLEAN DEFAULT FALSE,
    id_enigme INT REFERENCES Enigme(id_enigme)
);

-- Table Image_indice
CREATE TABLE public.Image_indice (
    id_image SERIAL PRIMARY KEY,
    chemin_img VARCHAR(255) DEFAULT NULL,
    id_indice INT REFERENCES Indice(id_indice)
);

-- Table Son_indice
CREATE TABLE public.Son_indice (
    id_son SERIAL PRIMARY KEY,
    chemin_son VARCHAR(255) DEFAULT NULL,
    id_indice INT REFERENCES Indice(id_indice)
);

-- Table Texte
CREATE TABLE public.Texte (
    id_texte SERIAL PRIMARY KEY,
    contenu TEXT DEFAULT 'Pas de contenu',
    id_indice INT REFERENCES Indice(id_indice)
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