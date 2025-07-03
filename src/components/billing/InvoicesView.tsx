'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Card } from '@/ui/card';
import { Plus } from 'lucide-react';
import Pagination from '../Pagination';

const invoices = [
  {
    company: 'Oxnia Corp',
    customerEmail: 'maria@oxnia.com',
    createdAt: '2025-07-01',
    invoiceNo: 'INV-1001',
    price: 1200,
    currency: 'USD',
    status: 'Paid',
  },
  {
    company: 'NextTech',
    customerEmail: 'john@nexttech.io',
    createdAt: '2025-06-25',
    invoiceNo: 'INV-1002',
    price: 500,
    currency: 'USD',
    status: 'Pending',
  },
  // Add more mock rows
];

export default function InvoicesView() {
  const [companyFilter, setCompanyFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 🔧 New states for date filter
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesCompany =
      companyFilter === 'all' ||
      invoice.company.toLowerCase().includes(companyFilter.toLowerCase());

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
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Invoices</h1>

      {/* Search + Generate */}
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
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        {/* Company Dropdown */}
        <div className="w-full sm:w-64">
          <Select onValueChange={setCompanyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Oxnia">Oxnia</SelectItem>
              <SelectItem value="NextTech">NextTech</SelectItem>
              {/* More options if needed */}
            </SelectContent>
          </Select>
        </div>

        {/* 🔧 From and To Date Inputs */}
        <div className="flex gap-2">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-36"
            placeholder="From"
          />
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-36"
            placeholder="To"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-auto rounded-2xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Customer Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Invoice No</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInvoices.length > 0 ? (
              paginatedInvoices.map((invoice, idx) => (
                <TableRow key={idx}>
                  <TableCell>{invoice.company}</TableCell>
                  <TableCell>{invoice.customerEmail}</TableCell>
                  <TableCell>{invoice.createdAt}</TableCell>
                  <TableCell>{invoice.invoiceNo}</TableCell>
                  <TableCell>${invoice.price}</TableCell>
                  <TableCell>{invoice.currency}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
