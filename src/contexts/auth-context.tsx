"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  UserCredential
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<UserCredential>
  signUp: (email: string, password: string, displayName?: string) => Promise<UserCredential>
  signOut: () => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Setting up Firebase Auth listener...')
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user')
      if (user) {
        try {
          // Create or update user document in Firestore
          const userRef = doc(db, 'users', user.uid)
          const userSnap = await getDoc(userRef)
          
          if (!userSnap.exists()) {
            console.log('Creating new user document in Firestore...')
            // Create new user document
            await setDoc(userRef, {
              email: user.email,
              displayName: user.displayName,
              createdAt: new Date(),
              updatedAt: new Date(),
              preferences: {},
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })
            console.log('User document created successfully')
          } else {
            console.log('User document already exists')
          }
        } catch (error) {
          console.error('Firestore Error:', error)
        }
      }
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      console.log('Attempting to create user with Firebase Auth...')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      console.log('User created successfully:', result.user.uid)
      
      if (displayName && result.user) {
        console.log('Updating user profile with displayName:', displayName)
        await updateProfile(result.user, { displayName })
        console.log('Profile updated successfully')
      }
      
      return result
    } catch (error) {
      console.error('Firebase Auth Error:', error)
      throw error
    }
  }

  const signOut = async () => {
    return firebaseSignOut(auth)
  }

  const updateUserProfile = async (displayName: string) => {
    if (user) {
      await updateProfile(user, { displayName })
      
      // Update user document in Firestore
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        displayName,
        updatedAt: new Date()
      }, { merge: true })
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
