import { TableConfig } from '@/types'

interface TableWidgetProps {
  config: TableConfig
}

export function TableWidget({ config }: TableWidgetProps) {
  // Mock data for demo
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
  ]

  const columns = config.columns.length > 0 ? config.columns : [
    { id: 'name', label: 'Name', type: 'text' as const },
    { id: 'email', label: 'Email', type: 'text' as const },
    { id: 'status', label: 'Status', type: 'text' as const },
  ]

  return (
    <div className="w-full h-full overflow-auto">
      <div className="min-w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {columns.map(column => (
                <th key={column.id} className="text-left py-2 px-2 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {columns.map(column => (
                  <td key={column.id} className="py-2 px-2">
                    {row[column.id as keyof typeof row] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}