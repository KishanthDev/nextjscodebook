'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Plus } from 'lucide-react';
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
} from '@/ui/command';
import { Card } from '@/ui/card';
import Pagination from '../Pagination';
import invoices from './invoices.json';
import InvoicesTable from './InvoicesTable';

export default function InvoicesView() {
    const [searchTerm, setSearchTerm] = useState('');
    const [companyQuery, setCompanyQuery] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Extract unique company names
    const companyNames = Array.from(new Set(invoices.map((inv) => inv.company)));

    // Filter logic
    const filteredInvoices = invoices.filter((invoice) => {
        const matchesCompany =
            companyFilter === 'all' || companyFilter === ''
                ? true
                : invoice.company === companyFilter;

        const matchesSearch =
            invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());

        const invoiceDate = new Date(invoice.createdAt);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        const matchesDate =
            (!from || invoiceDate >= from) && (!to || invoiceDate <= to);

        return matchesCompany && matchesSearch && matchesDate;
    });

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, companyFilter, fromDate, toDate, itemsPerPage]);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-white">Invoices</h1>

            {/* Search + Generate Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Input
                    placeholder="Search by email or invoice no..."
                    className="w-full sm:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    Generate Invoice
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start justify-between sm:items-end relative z-10">
                <div className="w-full sm:w-64 relative">
                    <Command className='rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'>
                        <CommandInput
                            placeholder="Search company..."
                            className="h-10 px-3 text-sm"
                            value={companyQuery}
                            onValueChange={(val) => setCompanyQuery(val)}
                        />
                        {companyQuery.length > 0 && (
                            <div className="absolute top-full mt-1 w-full z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                                <CommandList className="max-h-60 overflow-y-auto">
                                    <CommandEmpty className="p-2 text-sm text-gray-500">
                                        No company found.
                                    </CommandEmpty>
                                    <CommandItem
                                        onSelect={() => {
                                            setCompanyFilter('all');
                                            setCompanyQuery('');
                                        }}
                                        className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        All
                                    </CommandItem>
                                    {companyNames
                                        .filter((name) =>
                                            name.toLowerCase().includes(companyQuery.toLowerCase())
                                        )
                                        .map((name) => (
                                            <CommandItem
                                                key={name}
                                                onSelect={() => {
                                                    setCompanyFilter(name);
                                                    setCompanyQuery('');
                                                }}
                                                className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                {name}
                                            </CommandItem>
                                        ))}
                                </CommandList>
                            </div>
                        )}
                    </Command>
                </div>

                {/* Date Filters */}
                <div className="flex gap-6">
                    <Input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-36 rounded-md border border-gray-300 dark:border-gray-700 px-2 text-sm"
                    />
                    <Input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-36 rounded-md border border-gray-300 dark:border-gray-700 px-2 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <Card className="overflow-auto rounded-2xl shadow-sm">
                <InvoicesTable invoices={paginatedInvoices} />
            </Card>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </div>
    );
}
