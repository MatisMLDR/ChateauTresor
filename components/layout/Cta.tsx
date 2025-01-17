import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { TitleTwo } from '../ui/TitleTwo'

type CtaProps = {
  type?: "organisateur" | "participant"
}

const Cta = ({ type="participant" }: CtaProps) => {
  return (
    <section className="w-full py-10 md:py-20 lg:py-32 bg-[#1a3b5d]" id="cta">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
          <TitleTwo text={type === "organisateur" ? "Prêt à révolutionner votre organisation ?" : "Prêt à venir découvrir les plus beaux châteaux de loire ?"} color={"light"} />
          <p className="max-w-[600px] text-lg md:text-xl">
            {
              type === "organisateur" ?
              "Inscrivez-vous maintenant et accédez au différents plans pour les fonctionnalités premium."
              : "Inscrivez-vous maintenant et trouver la chasse parfaite pour vous."
            }
          </p>
          <div className="w-full max-w-sm">
          <Button className="w-full bg-[#8797af] hover:bg-[#6d8096] text-white">
          <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-white"
          href={`/authentication/login?redirect=${type}`}
          >
          Commencer Maintenant
          </Link>
          </Button>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Cta