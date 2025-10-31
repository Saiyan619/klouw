import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Send } from "lucide-react"
import { useSplitAndShare } from "@/app/hooks/split-share-hook"


interface ChildComponentProps {
  mint: string;
}

export function SplitAndShareModal({mint}:ChildComponentProps) {
  const { splitAndShare } = useSplitAndShare();
  const [open, setOpen] = useState(false)
  const [addresses, setAddresses] = useState<string[]>([])
  const [currentAddress, setCurrentAddress] = useState("")

  const handleAddAddress = () => {
    if (currentAddress.trim() && !addresses.includes(currentAddress.trim())) {
      setAddresses([...addresses, currentAddress.trim()])
      setCurrentAddress("")
    }
  }

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index))
  }

  const handleShare = () => {
    console.log("Sharing to addresses:", addresses)
    // TODO: Add your share logic here
    splitAndShare({
      mintAddress: mint,
      receipients:addresses
})
    setOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddAddress()
    }
  }

  return (
    <div className="w-full md:w-auto">
      <Button className="w-full" onClick={() => setOpen(true)}>
        <Send className="h-4 w-4 mr-2" />
        Split & Share
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Split & Share Tokens</DialogTitle>
            <DialogDescription>
              Add recipient addresses to split tokens equally
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Add Address */}
            <div className="space-y-2">
              <Label>Add Recipient Address</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter wallet address"
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="font-mono text-sm"
                />
                <Button onClick={handleAddAddress} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Address List */}
            {addresses.length > 0 ? (
              <div className="space-y-2">
                <Label>Recipients ({addresses.length})</Label>
                <div className="max-h-[240px] space-y-2 overflow-y-auto rounded border p-3">
                  {addresses.map((address, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded border bg-muted/50 p-2"
                    >
                      <span className="font-mono text-sm truncate flex-1">{address}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveAddress(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded border border-dashed p-8 text-center text-sm text-muted-foreground">
                No recipients added yet
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare} disabled={addresses.length === 0}>
              <Send className="h-4 w-4 mr-2" />
              Share to {addresses.length} {addresses.length === 1 ? "Address" : "Addresses"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}