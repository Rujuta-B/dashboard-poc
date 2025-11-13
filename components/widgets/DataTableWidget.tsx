'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface DataTableProps {
  data: Record<string, any>[]
  columns?: string[]
}

export function DataTableWidget({ data, columns }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Defer the search term - allows input to stay responsive
  const deferredSearchTerm = useDeferredValue(searchTerm)
  
  // Auto-detect columns if not provided
  const tableColumns = columns || (data.length > 0 ? Object.keys(data[0]) : [])
  
  // Expensive filtering operation
  const filteredData = useMemo(() => {
    if (!deferredSearchTerm) return data
    
    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(deferredSearchTerm.toLowerCase())
      )
    )
  }, [data, deferredSearchTerm])
  
  const isStale = searchTerm !== deferredSearchTerm
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search table..."
          className="pl-10"
        />
        {isStale && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>
      
      <div 
        className={`overflow-auto max-h-[400px] transition-opacity duration-150 ${
          isStale ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No results found' : 'No data available'}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-50 border-b">
              <tr>
                {tableColumns.map(column => (
                  <th 
                    key={column}
                    className="text-left px-4 py-2 font-medium text-sm text-gray-700"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  {tableColumns.map(column => (
                    <td key={column} className="px-4 py-2 text-sm">
                      {String(row[column] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        Showing {filteredData.length} of {data.length} rows
      </div>
    </div>
  )
}
