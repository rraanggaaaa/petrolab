/**
 * Table Component
 * Tabel data dengan header dan body
 * @param {array} columns - Array of column definitions { header, accessor, cell }
 * @param {array} data - Array of data
 * @param {boolean} striped - Striped rows
 * @param {boolean} hoverable - Hover effect on rows
 */
const Table = ({ columns, data, striped = false, hoverable = true, className = '' }) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                style={{ width: column.width }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`
                  ${hoverable ? 'hover:bg-gray-50 transition-colors' : ''}
                  ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                `}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.cell ? column.cell(row) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;