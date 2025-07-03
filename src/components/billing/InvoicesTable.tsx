'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

interface Invoice {
  company: string;
  customerEmail: string;
  createdAt: string;
  invoiceNo: string;
  price: number;
  currency: string;
  status: string;
}

export default function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  return (
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
        {invoices.length > 0 ? (
          invoices.map((invoice, idx) => (
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
  );
}
