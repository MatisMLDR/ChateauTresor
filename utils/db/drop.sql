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
