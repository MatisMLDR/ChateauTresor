"use client"

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Label } from '../ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Loader2 } from 'lucide-react'
import Chasse from '@/classes/Chasse'

const InscriptionForm = ({ serverData }: { serverData: any }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!selectedDate) {
        throw new Error('Veuillez sélectionner une date')
      }

      const instanceChasse = new Chasse(serverData.chasse);

      await instanceChasse.addParticipant(serverData.idParticipant, selectedDate)
      
      toast.success('Inscription confirmée ! Redirection en cours...', {
        duration: 2000
      })
      
      setTimeout(() => {
        router.push('/participants/dashboard/chassesAchete')
      }, 2000)

    } catch (err: any) {
      console.error("Erreur d'inscription :", err)
      toast.error(err.message || "Erreur lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Inscription à {serverData.chasse?.titre}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date de participation</Label>
            <input
              type="date"
              id="date"
              name="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <p className="text-sm text-muted-foreground">
              Sélectionnez une date future
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Confirmer mon inscription'
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Instructions de paiement</h3>
          <p className="text-sm">
            Montant à régler : {serverData.chasse?.prix} €<br />
            Votre participation sera validée après réception du paiement
          </p>
        </div>

        <Toaster position="top-right" />
      </CardContent>
    </Card>
  )
}

export default InscriptionForm