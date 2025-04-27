import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';

interface GenreSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GenreSelect({ value, onChange }: GenreSelectProps) {
  const { data: genres, isLoading } = useQuery<any[]>({
    queryKey: ['/api/genres'],
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-gray-900 border-gray-700">
        <SelectValue placeholder="Select a genre" />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gray-700">
        {genres?.map((genre) => (
          <SelectItem key={genre.id} value={genre.name}>
            <div className="flex items-center gap-2">
              <i className={genre.icon}></i>
              <span>{genre.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
