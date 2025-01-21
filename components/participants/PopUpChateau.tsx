import React from 'react'
import Link from 'next/link'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const PopUpChateau: React.FC<{ 
  chateau: any
  open: boolean
  onClose: () => void
}> = ({ chateau, open, onClose }) => {
  const getDifficultyText = (level: number) => {
    switch(level) {
      case 1: return 'Facile'
      case 2: return 'Intermédiaire'
      case 3: return 'Difficile'
      default: return 'N/A'
    }
  }

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <div className="flex items-start gap-4">
            {chateau?.image && (
              <img
                src={chateau.image}
                alt={chateau.nom}
                className="h-24 w-2/6 rounded-lg object-cover"
                width={96}
                height={96}
              />
            )}
            <div>
              <DrawerTitle className="text-xl">{chateau?.nom}</DrawerTitle>
              <DrawerDescription className="mt-1">
                {chateau?.description}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <h3 className="font-semibold">Chasses disponibles</h3>
          
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {chateau?.chasses?.length > 0 ? (
              chateau.chasses.map((chasse: any) => {
                const difficultyText = getDifficultyText(chasse.difficulte)
                
                return (
                  <Card key={chasse.id_chasse} className="p-3 flex justify-between">
                    <div className="flex items-start gap-3">
                      {chasse.image && (
                        <img
                          src={chasse.image}
                          alt={chasse.titre}
                          className="h-full w-2/6 rounded-lg object-cover"
                          width={48}
                          height={48}
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-base">{chasse.titre}</CardTitle>
                        <CardContent className="p-0 mt-1">                            
                            <div className="flex flex-col">
                              <div className="text-sm text-muted-foreground">
                                ⭐ {difficultyText}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                💶 {chasse.prix}€
                              </div>
                            </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {chasse.description}
                          </p>
                        </CardContent>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/participants/dashboard/chasses/${chasse.id_chasse}`}>
                        Détails
                      </Link>
                    </Button>
                  </Card>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune chasse disponible pour ce château
              </p>
            )}
          </div>
        </div>

        <DrawerFooter>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href={`/participants/dashboard/chateaux/${chateau?.id_chateau}`}>
                Voir la fiche complète
              </Link>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Fermer
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PopUpChateau