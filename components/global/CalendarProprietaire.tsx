'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Chasse from '@/classes/Chasse';
import CardChasse from '@/components/global/CardChasse';

type CalendarProps = {
  chasses: Chasse[];
  blockedDaysData: string[];
  onBlockDayChange: (dateString: string, isBlocked: boolean) => void;
};

export function CalendarProprietaire({
  chasses,
  blockedDaysData,
  onBlockDayChange,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);

  // Conversion en date UTC sans heure
  const toUTCDate = (date: Date) =>
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

  // Clé de date au format YYYY-MM-DD
  const getDateKey = (date: Date) => date.toISOString().split('T')[0];

  // Génération de la grille en UTC
  const getCalendarGrid = () => {
    const grid: (Date | null)[][] = Array.from({ length: 6 }, () => Array(7).fill(null));
    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth();

    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
    const startDayOfWeek = (firstDayOfMonth.getUTCDay() - 1 + 7) % 7; // Lundi comme premier jour

    let day = new Date(Date.UTC(year, month, 1 - startDayOfWeek));

    for (let week = 0; week < 6; week++) {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        grid[week][dayOfWeek] = toUTCDate(day);
        day.setUTCDate(day.getUTCDate() + 1);
      }
    }
    return grid;
  };

  // Vérification présence d'événement
  const isDateInChasse = (date: Date, chasse: Chasse) => {
    const start = new Date(chasse.getDateDebut() || 0);
    const end = new Date(chasse.getDateFin() || 0);

    const dateUTC = date.getTime();
    const startUTC = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
    const endUTC = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()) + 86399999;

    return dateUTC >= startUTC && dateUTC <= endUTC;
  };

  // Affichage du nom du mois
  const monthName = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    timeZone: 'UTC',
  })
    .format(currentDate)
    .replace(/^\w/, (c) => c.toUpperCase());

  // Navigation entre les mois
  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setUTCMonth(newDate.getUTCMonth() + increment);
    setCurrentDate(newDate);
    setSelectedEventDate(null);
  };

  // Gestion du clic sur un jour
  const toggleBlockDay = (date: Date) => {
    const dateKey = getDateKey(date);
    if (!isCurrentMonth(date) || chasses.some((c) => isDateInChasse(date, c))) return;
    setSelectedDate(date);
    setIsBlocking(!blockedDaysData.includes(dateKey));
  };

  // Confirmation du blocage/déblocage
  const confirmBlockDay = () => {
    if (selectedDate) {
      onBlockDayChange(getDateKey(selectedDate), isBlocking);
    }
    setSelectedDate(null);
    setIsBlocking(false);
  };

  // Vérification appartenance au mois courant
  const isCurrentMonth = (date: Date) => {
    return (
      date.getUTCMonth() === currentDate.getUTCMonth() &&
      date.getUTCFullYear() === currentDate.getUTCFullYear()
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button className="w-full max-w-md" onClick={() => setCurrentDate(new Date())}>
        <Home className="h-4 w-4" /> Revenir à aujourd&apos;hui
      </Button>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="outline" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold">
            {monthName} {currentDate.getUTCFullYear()}
          </h2>
          <Button variant="outline" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="text-center font-bold">
              {day}
            </div>
          ))}

          {getCalendarGrid()
            .flat()
            .map((date, index) => {
              if (!date) return <div key={index} className="h-12" />;

              const dateKey = getDateKey(date);
              const hasEvent = chasses.some((c) => isDateInChasse(date, c));
              const isBlocked = blockedDaysData.includes(dateKey);
              const isCurrent = isCurrentMonth(date);

              return (
                <div key={date.toISOString()} className="flex flex-col items-center">
                  {isCurrent ? (
                    hasEvent ? (
                      <Button
                        variant="outline"
                        className={cn('relative h-12 w-full bg-blue-100')}
                        onClick={() => setSelectedEventDate(date)}
                      >
                        {date.getUTCDate()}
                        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-blue-500" />
                      </Button>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn('relative h-12 w-full', isBlocked && 'bg-red-100')}
                            onClick={() => toggleBlockDay(date)}
                          >
                            {date.getUTCDate()}
                            {isBlocked && (
                              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                            )}
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer l&apos;action</AlertDialogTitle>
                            <AlertDialogDescription>
                              {isBlocking
                                ? `Bloquer le ${date.toLocaleDateString('fr-FR')} ? Aucun événement ne pourra avoir lieu ce jour là`
                                : `Débloquer le ${date.toLocaleDateString('fr-FR')} ? Des événements pourront à nouveau être planifiés`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmBlockDay}>
                              Confirmer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )
                  ) : (
                    <div className="h-12 w-full" />
                  )}
                </div>
              );
            })}
        </div>

        {selectedEventDate && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">
              Événements du {selectedEventDate.toLocaleDateString('fr-FR', { timeZone: 'UTC' })}
            </h3>
            <div className="flex gap-2">
              {chasses
                .filter((c) => isDateInChasse(selectedEventDate, c))
                .map((chasse, index) => (
                  <CardChasse key={index} chasse={chasse} className="w-full"/>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
