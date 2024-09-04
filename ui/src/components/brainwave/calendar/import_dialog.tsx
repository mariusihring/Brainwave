import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ImportCalendarAppointmentsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" >Import current Semester Calendar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Calendar</DialogTitle>
          <DialogDescription>
            You havent imported your calendar yet. Please insert the link to your calendar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right flex">
              Calendar Link
            </Label>
            <Input id="link" value="https://calendar.dhbw.de/..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
