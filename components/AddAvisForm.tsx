'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';

interface AddAvisFormProps {
    chasseId: UUID;
}

export default function AddAvisForm({ chasseId }: AddAvisFormProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        try {
            const chasse = await Chasse.readId(chasseId);
            await chasse.addAvis(rating, comment);
            // Réinitialiser le formulaire
            setRating(0);
            setComment('');
            // Vous pourriez vouloir ajouter un retour à l'utilisateur ici
            alert('Avis ajouté avec succès!');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'avis:', error);
            alert('Une erreur est survenue lors de l\'ajout de l\'avis.');
        }
    };

    return (
        <Card>
            <CardContent className={"pt-6"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="rating">Note</Label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="comment">Commentaire (optionnel)</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Partagez votre expérience..."
                        />
                    </div>
                    <Button type="submit" disabled={rating === 0}>Publier l&apos;avis</Button>
                </form>
            </CardContent>
        </Card>
    );
}

