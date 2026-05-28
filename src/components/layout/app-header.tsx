"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ALargeSmall, Eye, LogOut, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { signOut as signOutFirebase } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { createOptionalFirebaseClient } from "@/lib/firebase/client"
import { useFinance } from "@/components/providers/finance-provider"

export function AppHeader() {
  const router = useRouter()
  const { data, updateProfile, resetDemo, isUsingFirebase } = useFinance()

  const enableSimpleMode = async () => {
    await updateProfile({ ...data.profile, visual_mode: "simple" })
    toast.success("Modo simples ativado")
  }

  const increaseFont = async () => {
    const nextScale =
      data.profile.font_scale === "normal"
        ? "large"
        : data.profile.font_scale === "large"
          ? "extra-large"
          : "normal"
    await updateProfile({ ...data.profile, font_scale: nextScale })
    toast.success(nextScale === "normal" ? "Fonte normal ativada" : "Fonte maior ativada")
  }

  const signOut = async () => {
    const firebase = createOptionalFirebaseClient()
    if (firebase) await signOutFirebase(firebase.auth)
    resetDemo()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">Clareza</span>
        </Link>
        <div className="hidden flex-col lg:flex">
          <span className="text-sm font-medium">
            {data.profile.full_name ? `Olá, ${data.profile.full_name}` : "Olá"}
          </span>
          <span className="text-xs text-muted-foreground">
            {isUsingFirebase ? "Dados protegidos no Firebase" : "Usando dados demo/local"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button type="button" variant="outline" className="hidden min-h-10 md:inline-flex" onClick={enableSimpleMode}>
            <Eye data-icon="inline-start" />
            Ativar modo simples
          </Button>
          <Button type="button" variant="outline" className="hidden min-h-10 md:inline-flex" onClick={increaseFont}>
            <ALargeSmall data-icon="inline-start" />
            Aumentar fonte
          </Button>
          <Button type="button" variant="ghost" className="min-h-10" onClick={signOut}>
            <LogOut data-icon="inline-start" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
