-- Insert data into profiles
INSERT INTO public.profiles (id, username, email, birthday, nom, prenom, adresse, ville, code_postal, stripe_id, plan)
VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'user1', 'user1@example.com', '1990-01-01', 'Doe', 'John', '123 Rue A', 'Paris', '75000', 'stripe_123', 'premium'),
    ('550e8400-e29b-41d4-a716-446655440001', 'user2', 'user2@example.com', '1985-06-15', 'Smith', 'Jane', '456 Rue B', 'Lyon', '69000', 'stripe_456', 'standard')
ON CONFLICT (id) DO NOTHING;

-- Insert data into Proprietaire_Chateau
INSERT INTO public.Proprietaire_Chateau (id_proprietaire, id_stripe, id_user)
VALUES
    (1, 'stripe_owner_001', '550e8400-e29b-41d4-a716-446655440000'),
    (2, 'stripe_owner_002', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id_proprietaire) DO NOTHING;

-- Insert data into Chateau
INSERT INTO public.Chateau (id_chateau, nom, adresse_postale, localisation, capacite, prix_location, telephone, description, id_proprietaire)
VALUES
    (1, 'Château A', '789 Rue C', 'Bordeaux', 100, 500.00, '0123456789', 'Un château historique.', 1),
    (2, 'Château B', '101 Rue D', 'Toulouse', 150, 750.00, '0987654321', 'Un château moderne.', 2)
ON CONFLICT (id_chateau) DO NOTHING;

-- Insert data into Equipe_Organisatrice
INSERT INTO public.Equipe_Organisatrice (id_equipe, type, n_siret, id_user)
VALUES
    (1, 'Association', '12345678900012', '550e8400-e29b-41d4-a716-446655440000'),
    (2, 'Société', '98765432100021', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id_equipe) DO NOTHING;

-- Insert data into Membre_equipe
INSERT INTO public.Membre_equipe (id_membre, carte_identite, est_verifie, role_equipe, id_user)
VALUES
    (1, 'ID001', TRUE, 'Chef', '550e8400-e29b-41d4-a716-446655440000'),
    (2, 'ID002', FALSE, 'Membre', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id_membre) DO NOTHING;

-- Insert data into Appartenance_Equipe
INSERT INTO public.Appartenance_Equipe (id_membre, id_equipe, date_appartenance)
VALUES
    (1, 1, '2024-01-01'),
    (2, 2, '2024-02-01')
ON CONFLICT (id_membre, id_equipe) DO NOTHING;

-- Insert data into Participant
INSERT INTO public.Participant (id_participant, id_user)
VALUES
    (1, '550e8400-e29b-41d4-a716-446655440000'),
    (2, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id_participant) DO NOTHING;

-- Insert data into Chasse
INSERT INTO public.Chasse (id_chasse, titre, capacite, description, difficulte, id_chateau, id_equipe)
VALUES
    (1, 'Chasse au trésor 1', 50, 'Une chasse excitante.', 2, 1, 1),
    (2, 'Chasse au trésor 2', 30, 'Une chasse difficile.', 3, 2, 2)
ON CONFLICT (id_chasse) DO NOTHING;

-- Insert data into Participation
INSERT INTO public.Participation (id_participant, id_chasse, score, est_terminee)
VALUES
    (1, 1, 80, TRUE),
    (2, 2, 90, FALSE)
ON CONFLICT (id_participant, id_chasse) DO NOTHING;

-- Insert data into Avis
INSERT INTO public.Avis (id_avis, note, titre, description, id_participant, id_chasse)
VALUES
    (1, 5, 'Super expérience', 'Jai adoré la chasse.', 1, 1),
    (2, 4, 'Très bien', 'Une chasse bien organisée.', 2, 2)
ON CONFLICT (id_avis) DO NOTHING;

-- Insert data into Recompense
INSERT INTO public.Recompense (id_recompense, nom, description, type, valeur, quantite_dispo, id_chasse)
VALUES
    (1, 'Trophée d'or', 'Récompense exceptionnelle.', 'Trophée', 100.00, 10, 1),
    (2, 'Médaille d'argent', 'Récompense pour les finalistes.', 'Médaille', 50.00, 20, 2)
ON CONFLICT (id_recompense) DO NOTHING;

-- Insert data into Enigme
INSERT INTO public.Enigme (id_enigme, titre, description, ordre, degre_difficulte, id_chasse)
VALUES
    (1, 'Énigme 1', 'Résolvez ce mystère.', 1, 2, 1),
    (2, 'Énigme 2', 'Une énigme complexe.', 2, 3, 2)
ON CONFLICT (id_enigme) DO NOTHING;

-- Insert data into Indice
INSERT INTO public.Indice (id_indice, contenu, ordre, degre_aide, id_enigme)
VALUES
    (1, 'Indice pour énigme 1.', 1, 1, 1),
    (2, 'Indice pour énigme 2.', 1, 2, 2)
ON CONFLICT (id_indice) DO NOTHING;