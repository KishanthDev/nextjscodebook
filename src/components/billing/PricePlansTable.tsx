'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Pagination from '../Pagination';
import mockPlans from './priceplans.json';

export default function PricePlansTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = mockPlans.filter((plan) =>
    plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Price Plans</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center">
          <Input
            placeholder="Search price plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button className="flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} />
            Add Price Plan
          </Button>
        </div>
      </div>

      <Card className="overflow-auto rounded-2xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Default Plan</TableHead>
              <TableHead>Free Plan</TableHead>
              <TableHead>Price (Monthly)</TableHead>
              <TableHead>Price (Annually)</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlans.length > 0 ? (
              paginatedPlans.map((plan, idx) => (
                <TableRow key={idx}>
                  <TableCell>{plan.planName}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        plan.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </TableCell>
                  <TableCell>{plan.isDefault ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{plan.isFree ? 'Yes' : 'No'}</TableCell>
                  <TableCell>${plan.priceMonthly}</TableCell>
                  <TableCell>${plan.priceAnnually}</TableCell>
                  <TableCell>{new Date(plan.dateAdded).toLocaleDateString()}</TableCell>
                  <TableCell>{plan.type}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost">
                      <Pencil size={16} />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-100">
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500">
                  No plans found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

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
