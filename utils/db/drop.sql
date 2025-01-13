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