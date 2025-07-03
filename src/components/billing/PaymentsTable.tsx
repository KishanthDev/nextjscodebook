'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import Pagination from '../Pagination';
import mockPayments from './payments.json';

export default function PaymentsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(mockPayments.length / itemsPerPage);

  const paginatedPayments = mockPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Payments</h1>

      <Card className="overflow-auto rounded-2xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Status</TableHead> 
              <TableHead>Cancellation Time</TableHead>
              <TableHead>Cancellation Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment, idx) => (
                <TableRow key={idx}>
                  <TableCell>{new Date(payment.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(payment.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>${payment.price}</TableCell>
                  <TableCell>{payment.currency}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.cancellationTime
                      ? new Date(payment.cancellationTime).toLocaleString()
                      : '-'}
                  </TableCell>
                  <TableCell>{payment.cancellationReason || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No payments found.
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
