"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowRight, Loader2 } from "lucide-react"
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseAuthProfile,
} from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createOptionalFirebaseClient } from "@/lib/firebase/client"
import { ensureFirebaseProfile } from "@/lib/firebase/finance-repository"

type AuthMode = "login" | "signup" | "recover"

export function AuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const title = {
    login: "Entrar",
    signup: "Criar conta",
    recover: "Recuperar senha",
  }[mode]

  const description = {
    login: "Acesse sua dashboard financeira.",
    signup: "Comece com uma conta simples e segura.",
    recover: "Receba um link para redefinir sua senha.",
  }[mode]

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const firebase = createOptionalFirebaseClient()
    if (!firebase) {
      toast.info("Firebase ainda não está configurado. Abrindo dados demo.")
      setIsLoading(false)
      router.push("/dashboard")
      return
    }

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(firebase.auth, email, password)
        router.push("/dashboard")
      }

      if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(firebase.auth, email, password)
        if (fullName) {
          await updateFirebaseAuthProfile(credential.user, { displayName: fullName })
        }
        await ensureFirebaseProfile(credential.user, fullName)
        toast.success("Conta criada. Complete o onboarding para personalizar.")
        router.push("/onboarding")
      }

      if (mode === "recover") {
        await sendPasswordResetEmail(firebase.auth, email, {
          url: `${window.location.origin}/login`,
        })
        toast.success("Enviamos o link de recuperação para seu e-mail.")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não consegui concluir a ação.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5" onSubmit={submit}>
          <FieldGroup>
            {mode === "signup" && (
              <Field>
                <FieldLabel htmlFor="full_name">Nome</FieldLabel>
                <Input
                  id="full_name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Seu nome"
                />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
              />
            </Field>
            {mode !== "recover" && (
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </Field>
            )}
          </FieldGroup>

          <Button type="submit" className="min-h-12 text-base" disabled={isLoading}>
            {isLoading ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <ArrowRight data-icon="inline-start" />}
            {mode === "recover" ? "Enviar link" : title}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
          {mode !== "login" && <Link href="/login">Já tenho conta</Link>}
          {mode === "login" && <Link href="/recuperar-senha">Esqueci minha senha</Link>}
          {mode === "login" && <Link href="/cadastro">Criar conta</Link>}
          <Link href="/dashboard" className="font-medium text-foreground">
            Ver exemplo com dados fictícios
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
