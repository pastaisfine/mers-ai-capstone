'use client';

import { SeverityType, type Incident } from '../types';
import { ShieldAlert } from 'lucide-react';
import { Funnel } from 'lucide-react';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ActiveIncidentsListBox } from './ActiveIncidentsListBox';


/**
 * Left sidebar: searchable incident queue with severity filters and selection.
 * See src/components/guides/ActiveIncidentsList.md
 */

export interface ActiveIncidentsListProps {
  incidents: Incident[];
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterSeverity: string;
  setFilterSeverity: (severity: string) => void;
  theme: 'dark' | 'light';
}

export function ActiveIncidentsList({ incidents }: ActiveIncidentsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState('');
  const [filterSeverity, setFilterSeverity] = useState(SeverityType.ALL)

  //Create a filter function (Then pass the function in)
  const results = useMemo(() => {

      return incidents.filter((incident) => {
        const matchesSearchTitle = incident.title
        .toLowerCase()
        .includes(searchQuery.toLocaleLowerCase());

        const matchesSearchId = incident.id
        .toLowerCase()
        .includes(searchQuery.toLocaleLowerCase());

        const matchesSearchLocation = incident.location
        .toLowerCase()
        .includes(searchQuery.toLocaleLowerCase());

        const matchesSeverity =
        filterSeverity === SeverityType.ALL || incident.severity == filterSeverity

      return (matchesSearchTitle || matchesSearchId || matchesSearchLocation) && matchesSeverity;
      });
  }, [searchQuery, filterSeverity]);



  return (
    <div className="flex flex-col justify-between">
      <div className='flex flex-col'>
        <div id='header-row' className="p-4 flex justify-between items-center border-b border-slate-200">
          <h1 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-0">
            <ShieldAlert className="inline-block mr-2 w-4 h-4 text-[#E63946] ml-0" />Active Incidents ({incidents.length})
          </h1>
          
          {/* Lesson: HTML Dropdown */}
          <div>
            <Funnel className="inline-block mt-0 w-3.5 h-3.5 text-slate-500 ml-2" />
            <select 
              onChange={(e) => setFilterSeverity(e.target.value as SeverityType)} 
              className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-1 outline-none cursor-pointer" name="cases" id="cases">
              <option value={SeverityType.ALL}>All cases</option>
              <option value={SeverityType.CRITICAL}>Critical</option>
              <option value={SeverityType.URGENT}>Urgent</option>
              <option value={SeverityType.MODERATE}>Moderate</option>
              <option value={SeverityType.RESOLVED}>Resolved</option>
            </select>
          </div>
        </div>
        
        {/* Lesson: CSS Positioning: Relative, Static, Fixed, Absolute, Sticky*/}
        <div className="relative p-3 border-b border-slate-200"> 
          <Search className="absolute left-5.5 top-5.5 w-4 h-3.5 text-slate-400" /> 
          <input
            type="text"
            placeholder="Search address, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg outline-none transition-all border bg-slate-50 border-slate-200 text-slate-850 focus:border-blue-500 focus:bg-white shadow-inner"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {results.length === 0 ? <p className="text-center text-xs text-slate-400 p-8">No incidents match your filters.</p> : 
          results.map((incident) => (

          <ActiveIncidentsListBox 
            key={incident.id}
            incident={incident} 
            onClick={() => setSelectedIncidentId(incident.id)}
            selected={selectedIncidentId === incident.id}
          />
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50/50"> 
        <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
          Sorted by AI Priority. Critical alerts require immediate operator dispatch triage check.</p>
      </div>

    </div>
  ); 
}
