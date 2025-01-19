'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Home } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

type CalendarProps = {
  events: { [date: string]: string[] };
};

export function CalendarProprietaire({ events }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDays, setBlockedDays] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);

  // Determine user's locale
  const userLocale = navigator.language || 'en-US';

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Get the capitalized month name
  const monthName = capitalizeFirstLetter(
    new Intl.DateTimeFormat(userLocale, { month: 'long' }).format(currentDate)
  );

  // Determine the first day of the week based on locale
  const localeFormatter = new Intl.DateTimeFormat(userLocale, { weekday: 'narrow' });
  const getFirstDayOfWeek = (): number => {
    // Create a date for each day of the week and find the one considered the first
    const days = [1, 2, 3, 4, 5, 6, 0]; // Monday to Sunday
    const formattedDays = days.map(day => {
      const date = new Date(2023, 0, day); // January 2023
      return localeFormatter.format(date);
    });
    const uniqueDays = Array.from(new Set(formattedDays));
    const firstDay = days[formattedDays.indexOf(uniqueDays[0])];
    return firstDay;
  };

  const firstDayOfWeek = getFirstDayOfWeek();

  // Generate a 6-week grid for the current month
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
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
    setSelectedEventDate(null);
  };

  const toggleBlockDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    if (!isCurrentMonth(date) || events[dateString]?.length > 0) return;
    setSelectedDate(date);
    setIsBlocking(!blockedDays.has(dateString));
  };

  const confirmBlockDay = () => {
    if (selectedDate && isCurrentMonth(selectedDate)) {
      const dateString = selectedDate.toISOString().split('T')[0];
      if (events[dateString]?.length > 0) return;
      setBlockedDays(prev => {
        const newSet = new Set(prev);
        if (isBlocking) {
          newSet.add(dateString);
        } else {
          newSet.delete(dateString);
        }
        return newSet;
      });
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
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  return (
    <>
        <Button className='w-full max-w-md' onClick={resetToToday}>
            <Home className="h-4 w-4" /> Revenir à aujourd&apos;hui
        </Button>
        <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
            <h2 className="text-xl font-bold mr-2">
                {monthName} {currentDate.getFullYear()}
            </h2>
            </div>
            <Button variant="outline" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        <div className="grid grid-cols-7 gap-2">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="text-center font-bold">
                {day}
            </div>
            ))}
            {calendarGrid.flat().map((date, index) => {
            if (!date) return <div key={index} className="h-12"></div>;
            const dateString = date.toISOString().split('T')[0];
            const hasEvents = events[dateString]?.length > 0;
            const isBlocked = blockedDays.has(dateString);
            const isCurrent = isCurrentMonth(date);
            return (
                <div key={date.toString()} className="flex flex-col items-center">
                {isCurrent ? (
                    hasEvents ? (
                    <Button
                        variant="outline"
                        className={cn(
                        "h-12 font-normal relative select-none bg-blue-100",
                        isBlocked && "bg-red-100"
                        )}
                        onClick={() => showEventsForDay(date)}
                    >
                        {date.getDate()}
                        {hasEvents && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                        )}
                        {isBlocked && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                    </Button>
                    ) : (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                            "h-12 font-normal relative select-none",
                            isBlocked && "bg-red-100"
                            )}
                            onClick={() => toggleBlockDay(date)}
                        >
                            {date.getDate()}
                            {isBlocked && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
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
                            <AlertDialogCancel onClick={() => setSelectedDate(null)}>Annuler</AlertDialogCancel>
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
            <h3 className="text-lg font-bold">Événements du {selectedEventDate.toLocaleDateString()}</h3>
            <ul className="list-disc pl-5">
                {events[selectedEventDate.toISOString().split('T')[0]]?.map((event, index) => (
                <li key={index}>{event}</li>
                ))}
            </ul>
            </div>
        )}
        </div>
    </>
  );
}