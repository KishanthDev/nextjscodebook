'use client';

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/ui/select";
import { useCustomerStore, Customer } from "./useCustomerStore";

export default function CustomerSelect() {
  const { customers, setCustomers, selectedCustomer, setSelectedCustomer } =
    useCustomerStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customers.length === 0) {
      setLoading(true);
      async function fetchCustomers() {
        try {
          const res = await fetch(
            "https://zotlyadminapis-39lct.ondigitalocean.app/zotlyadmin/customers/list"
          );
          const data: Customer[] = await res.json();
          setCustomers(data);
        } catch (err) {
          console.error("Failed to fetch customers", err);
        } finally {
          setLoading(false);
        }
      }
      fetchCustomers();
    }
  }, [customers.length, setCustomers]);

  if (loading) return <div>Loading customers...</div>;

  return (
    <div className="w-[150px]">
      <Select
        value={selectedCustomer?.id.toString() || ""}
        onValueChange={(idStr) => {
          const id = parseInt(idStr, 10);
          const customer = customers.find((c) => c.id === id) || null;
          setSelectedCustomer(customer);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map((cust) => (
            <SelectItem key={cust.id} value={cust.id.toString()}>
              {cust.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
