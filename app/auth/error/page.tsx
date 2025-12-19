import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">EthioGerman</h1>
          <p className="text-muted-foreground">Language School</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error ? (
              <p className="text-sm text-muted-foreground">Error: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">An unexpected error occurred during authentication.</p>
            )}
            <Button asChild className="w-full">
              <Link href="/auth/login">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
