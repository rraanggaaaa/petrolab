import { useEffect, useState } from 'react';
import { useItems, useNotification } from '../../hooks';
import { Card, Button, Input, Select, LoadingSpinner } from '../../components/common';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminReports = () => {
    const { items, loading, fetchItems, fetchCategories, categories } = useItems();
    const { showSuccess, showError } = useNotification();

    const [reportData, setReportData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [generating, setGenerating] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        minQuantity: '',
        maxQuantity: '',
        minPrice: '',
        maxPrice: '',
        dateFrom: '',
        dateTo: '',
        sortBy: 'created_at',
        sortOrder: 'DESC',
    });

    // Summary statistics
    const [summary, setSummary] = useState({
        totalItems: 0,
        totalQuantity: 0,
        totalValue: 0,
        averagePrice: 0,
        categoriesCount: 0,
    });

    useEffect(() => {
        loadReportData();
        loadCategories();
    }, []);

    const loadCategories = async () => {
        await fetchCategories();
    };

    const loadReportData = async () => {
        try {
            const result = await fetchItems({ limit: 1000 });
            if (result?.success && result.data?.items) {
                setReportData(result.data.items);
                setFilteredData(result.data.items);
                calculateSummary(result.data.items);
                showSuccess('Data loaded successfully');
            }
        } catch (error) {
            showError('Failed to load report data');
        }
    };

    const calculateSummary = (data) => {
        const totalItems = data.length;
        const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalValue = data.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
        const averagePrice = totalItems > 0 ? totalValue / totalQuantity : 0;
        const uniqueCategories = [...new Set(data.map(item => item.category).filter(c => c))];

        setSummary({
            totalItems,
            totalQuantity,
            totalValue,
            averagePrice,
            categoriesCount: uniqueCategories.length,
        });
    };

    const applyFilters = () => {
        let filtered = [...reportData];

        // Filter by category
        if (filters.category) {
            filtered = filtered.filter(item => item.category === filters.category);
        }

        // Filter by search (name)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchLower) ||
                (item.description && item.description.toLowerCase().includes(searchLower))
            );
        }

        // Filter by quantity range
        if (filters.minQuantity) {
            filtered = filtered.filter(item => item.quantity >= parseInt(filters.minQuantity));
        }
        if (filters.maxQuantity) {
            filtered = filtered.filter(item => item.quantity <= parseInt(filters.maxQuantity));
        }

        // Filter by price range
        if (filters.minPrice) {
            filtered = filtered.filter(item => item.price >= parseInt(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(item => item.price <= parseInt(filters.maxPrice));
        }

        // Filter by date range
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter(item => new Date(item.created_at) >= fromDate);
        }
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59);
            filtered = filtered.filter(item => new Date(item.created_at) <= toDate);
        }

        // Sort data
        filtered.sort((a, b) => {
            let aVal = a[filters.sortBy];
            let bVal = b[filters.sortBy];

            if (filters.sortBy === 'price' || filters.sortBy === 'quantity') {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }

            if (filters.sortBy === 'created_at') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            if (filters.sortOrder === 'ASC') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        setFilteredData(filtered);
        calculateSummary(filtered);
        showSuccess(`Found ${filtered.length} items`);
    };

    const resetFilters = () => {
        setFilters({
            category: '',
            search: '',
            minQuantity: '',
            maxQuantity: '',
            minPrice: '',
            maxPrice: '',
            dateFrom: '',
            dateTo: '',
            sortBy: 'created_at',
            sortOrder: 'DESC',
        });
        setFilteredData(reportData);
        calculateSummary(reportData);
        showSuccess('Filters reset');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Export to Excel
    const exportToExcel = () => {
        setGenerating(true);
        try {
            const exportData = filteredData.map(item => ({
                'ID': item.id,
                'Item Name': item.name,
                'Category': item.category || 'Uncategorized',
                'Description': item.description || '-',
                'Quantity': item.quantity,
                'Price': item.price,
                'Total Value': item.price * item.quantity,
                'Created Date': formatDate(item.created_at),
                'Last Updated': formatDate(item.updated_at),
            }));

            // Add summary sheet
            const summaryData = [
                { 'Report Summary': 'Inventory Report' },
                { 'Total Items': summary.totalItems },
                { 'Total Quantity': summary.totalQuantity },
                { 'Total Value': formatPrice(summary.totalValue) },
                { 'Average Price': formatPrice(summary.averagePrice) },
                { 'Categories': summary.categoriesCount },
                { 'Generated On': new Date().toLocaleString() },
            ];

            const wsData = XLSX.utils.json_to_sheet(exportData);
            const wsSummary = XLSX.utils.json_to_sheet(summaryData);
            const wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, wsData, 'Inventory Data');
            XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

            XLSX.writeFile(wb, `inventory_report_${new Date().toISOString().split('T')[0]}.xlsx`);
            showSuccess('Excel report downloaded successfully');
        } catch (error) {
            showError('Failed to generate Excel report');
        } finally {
            setGenerating(false);
        }
    };

    // Export to PDF
    const exportToPDF = () => {
        setGenerating(true);
        try {
            const doc = new jsPDF('landscape');

            // Title
            doc.setFontSize(20);
            doc.setTextColor(33, 33, 33);
            doc.text('Inventory Report', 14, 20);

            // Subtitle
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            // Summary section
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Summary', 14, 45);

            const summaryY = 55;
            doc.setFontSize(10);
            doc.text(`Total Items: ${summary.totalItems}`, 14, summaryY);
            doc.text(`Total Quantity: ${summary.totalQuantity}`, 14, summaryY + 7);
            doc.text(`Total Value: ${formatPrice(summary.totalValue)}`, 14, summaryY + 14);
            doc.text(`Average Price: ${formatPrice(summary.averagePrice)}`, 14, summaryY + 21);
            doc.text(`Categories: ${summary.categoriesCount}`, 14, summaryY + 28);

            // Table
            const tableData = filteredData.map(item => [
                item.name,
                item.category || 'Uncategorized',
                item.quantity.toString(),
                formatPrice(item.price),
                formatPrice(item.price * item.quantity),
                formatDate(item.created_at),
            ]);

            doc.autoTable({
                startY: 90,
                head: [['Item Name', 'Category', 'Quantity', 'Price', 'Total Value', 'Created Date']],
                body: tableData,
                theme: 'striped',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontSize: 10,
                },
                bodyStyles: {
                    fontSize: 8,
                },
                columnStyles: {
                    0: { cellWidth: 50 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 30 },
                    5: { cellWidth: 30 },
                },
            });

            doc.save(`inventory_report_${new Date().toISOString().split('T')[0]}.pdf`);
            showSuccess('PDF report downloaded successfully');
        } catch (error) {
            showError('Failed to generate PDF report');
        } finally {
            setGenerating(false);
        }
    };

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...(categories || []).map(cat => ({ value: cat, label: cat })),
    ];

    const sortByOptions = [
        { value: 'name', label: 'Name' },
        { value: 'category', label: 'Category' },
        { value: 'quantity', label: 'Quantity' },
        { value: 'price', label: 'Price' },
        { value: 'created_at', label: 'Created Date' },
    ];

    if (loading && reportData.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-600 mt-1">Generate and export inventory reports</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <Card.Body className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalItems}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Quantity</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalQuantity}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                                <p className="text-2xl font-bold text-gray-900">{formatPrice(summary.totalValue)}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.categoriesCount}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                </svg>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Filters Card */}
            <Card>
                <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                </Card.Header>
                <Card.Body>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select
                            label="Category"
                            options={categoryOptions}
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        />

                        <Input
                            label="Search by Name"
                            type="text"
                            placeholder="Search items..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />

                        <Input
                            label="Min Quantity"
                            type="number"
                            placeholder="Min"
                            value={filters.minQuantity}
                            onChange={(e) => setFilters({ ...filters, minQuantity: e.target.value })}
                        />

                        <Input
                            label="Max Quantity"
                            type="number"
                            placeholder="Max"
                            value={filters.maxQuantity}
                            onChange={(e) => setFilters({ ...filters, maxQuantity: e.target.value })}
                        />

                        <Input
                            label="Min Price"
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        />

                        <Input
                            label="Max Price"
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        />

                        <Input
                            label="Date From"
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        />

                        <Input
                            label="Date To"
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        />

                        <Select
                            label="Sort By"
                            options={sortByOptions}
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        />

                        <Select
                            label="Sort Order"
                            options={[
                                { value: 'ASC', label: 'Ascending' },
                                { value: 'DESC', label: 'Descending' },
                            ]}
                            value={filters.sortOrder}
                            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="outline" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                        <Button variant="primary" onClick={applyFilters}>
                            Apply Filters
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Export Buttons */}
            <div className="flex justify-end space-x-3">
                <Button
                    variant="secondary"
                    onClick={exportToExcel}
                    isLoading={generating}
                    disabled={filteredData.length === 0}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Export to Excel
                </Button>
                <Button
                    variant="primary"
                    onClick={exportToPDF}
                    isLoading={generating}
                    disabled={filteredData.length === 0}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Export to PDF
                </Button>
            </div>

            {/* Data Table */}
            <Card>
                <Card.Header>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Inventory Data ({filteredData.length} items)
                        </h3>
                    </div>
                </Card.Header>
                <Card.Body className="p-0 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No data available. Please adjust your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {item.category || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatPrice(item.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatPrice(item.price * item.quantity)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.created_at)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminReports;