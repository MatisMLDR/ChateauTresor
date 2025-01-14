import EquipeOrganisatrice from "@/classes/EquipeOrganisatrice";
import Chasse from "@/classes/EquipeOrganisatrice";
import {
  getEquipeById
} from "@/utils/dao/EquipeOrganisatriceUtils";

describe("Tests create()", () => {
  it("devrait créer une chasse sans renvoyer une erreur", async () => {
    const equipe = new EquipeOrganisatrice({ 
        id_equipe: "4550bc17-2bb3-4272-bef1-ce7e30a4372a",
        type: 'Entreprise',
        n_siret:  '123456789',
        id_taxes:   '987654321',
        nb_membres: 4,
        site_web:  'https://www.jaipasdesiteinternet.com',
        adresse_postale: 'J habite là',
        telephone:  '0405060708',
        id_user: '514e8181-1f82-4f81-8c16-00bf216d3b0a',
    });

    await expect(equipe.create()).resolves.not.toThrow(Error);
    await expect(EquipeOrganisatrice.readId("4550bc17-2bb3-4272-bef1-ce7e30a4372a")).resolves.toBeDefined();
  });
});

describe("Test API", () => {
  it("devrait récupérer l'équipe organisatrice d'ID 1 depuis la base de données", async () => {
    const equipe = await getEquipeById("4550bc17-2bb3-4272-bef1-ce7e30a4372a");
    expect(equipe).toBeDefined();
    expect(equipe.id_equipe).toEqual("4550bc17-2bb3-4272-bef1-ce7e30a4372a");
  });
});

describe("Tests readId()", () => {
  it("devrait récupérer l'équipe organisatrice d'ID 1 depuis la base de données", async () => {
    const equipe = await EquipeOrganisatrice.readId("4550bc17-2bb3-4272-bef1-ce7e30a4372a");
    expect(equipe).toBeDefined();
    expect(equipe.id_equipe).toEqual(1);
  });
  it("devrait throw une erreur car l'id est inexistant", async () => {
    await expect(EquipeOrganisatrice.readId("4550bc17-2bb3-4272-bef1-ce7e30a4372b")).rejects.toThrow(Error);
  });
});

describe("Tests delete()", () => {
  it("", async () => {
    const equipe = await EquipeOrganisatrice.readId("4550bc17-2bb3-4272-bef1-ce7e30a4372a");
    await equipe.delete();

    expect(equipe.read()).toThrow('Equipe does not exist');
  });
});

describe("Tests update()", () => {
  it("", async () => {
    const equipe = await EquipeOrganisatrice.readId("4550bc17-2bb3-4272-bef1-ce7e30a4372a");
    const randomInt = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    equipe.setAdressePostale(`${randomInt} place de La Place`);
    await equipe.update();
    const equipe1 = await Chasse.readId("4550bc17-2bb3-4272-bef1-ce7e30a4372a");
    expect(equipe.getAdressePostale()).toEqual(equipe1.getAdressePostale());
  });
});

