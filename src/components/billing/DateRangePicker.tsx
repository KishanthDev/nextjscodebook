import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover"
import { Button } from "@/ui/button"

export function DateRangePicker({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: {
  fromDate: Date | null
  toDate: Date | null
  setFromDate: (date: Date | null) => void
  setToDate: (date: Date | null) => void
}) {
  return (
    <div className="flex gap-4">
      {/* FROM DATE */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-36 justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fromDate ? format(fromDate, "dd MMM yyyy") : "From"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={fromDate ?? undefined}
            onSelect={(date) => setFromDate(date ?? null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* TO DATE */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-36 justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {toDate ? format(toDate, "dd MMM yyyy") : "To"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={toDate ?? undefined}
            onSelect={(date) => setToDate(date ?? null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
