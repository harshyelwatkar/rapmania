import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  
  // Check if less than 24 hours ago
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);
  
  if (diffHrs < 24) {
    // Show hours ago
    const hours = Math.floor(diffHrs);
    if (hours === 0) {
      const mins = Math.floor((diffMs / (1000 * 60)));
      return mins === 0 ? 'just now' : `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
    }
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffHrs < 48) {
    return 'yesterday';
  } else if (diffHrs < 168) { // less than a week
    const days = Math.floor(diffHrs / 24);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Default to full date format
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }).format(d);
}

export function shortenText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateAvatarUrl(username: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        resolve(successful);
      } catch (err) {
        resolve(false);
      }
    }
  });
}

export function shareToTwitter(text: string, url: string): void {
  const tweetText = encodeURIComponent(shortenText(text, 200));
  const tweetUrl = encodeURIComponent(url);
  window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
}

export function shareToWhatsApp(text: string, url: string): void {
  const messageText = encodeURIComponent(`${shortenText(text, 200)}\n\n${url}`);
  window.open(`https://wa.me/?text=${messageText}`, '_blank');
}
