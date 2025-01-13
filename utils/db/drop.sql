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
    public.Haut_fait,
    public.Profiles,
    public.proprietaire_chateau,
    public.enigme_participant,
    public.indice_participant
CASCADE;

-- Supprimer les triggers
DROP TRIGGER IF EXISTS
    on_auth_user_created ON auth.users,
    update_chasse_modification_date ON Chasse,
    update_avis_modification_date ON Avis,
    update_recompense_modification_date ON Recompense;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS
    public.handle_new_user,
    update_modification_date;

-- Indexation des tables
DROP INDEX IF EXISTS
    idx_profiles_email,
    idx_chateau_nom,
    idx_chateau_localisation,
    idx_equipe_nom,
    idx_profiles_username,
    idx_chasse_titre,
    idx_chasse_theme,
    idx_chasse_statut;