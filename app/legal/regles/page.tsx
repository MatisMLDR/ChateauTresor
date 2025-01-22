import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function GameRulesPage() {
  return (
    <div className="container max-w-6xl py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Règles du Jeu</h1>
        <p className="text-muted-foreground mb-6">En vigueur au 22/01/2025</p>

        <div className="space-y-8">
          <p>
            Bienvenue dans nos chasses au trésor ! Les présentes règles définissent
            les modalités de participation et de fonctionnement des jeux. En
            participant, vous acceptez ces règles dans leur intégralité.
          </p>

          <Separator />

          {/* Article 1 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 1 : Système de points</h2>
            <p>
              Chaque chasse initialise pour chaque participant un nombre de points
              calculé comme suit : la somme des degrés de difficulté de chaque énigme
              (de 1 à 3) multipliée par la difficulté de la chasse (de 1 à 3).
            </p>
            <p>
              Par défaut, tous les indices sont cachés. Chaque indice révélé fait
              perdre au participant un nombre de points égal au degré d’aide de cet
              indice (de 1 à 3).
            </p>
          </div>

          <Separator />

          {/* Article 2 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 2 : Récompenses</h2>
            <p>
              À la fin de la chasse, les points restants permettent de débloquer
              une ou plusieurs récompenses disponibles. Les conditions d’obtention
              des récompenses sont déterminées par l’équipe organisatrice et
              peuvent varier d’une chasse à l’autre.
            </p>
          </div>

          <Separator />

          {/* Article 3 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 3 : Avis et retours</h2>
            <p>
              Les participants sont invités à donner des retours sur leur expérience
              en publiant des avis sous la chasse concernée. Ces retours permettent
              d’améliorer nos chasses au trésor et de mieux répondre à vos attentes.
            </p>
          </div>

          <Separator />

          {/* Article 4 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Article 4 : Classement général</h2>
            <p>
              Les résultats des participants sont inscrits dans un classement général.
              En fonction de leurs performances, ils peuvent également débloquer des
              haut-faits (succès spéciaux).
            </p>
          </div>

          <Separator />

          <p className="text-sm text-muted-foreground">
            Version en vigueur au 22/01/2025. Consultez régulièrement cette page
            pour vous tenir informé des éventuelles mises à jour.
          </p>
        </div>
      </Card>
    </div>
  );
}
