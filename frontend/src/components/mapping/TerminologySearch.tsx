// src/components/mapping/TerminologySearch.tsx
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchTerminology } from '../../api/mapping';
import { Search, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import type { TerminologyMapping } from '../../api/types';

interface TerminologySearchProps {
  placeholder?: string;
  onBestMatchChange?: (match: TerminologyMapping | null) => void;
  showAlternatives?: boolean;
}

export function TerminologySearch({
  placeholder = 'Type "Amavata"…',
  onBestMatchChange,
  showAlternatives = true,
}: TerminologySearchProps) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useQuery({
    queryKey: ['terminology-search', debounced],
    queryFn: () => searchTerminology(debounced),
    enabled: debounced.trim().length > 1,
  });

  const bestMatch = useMemo(() => data?.bestMatch ?? null, [data]);

  useEffect(() => {
    onBestMatchChange?.(bestMatch);
  }, [bestMatch, onBestMatchChange]);

  return (
    <div>
      <div className="flex items-center gap-2 bg-surface border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-accent">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
        />
      </div>

      {debounced.trim().length > 1 && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Mapping Results</p>
            {isFetching && <Skeleton className="h-20 w-full" />}
            {!isFetching && bestMatch && (
              <div className="rounded-xl border border-success/30 bg-success-light p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge tone="success"><Sparkles size={12} /> Best Match</Badge>
                  <span className="text-xs text-slate-500">{bestMatch.matchScore}% confidence</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-brand">{bestMatch.namasteTerm}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div>
                    <p className="text-slate-500">ICD-11 Code</p>
                    <p className="font-semibold text-brand">{bestMatch.icd11Code}</p>
                    <p className="text-slate-500">{bestMatch.icd11Term}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">NAMASTE Code</p>
                    <p className="font-semibold text-brand">{bestMatch.namasteCode}</p>
                  </div>
                </div>
              </div>
            )}
            {!isFetching && !bestMatch && (
              <EmptyState emoji="🔍" title="No match found" description="Try a different traditional medicine term or ICD-11 code." />
            )}
          </div>

          {showAlternatives && data && data.alternatives.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Alternative Matches</p>
              <div className="hidden sm:block overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-surface text-slate-500 text-xs">
                    <tr>
                      <th className="text-left font-medium px-3 py-2">Match</th>
                      <th className="text-left font-medium px-3 py-2">ICD Code</th>
                      <th className="text-left font-medium px-3 py-2">NAMASTE Code</th>
                      <th className="text-left font-medium px-3 py-2">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.alternatives.map((alt) => (
                      <tr key={alt.namasteCode} className="hover:bg-surface/60">
                        <td className="px-3 py-2 font-medium text-brand">{alt.namasteTerm}</td>
                        <td className="px-3 py-2 text-slate-600">{alt.icd11Code}</td>
                        <td className="px-3 py-2 text-slate-600">{alt.namasteCode}</td>
                        <td className="px-3 py-2 text-slate-600">{alt.matchScore}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sm:hidden space-y-2">
                {data.alternatives.map((alt) => (
                  <div key={alt.namasteCode} className="rounded-lg border border-slate-200 p-3 text-xs">
                    <p className="font-semibold text-brand mb-1">{alt.namasteTerm}</p>
                    <div className="grid grid-cols-2 gap-y-1 text-slate-600">
                      <span>ICD: {alt.icd11Code}</span>
                      <span>NAMASTE: {alt.namasteCode}</span>
                      <span className="col-span-2">Score: {alt.matchScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}