"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TestModalProps {
  open: boolean
}

export function TestModal({ open }: TestModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Modal</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>This is a test modal to see if dialogs work at all.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}