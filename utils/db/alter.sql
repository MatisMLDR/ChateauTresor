-- 1. Supprimer toutes les contraintes créées par erreur
ALTER TABLE enigme DROP CONSTRAINT IF EXISTS fk_chasse;
ALTER TABLE recompense DROP CONSTRAINT IF EXISTS fk_chasse;
ALTER TABLE participation DROP CONSTRAINT IF EXISTS fk_chasse;
ALTER TABLE avis DROP CONSTRAINT IF EXISTS fk_chasse;
ALTER TABLE avis DROP CONSTRAINT IF EXISTS fk_participant;
ALTER TABLE chasse DROP CONSTRAINT IF EXISTS fk_chateau;
ALTER TABLE chasse DROP CONSTRAINT IF EXISTS fk_equipe;

-- Suppression des clés étrangères existantes
ALTER TABLE public.Proprietaire_Chateau DROP CONSTRAINT Proprietaire_Chateau_id_user_fkey;
ALTER TABLE public.Chateau DROP CONSTRAINT Chateau_id_proprietaire_fkey;
ALTER TABLE public.Equipe_Organisatrice DROP CONSTRAINT Equipe_Organisatrice_id_user_fkey;
ALTER TABLE public.Membre_equipe DROP CONSTRAINT Membre_equipe_id_user_fkey;
ALTER TABLE public.Appartenance_Equipe DROP CONSTRAINT Appartenance_Equipe_id_membre_fkey;
ALTER TABLE public.Appartenance_Equipe DROP CONSTRAINT Appartenance_Equipe_id_equipe_fkey;
ALTER TABLE public.Participant DROP CONSTRAINT Participant_id_user_fkey;
ALTER TABLE public.Chasse DROP CONSTRAINT Chasse_id_chateau_fkey;
ALTER TABLE public.Chasse DROP CONSTRAINT Chasse_id_equipe_fkey;
ALTER TABLE public.Participation DROP CONSTRAINT Participation_id_participant_fkey;
ALTER TABLE public.Participation DROP CONSTRAINT Participation_id_chasse_fkey;
ALTER TABLE public.Avis DROP CONSTRAINT Avis_id_participant_fkey;
ALTER TABLE public.Avis DROP CONSTRAINT Avis_id_chasse_fkey;
ALTER TABLE public.Recompense DROP CONSTRAINT Recompense_id_chasse_fkey;
ALTER TABLE public.Enigme DROP CONSTRAINT Enigme_id_chasse_fkey;
ALTER TABLE public.Enigme_Participant DROP CONSTRAINT Enigme_Participant_id_enigme_fkey;
ALTER TABLE public.Enigme_Participant DROP CONSTRAINT Enigme_Participant_id_participant_fkey;
ALTER TABLE public.Indice DROP CONSTRAINT Indice_id_enigme_fkey;
ALTER TABLE public.Indice_Participant DROP CONSTRAINT Indice_Participant_id_indice_fkey;
ALTER TABLE public.Indice_Participant DROP CONSTRAINT Indice_Participant_id_participant_fkey;
ALTER TABLE public.Image_indice DROP CONSTRAINT Image_indice_id_indice_fkey;
ALTER TABLE public.Son_indice DROP CONSTRAINT Son_indice_id_indice_fkey;
ALTER TABLE public.Texte DROP CONSTRAINT Texte_id_indice_fkey;

-- Recréation des clés étrangères avec ON DELETE CASCADE
ALTER TABLE public.Proprietaire_Chateau
    ADD CONSTRAINT Proprietaire_Chateau_id_user_fkey
        FOREIGN KEY (id_user) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.Chateau
    ADD CONSTRAINT Chateau_id_proprietaire_fkey
        FOREIGN KEY (id_proprietaire) REFERENCES public.Proprietaire_Chateau (id_proprietaire) ON DELETE CASCADE;

ALTER TABLE public.Equipe_Organisatrice
    ADD CONSTRAINT Equipe_Organisatrice_id_user_fkey
        FOREIGN KEY (id_user) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.Membre_equipe
    ADD CONSTRAINT Membre_equipe_id_user_fkey
        FOREIGN KEY (id_user) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.Appartenance_Equipe
    ADD CONSTRAINT Appartenance_Equipe_id_membre_fkey
        FOREIGN KEY (id_membre) REFERENCES public.Membre_equipe (id_membre) ON DELETE CASCADE;

ALTER TABLE public.Appartenance_Equipe
    ADD CONSTRAINT Appartenance_Equipe_id_equipe_fkey
        FOREIGN KEY (id_equipe) REFERENCES public.Equipe_Organisatrice (id_equipe) ON DELETE CASCADE;

ALTER TABLE public.Participant
    ADD CONSTRAINT Participant_id_user_fkey
        FOREIGN KEY (id_user) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.Chasse
    ADD CONSTRAINT Chasse_id_chateau_fkey
        FOREIGN KEY (id_chateau) REFERENCES public.Chateau (id_chateau) ON DELETE CASCADE;

ALTER TABLE public.Chasse
    ADD CONSTRAINT Chasse_id_equipe_fkey
        FOREIGN KEY (id_equipe) REFERENCES public.Equipe_Organisatrice (id_equipe) ON DELETE CASCADE;

ALTER TABLE public.Participation
    ADD CONSTRAINT Participation_id_participant_fkey
        FOREIGN KEY (id_participant) REFERENCES public.Participant (id_participant) ON DELETE CASCADE;

ALTER TABLE public.Participation
    ADD CONSTRAINT Participation_id_chasse_fkey
        FOREIGN KEY (id_chasse) REFERENCES public.Chasse (id_chasse) ON DELETE CASCADE;

ALTER TABLE public.Avis
    ADD CONSTRAINT Avis_id_participant_fkey
        FOREIGN KEY (id_participant) REFERENCES public.Participant (id_participant) ON DELETE CASCADE;

ALTER TABLE public.Avis
    ADD CONSTRAINT Avis_id_chasse_fkey
        FOREIGN KEY (id_chasse) REFERENCES public.Chasse (id_chasse) ON DELETE CASCADE;

ALTER TABLE public.Recompense
    ADD CONSTRAINT Recompense_id_chasse_fkey
        FOREIGN KEY (id_chasse) REFERENCES public.Chasse (id_chasse) ON DELETE CASCADE;

ALTER TABLE public.Enigme
    ADD CONSTRAINT Enigme_id_chasse_fkey
        FOREIGN KEY (id_chasse) REFERENCES public.Chasse (id_chasse) ON DELETE CASCADE;

ALTER TABLE public.Enigme_Participant
    ADD CONSTRAINT Enigme_Participant_id_enigme_fkey
        FOREIGN KEY (id_enigme) REFERENCES public.Enigme (id_enigme) ON DELETE CASCADE;

ALTER TABLE public.Enigme_Participant
    ADD CONSTRAINT Enigme_Participant_id_participant_fkey
        FOREIGN KEY (id_participant) REFERENCES public.Participant (id_participant) ON DELETE CASCADE;

ALTER TABLE public.Indice
    ADD CONSTRAINT Indice_id_enigme_fkey
        FOREIGN KEY (id_enigme) REFERENCES public.Enigme (id_enigme) ON DELETE CASCADE;

ALTER TABLE public.Indice_Participant
    ADD CONSTRAINT Indice_Participant_id_indice_fkey
        FOREIGN KEY (id_indice) REFERENCES public.Indice (id_indice) ON DELETE CASCADE;

ALTER TABLE public.Indice_Participant
    ADD CONSTRAINT Indice_Participant_id_participant_fkey
        FOREIGN KEY (id_participant) REFERENCES public.Participant (id_participant) ON DELETE CASCADE;

ALTER TABLE public.Image_indice
    ADD CONSTRAINT Image_indice_id_indice_fkey
        FOREIGN KEY (id_indice) REFERENCES public.Indice (id_indice) ON DELETE CASCADE;

ALTER TABLE public.Son_indice
    ADD CONSTRAINT Son_indice_id_indice_fkey
        FOREIGN KEY (id_indice) REFERENCES public.Indice (id_indice) ON DELETE CASCADE;

ALTER TABLE public.Texte
    ADD CONSTRAINT Texte_id_indice_fkey
        FOREIGN KEY (id_indice) REFERENCES public.Indice (id_indice) ON DELETE CASCADE;