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
import CardChasse from './CardChasse';

type CalendarProps = {
  chasses: Chasse[];
  blockedDaysData: string[];
  onBlockDayChange: (dateString: string, isBlocked: boolean) => void;
};

export function CalendarProprietaire({ chasses, blockedDaysData, onBlockDayChange }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const monthName = capitalizeFirstLetter(
    new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(currentDate)
  );

  const localeFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'narrow' });
  const getFirstDayOfWeek = (): number => {
    const days = [1, 2, 3, 4, 5, 6, 0];
    const formattedDays = days.map((day) => {
      const date = new Date(2023, 0, day);
      return localeFormatter.format(date);
    });
    const uniqueDays = Array.from(new Set(formattedDays));
    const firstDay = days[formattedDays.indexOf(uniqueDays[0])];
    return firstDay;
  };

  const firstDayOfWeek = getFirstDayOfWeek();

  const getCalendarGrid = () => {
    const grid: (Date | null)[][] = Array.from({ length: 6 }, () => Array(7).fill(null));
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDayOfWeek = (firstDayOfMonth.getDay() - firstDayOfWeek + 7) % 7;
    let day = new Date(firstDayOfMonth);
    day.setDate(1 - startDayOfWeek);

    for (let week = 0; week < 6; week++) {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        grid[week][dayOfWeek] = new Date(day);
        day.setDate(day.getDate() + 1);
      }
    }
    return grid;
  };

  const calendarGrid = getCalendarGrid();

  const resetToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedEventDate(null);
  };

  const changeMonth = (increment: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
    setSelectedEventDate(null);
  };

  const blockedDaysSet = new Set<string>(blockedDaysData);

  const isDateInChasse = (date: Date, chasse: Chasse) => {
    const chasseStart = new Date(chasse.getDateDebut() || 0);
    const chasseEnd = new Date(chasse.getDateFin() || 0);
    
    // Conversion en UTC pour comparaison neutre
    const checkDateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const chasseStartUTC = Date.UTC(
      chasseStart.getUTCFullYear(),
      chasseStart.getUTCMonth(),
      chasseStart.getUTCDate()
    );
    const chasseEndUTC = Date.UTC(
      chasseEnd.getUTCFullYear(),
      chasseEnd.getUTCMonth(),
      chasseEnd.getUTCDate()
    ) + 86399999; // Ajoute 23h59m59s999ms

    return checkDateUTC >= chasseStartUTC && checkDateUTC <= chasseEndUTC;
  };

  const toggleBlockDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    if (!isCurrentMonth(date) || chasses.some(c => isDateInChasse(date, c))) return;
    setSelectedDate(date);
    setIsBlocking(!blockedDaysSet.has(dateString));
  };

  const confirmBlockDay = () => {
    if (selectedDate && isCurrentMonth(selectedDate)) {
      const dateString = selectedDate.toISOString().split('T')[0];
      if (chasses.some(c => isDateInChasse(selectedDate, c))) return;
      onBlockDayChange(dateString, isBlocking);
    }
    setSelectedDate(null);
    setIsBlocking(false);
  };

  const showEventsForDay = (date: Date) => {
    if (isCurrentMonth(date)) {
      setSelectedEventDate(date);
    }
  };

  const isCurrentMonth = (date: Date) => {
    return (
      date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <Button className="w-full max-w-md" onClick={resetToToday}>
        <Home className="h-4 w-4" /> Revenir à aujourd&apos;hui
      </Button>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="outline" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <h2 className="mr-2 text-xl font-bold">
              {monthName} {currentDate.getFullYear()}
            </h2>
          </div>
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
          {calendarGrid.flat().map((date, index) => {
            if (!date) return <div key={index} className="h-12"></div>;
            const dateString = date.toISOString().split('T')[0];
            const hasEvents = chasses.some(c => isDateInChasse(date, c));
            const isBlocked = blockedDaysSet.has(dateString);
            const isCurrent = isCurrentMonth(date);
            return (
              <div key={date.toString()} className="flex flex-col items-center">
                {isCurrent ? (
                  hasEvents ? (
                    <Button
                      variant="outline"
                      className={cn(
                        'relative h-12 select-none bg-blue-100 font-normal',
                        isBlocked && 'bg-red-100'
                      )}
                      onClick={() => showEventsForDay(date)}
                    >
                      {date.getDate()}
                      {hasEvents && (
                        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-blue-500" />
                      )}
                      {isBlocked && (
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'relative h-12 select-none font-normal',
                            isBlocked && 'bg-red-100'
                          )}
                          onClick={() => toggleBlockDay(date)}
                        >
                          {date.getDate()}
                          {isBlocked && (
                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmation</AlertDialogTitle>
                          <AlertDialogDescription>
                            {isBlocking
                              ? `Êtes-vous sûr de vouloir bloquer le ${date.toLocaleDateString()} ? Aucune chasse au trésor ne pourra être créée ce jour-là.`
                              : `Êtes-vous sûr de vouloir débloquer le ${date.toLocaleDateString()} ? Les organisateurs pourront à nouveau créer des chasses au trésor ce jour-là.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setSelectedDate(null)}>
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={confirmBlockDay}>Confirmer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )
                ) : (
                  <div className="h-12"></div>
                )}
              </div>
            );
          })}
        </div>
        {selectedEventDate && isCurrentMonth(selectedEventDate) && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">
              Événements du {selectedEventDate.toLocaleDateString()}
            </h3>
            {chasses
              .filter(c => isDateInChasse(selectedEventDate, c))
              .map((chasse, index) => (
                <CardChasse key={index} chasse={chasse} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}