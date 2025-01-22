import Chasse from '@/classes/Chasse'
import { Participant } from '@/classes/Participant'
import Loader from '@/components/global/loader'
import InscriptionForm from '@/components/participants/InscriptionForm'
import { createClient } from '@/utils/supabase/server'
import { UUID } from 'crypto'
import Link from 'next/link'

const InscriptionChasse = async ({ params }: { params: { id: string } }) => {
  const { id } = await params

  const supabase = createClient()
  const user = (await supabase.auth.getUser()).data.user
  const idUser = user?.id as UUID

  const participant = await Participant.readByIdUser(idUser)
  const chasse = await Chasse.readId(id as UUID)

  if (!chasse) return <Loader />

  const serverData = {
    idUser,
    idParticipant: participant?.getIdParticipant(),
    chasse: chasse.toObject()
  }

  return (
    <div className="container max-w-4xl py-8 px-4 text-center">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Finaliser votre inscription
          </h1>
          <p className="text-muted-foreground">
            Dernière étape avant l&apos;aventure !
          </p>
        </div>

        <div className="prose prose-sm max-w-none">
          <h2 className="text-xl font-semibold mb-4">Moyen de paiement</h2>
          <p>
            Veuillez envoyer votre chèque à l&apos;adresse suivante :<br />
            <Link
              href="https://www.google.com/maps/search/I.U.T.2+Institut+Universitaire+de+Technologie+-+B%C3%A2timent/@45.1916643,5.7171449,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDExMC4wIKXMDSoASAFQAw%3D%3D"
              className="text-primary underline hover:text-primary/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              2 Pl. Doyen Gosse, 38000 Grenoble
            </Link>
          </p>
          
          <div className="my-6 p-4 bg-muted rounded-lg">
            <p className="font-medium">
              Montant total : {chasse.getPrix()} €
            </p>
            <p className="text-sm text-muted-foreground">
              Libellez votre chèque à l&apos;ordre de "Trésor Public"
            </p>
          </div>
        </div>

        <InscriptionForm serverData={serverData} />
      </div>
    </div>
  )
}

export default InscriptionChasse