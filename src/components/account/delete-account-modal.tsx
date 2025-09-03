"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { 
  AlertTriangle, 
  Trash2, 
  Eye, 
  EyeOff,
  Shield
} from "lucide-react"
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface DeleteAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  
  // Form states
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [confirmations, setConfirmations] = useState({
    understand: false,
    permanent: false,
    noRecovery: false,
    dataLoss: false
  })

  const clearForm = () => {
    setPassword("")
    setConfirmText("")
    setConfirmations({
      understand: false,
      permanent: false,
      noRecovery: false,
      dataLoss: false
    })
    setError("")
    setStep(1)
  }

  const handleClose = () => {
    clearForm()
    onOpenChange(false)
  }

  const canProceedToStep2 = () => {
    return Object.values(confirmations).every(Boolean)
  }

  const canDeleteAccount = () => {
    return password.trim() !== "" && confirmText === "DELETE MY ACCOUNT"
  }

  const handleDeleteAccount = async () => {
    if (!user || !canDeleteAccount()) {
      setError("Please complete all required fields.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email!, password)
      await reauthenticateWithCredential(user, credential)

      // Delete user data from Firestore
      try {
        const userRef = doc(db, 'users', user.uid)
        await deleteDoc(userRef)
      } catch (firestoreError) {
        console.error("Failed to delete Firestore data:", firestoreError)
        // Continue with account deletion even if Firestore fails
      }

      // Delete the user account
      await deleteUser(user)

      // Account deleted successfully - user will be signed out automatically
      handleClose()
      
    } catch (err: any) {
      console.error("Account deletion error:", err)
      
      if (err.code === 'auth/wrong-password') {
        setError("Current password is incorrect.")
      } else if (err.code === 'auth/requires-recent-login') {
        setError("For security reasons, please sign out and sign back in before deleting your account.")
      } else {
        setError("Failed to delete account. Please try again or contact support if the problem persists.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please read carefully.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                Warning: Account deletion is permanent and irreversible.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h3 className="font-semibold text-red-600">What will be deleted:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Your user profile and account information</li>
                <li>• All study sessions and historical data</li>
                <li>• Subject configurations and preferences</li>
                <li>• Goals, achievements, and progress tracking</li>
                <li>• Analytics data and insights</li>
                <li>• All associated settings and customizations</li>
              </ul>
            </div>

            <div className="space-y-4 border-t pt-4">
              <p className="font-medium text-red-600">
                Please confirm you understand by checking all boxes:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="understand"
                    checked={confirmations.understand}
                    onCheckedChange={(checked) => 
                      setConfirmations(prev => ({ ...prev, understand: !!checked }))
                    }
                  />
                  <Label htmlFor="understand" className="text-sm leading-relaxed">
                    I understand that deleting my account will permanently remove all my data
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="permanent"
                    checked={confirmations.permanent}
                    onCheckedChange={(checked) => 
                      setConfirmations(prev => ({ ...prev, permanent: !!checked }))
                    }
                  />
                  <Label htmlFor="permanent" className="text-sm leading-relaxed">
                    I understand that this action is permanent and cannot be undone
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="noRecovery"
                    checked={confirmations.noRecovery}
                    onCheckedChange={(checked) => 
                      setConfirmations(prev => ({ ...prev, noRecovery: !!checked }))
                    }
                  />
                  <Label htmlFor="noRecovery" className="text-sm leading-relaxed">
                    I understand that my account cannot be recovered after deletion
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="dataLoss"
                    checked={confirmations.dataLoss}
                    onCheckedChange={(checked) => 
                      setConfirmations(prev => ({ ...prev, dataLoss: !!checked }))
                    }
                  />
                  <Label htmlFor="dataLoss" className="text-sm leading-relaxed">
                    I accept that all my study data and progress will be permanently lost
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2()}
              >
                Continue to Deletion
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <Shield className="h-4 w-4" />
              <AlertDescription className="font-medium">
                Final step: Verify your identity to proceed with account deletion.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-red-600 font-medium">
                  Enter your current password:
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Current password"
                    className="border-red-200 focus:border-red-500 focus:ring-red-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmText" className="text-red-600 font-medium">
                  Type "DELETE MY ACCOUNT" to confirm:
                </Label>
                <Input
                  id="confirmText"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className="border-red-200 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Account:</strong> {user?.email}
                </p>
                <p className="text-sm text-red-800">
                  <strong>Created:</strong> {new Date(user?.metadata.creationTime || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={!canDeleteAccount() || loading}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {loading ? 'Deleting Account...' : 'Delete My Account'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}