import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function CGUPage() {
  return (
    <div className="container max-w-6xl py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Conditions g&eacute;n&eacute;rales d&apos;utilisation</h1>
        <p className="text-muted-foreground mb-6">En vigueur au 17/01/2025</p>

        <div className="space-y-8">
          <p>
            Les pr&eacute;sentes conditions g&eacute;n&eacute;rales d&apos;utilisation (dites &laquo; CGU &raquo;) ont pour objet l&apos;encadrement juridique des modalit&eacute;s de mise &agrave; disposition du site et des services par Prestige Heritage. Tout usage du site implique l&apos;acceptation sans r&eacute;serve des pr&eacute;sentes CGU.
          </p>

          <Separator />

          {/* Article 1 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 1 : Les mentions l&eacute;gales</h2>
            <p>
              L&apos;édition du site https://www.chateautresor.fr est assurée par la Société SARL Prestige Heritage au capital de 1000 euros, immatriculée au RCS de Grenoble sous le numéro 123456789ABCDE
              Siège social : 2 Place Doyen Gosse, 38000 Grenoble.
            </p>
            <p>
              Coordonnées : Téléphone 0607080910
            </p>
            <p>
              Email chateautresor@gmail.com. 
            </p>
            <p>
              Directeur de publication : Simon Zeru.
            </p>
            <p>
              Hébergeur : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.</p>
          </div>

          <Separator />

          {/* Article 2 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 2 : Acc&egrave;s au site</h2>
            <p>
              Le site https://www.chateautresor.fr permet à l&apos;Utilisateur un accès gratuit aux services suivants :
              Le site internet propose les services suivants :
            </p>
            <p>
              Le site internet ChâteauTrésor propose une plateforme permettant aux utilisateurs de découvrir,
              réserver et participer à des chasses au trésor interactives dans des châteaux partenaires. Les
              participants peuvent créer un compte, accéder à une carte interactive, suivre leur progression en
              temps réel et consulter leur historique et récompenses. Les organisateurs disposent d&apos;outils pour
              créer et gérer des chasses personnalisées, suivre les performances, et configurer des énigmes et
              récompenses. Les propriétaires de châteaux peuvent gérer leurs informations, réservations et
              statistiques via une interface dédiée. Enfin, le site offre aux administrateurs des fonctionnalités de
              supervision et de modération pour garantir la qualité des services et la sécurité des utilisateurs.
              Le site est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à Internet. Tous les
              frais supportés par l&apos;Utilisateur pour accéder au service (matériel informatique, logiciels, connexion
              Internet, etc.) sont à sa charge.
            </p>
            <p>
              L&apos;Utilisateur non membre n&apos;a pas accès aux services réservés. Pour cela, il doit s&apos;inscrire en
              remplissant le formulaire. En acceptant de s&apos;inscrire aux services réservés, l&apos;Utilisateur membre
              s&apos;engage à fournir des informations sincères et exactes concernant son état civil et ses coordonnées,
              notamment son adresse email.
            </p>
            <p>
              Pour accéder aux services, l&apos;Utilisateur doit ensuite s&apos;identifier à l&apos;aide de son identifiant et de son mot
              de passe qui lui seront communiqués après son inscription.
            </p>
            <p>
              Tout Utilisateur membre régulièrement inscrit pourra également solliciter sa désinscription en se
              rendant à la page dédiée sur son espace personnel. Celle-ci sera effective dans un délai raisonnable.
              Tout événement dû à un cas de force majeure ayant pour conséquence un dysfonctionnement du site
              ou serveur et sous réserve de toute interruption ou modification en cas de maintenance, n&apos;engage
              pas la responsabilité de https://www.chateautresor.fr. Dans ces cas, l&apos;Utilisateur accepte ainsi ne pas
              tenir rigueur à l&apos;éditeur de toute interruption ou suspension de service, même sans préavis.
              L&apos;Utilisateur a la possibilité de contacter le site par messagerie électronique à l&apos;adresse email de
              l&apos;éditeur communiqué à l&apos;ARTICLE 1</p>
          </div>

          <Separator />

          {/* Article 3 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 3 : Collecte des donn&eacute;es</h2>
            <p>
              Le site assure à l&apos;Utilisateur une collecte et un traitement d&apos;informations personnelles dans le respect
              de la vie privée conformément à la loi n°78-17 du 6 janvier 1978 relative à l&apos;informatique, aux fichiers
              et aux libertés.
            </p>
            <p>
              En vertu de la loi Informatique et Libertés, en date du 6 janvier 1978, l&apos;Utilisateur dispose d&apos;un droit
              d&apos;accès, de rectification, de suppression et d&apos;opposition de ses données personnelles. L&apos;Utilisateur
              exerce ce droit par mail à l&apos;adresse email chateautresor@gmail.com
            </p>
          </div>

          <Separator />

          {/* Article 4 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 4 : Propri&eacute;t&eacute; intellectuelle</h2>
            <p>
              Les marques, logos, signes ainsi que tous les contenus du site (textes, images, son…) font l&apos;objet
              d&apos;une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d&apos;auteur.
            </p>
            <p>
              L&apos;Utilisateur doit solliciter l&apos;autorisation préalable du site pour toute reproduction, publication, copie
              des différents contenus. Il s&apos;engage à une utilisation des contenus du site dans un cadre strictement
              privé, toute utilisation à des fins commerciales et publicitaires est strictement interdite.
            </p>
            <p>
              Toute représentation totale ou partielle de ce site par quelque procédé que ce soit, sans l&apos;autorisation
              expresse de l&apos;exploitant du site Internet constituerait une contrefaçon sanctionnée par l&apos;article L 335-2
              et suivants du Code de la propriété intellectuelle.
            </p>
            <p>
              Il est rappelé conformément à l&apos;article L122-5 du Code de propriété intellectuelle que l&apos;Utilisateur qui
              reproduit, copie ou publie le contenu protégé doit citer l&apos;auteur et sa source.
            </p>
          </div>

          <Separator />

          {/* Article 5 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 5 : Responsabilit&eacute;</h2>
            <p>
              Les sources des informations diffusées sur le site https://www.chateautresor.fr sont réputées fiables
              mais le site ne garantit pas qu&apos;il soit exempt de défauts, d&apos;erreurs ou d&apos;omissions.
            </p>
            <p>
              Les informations communiquées sont présentées à titre indicatif et général sans valeur contractuelle.
              Malgré des mises à jour régulières, le site https://www.chateautresor.fr ne peut être tenu responsable
              de la modification des dispositions administratives et juridiques survenant après la publication. De
              même, le site ne peut être tenue responsable de l&apos;utilisation et de l&apos;interprétation de l&apos;information
              contenue dans ce site.
            </p>
            <p>
              L&apos;Utilisateur s&apos;assure de garder son mot de passe secret. Toute divulgation du mot de passe, quelle
              que soit sa forme, est interdite. Il assume les risques liés à l&apos;utilisation de son identifiant et mot de
              passe. Le site décline toute responsabilité.
            </p>
            <p>
              Le site https://www.chateautresor.fr ne peut être tenu pour responsable d&apos;éventuels virus qui
              pourraient infecter l&apos;ordinateur ou tout matériel informatique de l&apos;Internaute, suite à une utilisation, à
              l&apos;accès, ou au téléchargement provenant de ce site.
            </p>
            <p>
              La responsabilité du site ne peut être engagée en cas de force majeure ou du fait imprévisible et
              insurmontable d&apos;un tiers.
            </p>
          </div>

          <Separator />

          {/* Article 6 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 6 : Liens hypertextes</h2>
            <p>
              Des liens hypertextes peuvent être présents sur le site. L&apos;Utilisateur est informé qu&apos;en cliquant sur ces
              liens, il sortira du site https://www.chateautresor.fr. Ce dernier n&apos;a pas de contrôle sur les pages web
              sur lesquelles aboutissent ces liens et ne saurait, en aucun cas, être responsable de leur contenu.
            </p>
          </div>

          <Separator />

          {/* Article 7 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 7 : Cookies</h2>
            <p>
              L&apos;Utilisateur est informé que lors de ses visites sur le site, un cookie peut s&apos;installer automatiquement
              sur son logiciel de navigation.
            </p>
            <p>
              Les cookies sont de petits fichiers stockés temporairement sur le disque dur de l&apos;ordinateur de
              l&apos;Utilisateur par votre navigateur et qui sont nécessaires à l&apos;utilisation du site
              https://www.chateautresor.fr. Les cookies ne contiennent pas d&apos;information personnelle et ne peuvent
              pas être utilisés pour identifier quelqu&apos;un. Un cookie contient un identifiant unique, généré aléatoirement et donc anonyme. Certains cookies expirent à la fin de la visite de l&apos;Utilisateur, d&apos;autres
              restent.
            </p>
            <p>
              L&apos;information contenue dans les cookies est utilisée pour améliorer le site
              https://www.chateautresor.fr.
              En naviguant sur le site, L&apos;Utilisateur les accepte.
              L&apos;Utilisateur pourra désactiver ces cookies par l&apos;intermédiaire des paramètres figurant au sein de son
              logiciel de navigation.
            </p>
          </div>

          <Separator />

          {/* Article 8 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 8 : Publication par l&apos;Utilisateur</h2>
            <p>
              Le site permet aux membres de publier les contenus suivants : Avis et chasses aux trésors.
            </p>
            <p>
              Dans ses publications, le membre s&apos;engage à respecter les règles de la Netiquette (règles de bonne
              conduite de l&apos;internet) et les règles de droit en vigueur.
            </p>
            <p>
              Le site peut exercer une modération sur les publications et se réserve le droit de refuser leur mise en
              ligne, sans avoir à s&apos;en justifier auprès du membre.
            </p>
            <p>
              Le membre reste titulaire de l&apos;intégralité de ses droits de propriété intellectuelle. Mais en publiant une
              publication sur le site, il cède à la société éditrice le droit non exclusif et gratuit de représenter,
              reproduire, adapter, modifier, diffuser et distribuer sa publication, directement ou par un tiers autorisé,
              dans le monde entier, sur tout support (numérique ou physique), pour la durée de la propriété
              intellectuelle. Le Membre cède notamment le droit d&apos;utiliser sa publication sur internet et sur les
              réseaux de téléphonie mobile.
            </p>
            <p>
              La société éditrice s&apos;engage à faire figurer le nom du membre à proximité de chaque utilisation de sa
              publication.
            </p>
            <p>
              Tout contenu mis en ligne par l&apos;Utilisateur est de sa seule responsabilité. L&apos;Utilisateur s&apos;engage à ne
              pas mettre en ligne de contenus pouvant porter atteinte aux intérêts de tierces personnes. Tout
              recours en justice engagé par un tiers lésé contre le site sera pris en charge par l&apos;Utilisateur.
            </p>
            <p>
              Le contenu de l&apos;Utilisateur peut être à tout moment et pour n&apos;importe quelle raison supprimé ou
              modifié par le site, sans préavis.
            </p>
          </div>

          <Separator />

          {/* Article 9 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 9 : Droit applicable</h2>
            <p>
              La législation française s&apos;applique au présent contrat. En cas d&apos;absence de résolution amiable d&apos;un
              litige né entre les parties, les tribunaux français seront seuls compétents pour en connaître.
              Pour toute question relative à l&apos;application des présentes CGU, vous pouvez joindre l&apos;éditeur aux
              coordonnées inscrites à l&apos;ARTICLE 1.
            </p>
          </div>

          <Separator className="my-6" />

          <p className="text-sm text-muted-foreground">
            Version en vigueur au 17/01/2025. <Link href="https://www.chateautresor.fr">https://www.chateautresor.fr</Link> se r&eacute;serve le droit de modifier unilat&eacute;ralement les CGU. Consultation r&eacute;guli&egrave;re recommand&eacute;e.
          </p>
        </div>
      </Card>
    </div>
  );
}