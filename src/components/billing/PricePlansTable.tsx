'use client';

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/ui/table';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Pagination from '../Pagination';
import CreatePlanForm from './PlanForm';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/ui/dialog';
import { PricePlan } from '@/types/Billing';

export default function PricePlansTable({ priceplans }: { priceplans: PricePlan[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlans = priceplans.filter((plan) =>
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
            {/* Header Row */}
            <div className='border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm'>
                <h1 className="text-3xl text-center mb-3 font-bold text-gray-800 dark:text-white">Price Plans</h1>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Input
                        placeholder="Search price plans..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64"
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2 whitespace-nowrap">
                                <Plus size={16} />
                                Add Price Plan
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className='text-center'>Create a New Price Plan</DialogTitle>
                                <DialogDescription className='text-center'>Fill out the fields to define a new subscription plan.</DialogDescription>
                            </DialogHeader>

                            <div className="overflow-y-auto max-h-[70vh] pr-2">
                                <CreatePlanForm />
                            </div>
                        </DialogContent>

                    </Dialog>
                </div>

            </div>
            {/* Table Section */}
            <div className='border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm'>
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
                                                className={`px-2 py-1 text-xs rounded-full ${plan.status === 'Active'
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

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </div>
    );
}
