import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-6xl py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Politique de confidentialité</h1>
        <p className="text-muted-foreground mb-6">En vigueur au 17/01/2025</p>

        <div className="space-y-8">
          <p>
            La présente politique de confidentialité s&apos;applique aux traitements de données personnelles effectués par la SARL Prestige Heritage dans le cadre de l&apos;exploitation du site chateau-tresor.vercel.app.
          </p>

          <Separator />

          {/* 1. Responsable */}
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Responsable du traitement</h2>
            <p>
              SARL Prestige Heritage (RCS Grenoble 123456789ABCDE)<br/>
              Siège social : 2 Place Doyen Gosse, 38000 Grenoble<br/>
              Email : chateautresor@gmail.com<br/>
              Téléphone : 06 07 08 09 10
            </p>
          </div>

          <Separator />

          {/* 2. Finalités */}
          <div>
            <h2 className="text-xl font-semibold mb-4">2. Finalités et bases légales</h2>
            <p className="mb-2">Les données sont traitées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir les services contractuels (base légale : exécution du contrat)</li>
              <li>Gérer les comptes utilisateurs (base légale : intérêt légitime)</li>
              <li>Répondre aux demandes légales (base légale : obligation légale)</li>
            </ul>
          </div>

          <Separator />

          {/* 3. Données */}
          <div>
            <h2 className="text-xl font-semibold mb-4">3. Catégories de données traitées</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Données d&apos;identification (nom, prénom, email)</li>
              <li>Données de réservation (dates, châteaux concernés)</li>
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              Aucune donnée sensible n&apos;est collectée.
            </p>
          </div>

          <Separator />

          {/* 4. Destinataires */}
          <div>
            <h2 className="text-xl font-semibold mb-4">4. Destinataires des données</h2>
            <p>Seules les personnes suivantes ont accès aux données :</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Personnel habilité de la SARL Prestige Heritage</li>
              <li>Prestataires techniques sous contrat de confidentialité</li>
              <li>Autorités judiciaires sur réquisition légale</li>
            </ul>
          </div>

          <Separator />

          {/* 5. Durée */}
          <div>
            <h2 className="text-xl font-semibold mb-4">5. Durée de conservation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Données actives des comptes : 3 ans après dernière activité</li>
              <li>Données techniques : 1 an</li>
              <li>Preuves de transaction : 5 ans (obligation légale)</li>
            </ul>
          </div>

          <Separator />

          {/* 6. Droits */}
          <div>
            <h2 className="text-xl font-semibold mb-4">6. Droits des personnes</h2>
            <p className="mb-2">Conformément aux articles 15 à 22 du RGPD, vous pouvez :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accéder à vos données (article 15)</li>
              <li>Demander leur rectification (article 16)</li>
              <li>Demander l&apos;effacement (article 17)</li>
              <li>Demander la limitation du traitement (article 18)</li>
              <li>Vous opposer au traitement (article 21)</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits :<br/>
              Email : <Link href="mailto:chateautresor@gmail.com">chateautresor@gmail.com</Link><br/>
              Par courrier : SARL Prestige Heritage - 2 Place Doyen Gosse, 38000 Grenoble
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Pièce d&apos;identité requise pour vérification
            </p>
          </div>

          <Separator />

          {/* 7. Cookies */}
          <div>
            <h2 className="text-xl font-semibold mb-4">7. Politique des cookies</h2>
            <p>
              Nous utilisons exclusivement des cookies techniques nécessaires au fonctionnement du site. Ces cookies ne nécessitent pas de consentement préalable selon les dispositions de l&apos;article 82 de la Loi Informatique et Libertés.
            </p>
            <p className="mt-2">
              Liste des cookies :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Session utilisateur : durée de la navigation</li>
              <li>CSRF Token : durée de la session</li>
            </ul>
          </div>

          <Separator className="my-6" />

          <p className="text-sm text-muted-foreground">
            Dernière mise à jour : 17/01/2025<br/>
            Conforme aux recommandations de la CNIL et au RGPD<br/>
            <Link href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees" className="underline">
              Consulter le texte officiel du RGPD
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}