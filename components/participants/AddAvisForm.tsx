'use client';

import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UUID } from 'crypto';
import { Input } from '../ui/input';
import Avis from '@/classes/Avis';
import toast, { Toaster } from 'react-hot-toast';

interface AddAvisFormProps {
    chasseId: UUID;
    participantId: UUID;
    onSuccess?: () => void; // Callback optionnel après succès
}

export default function AddAvisForm({ chasseId, participantId, onSuccess }: AddAvisFormProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const MAX_TITLE_LENGTH = 50;
    const MAX_COMMENT_LENGTH = 500;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Veuillez sélectionner une note');
            return;
        }
        // Validation côté client
        if (rating === 0) {
            toast.error('Veuillez sélectionner une note');
            return;
        }

        if (title.length > MAX_TITLE_LENGTH) {
            toast.error(`Le titre ne doit pas dépasser ${MAX_TITLE_LENGTH} caractères`);
            return;
        }

        if (comment.length > MAX_COMMENT_LENGTH) {
            toast.error(`Le commentaire ne doit pas dépasser ${MAX_COMMENT_LENGTH} caractères`);
            return;
        }
        
        setIsSubmitting(true);

        try {
            const avis = new Avis({
                id_avis: crypto.randomUUID() as UUID,
                note: rating,
                description: comment,
                titre: title,
                id_chasse: chasseId,
                id_participant: participantId
            });

            await avis.create();

            // Réinitialisation du formulaire
            setRating(0);
            setComment('');
            setTitle('');

            toast.success('Avis ajouté avec succès!');

        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'avis:', error);
            toast.error('Une erreur est survenue lors de l\'ajout de l\'avis.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <Toaster />
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Note */}
                    <div>
                        <Label>Note</Label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="p-1 focus:outline-none"
                                    disabled={isSubmitting}
                                >
                                    <Star
                                        className={`w-6 h-6 transition-colors ${star <= rating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Titre */}
                    <div>
                        <Label htmlFor="title">Titre (optionnel)</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ajouter un titre..."
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Commentaire */}
                    <div>
                        <Label htmlFor="comment">Commentaire (optionnel)</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Partagez votre expérience..."
                            disabled={isSubmitting}
                            rows={4}
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <Button
                        type="submit"
                        disabled={rating === 0 || isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Publication en cours...
                            </>
                        ) : (
                            'Publier l\'avis'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}