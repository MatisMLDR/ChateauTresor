ALTER TABLE enigme 
ADD CONSTRAINT fk_chasse 
FOREIGN KEY (id_chasse)
REFERENCES chasse (id_chasse)
ON DELETE CASCADE;

ALTER TABLE recompense
ADD CONSTRAINT fk_chasse 
FOREIGN KEY (id_chasse)
REFERENCES chasse (id_chasse)
ON DELETE CASCADE;

ALTER TABLE participation
ADD CONSTRAINT fk_chasse
FOREIGN KEY (id_chasse)
REFERENCES chasse (id_chasse)
ON DELETE CASCADE;

ALTER TABLE avis
ADD CONSTRAINT fk_chasse
FOREIGN KEY (id_chasse)
REFERENCES chasse (id_chasse)
ON DELETE CASCADE;

ALTER TABLE avis
ADD CONSTRAINT fk_participant
FOREIGN KEY (id_participant)
REFERENCES participant (id_participant)
ON DELETE CASCADE;

ALTER TABLE chasse
ADD CONSTRAINT fk_chateau
FOREIGN KEY (id_chateau)
REFERENCES chateau (id_chateau)
ON DELETE CASCADE;

ALTER TABLE chasse
ADD CONSTRAINT fk_equipe
FOREIGN KEY (id_equipe)
REFERENCES equipe_organisatrice (id_equipe)
ON DELETE CASCADE;
