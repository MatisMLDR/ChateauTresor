import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

export function formatFullName(firstName: string, lastName: string): string {
  const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
  return `${formattedFirstName} ${formattedLastName}`;
}

export function convertTimeToMinutesAndHours(timeString: string) {
  // Split the time string into parts
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  // Convert to total minutes
  const totalMinutes = hours * 60 + minutes;

  // Format the output
  const hoursFormatted = `${hours}h`;
  const minutesFormatted = `${totalMinutes}min`;

  return { totalMinutes, hoursFormatted, minutesFormatted };
}
