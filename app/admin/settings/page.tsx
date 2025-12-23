"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, Save, Globe, Lock, Bell, Palette, User, Building } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const { language } = useLanguage()
    const t = translations[language]
    const supabase = createClient()

    // Admin Profile State
    const [profile, setProfile] = useState<any>(null)

    // Simulated System Settings State (since we don't have a settings table yet)
    const [systemSettings, setSystemSettings] = useState({
        siteName: "EthioGerman Language School",
        supportEmail: "info@ethiogerman.com",
        registrationEnabled: true,
        maintenanceMode: false,
        defaultCurrency: "ETB"
    })

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
                setProfile(data)
            }
            setLoading(false)
        }
        fetchProfile()
    }, [])

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: profile.full_name,
                    bio: profile.bio,
                    phone: profile.phone,
                    updated_at: new Date().toISOString()
                })
                .eq("id", profile.id)

            if (error) throw error
            toast.success("Profile updated successfully")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setUpdating(false)
        }
    }

    const handleSystemUpdate = (key: string, value: any) => {
        setSystemSettings(prev => ({ ...prev, [key]: value }))
        // Here functionality would be added to persist this to a DB table if it existed
        toast.info("Setting updated (Simulated)")
    }

    if (loading) {
        return (
            <DashboardLayout role="admin">
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-2">Manage your account and system preferences.</p>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar Navigation for Settings */}
                        <aside className="w-full md:w-64 shrink-0">
                            <TabsList className="flex flex-col h-auto w-full items-stretch bg-transparent p-0 gap-1">
                                <TabsTrigger value="profile" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 rounded-lg border border-transparent">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="general" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 rounded-lg border border-transparent">
                                    <Building className="mr-2 h-4 w-4" />
                                    General
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 rounded-lg border border-transparent">
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notifications
                                </TabsTrigger>
                                <TabsTrigger value="appearance" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 rounded-lg border border-transparent">
                                    <Palette className="mr-2 h-4 w-4" />
                                    Appearance
                                </TabsTrigger>
                            </TabsList>
                        </aside>

                        {/* Content Area */}
                        <div className="flex-1">
                            {/* Profile Settings */}
                            <TabsContent value="profile" className="m-0 space-y-6">
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                        <CardDescription>Update your admin profile details.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                                            <div className="flex items-center gap-6">
                                                <Avatar className="h-20 w-20 border-2 dark:border-gray-700">
                                                    <AvatarImage src={profile?.avatar_url} />
                                                    <AvatarFallback className="text-xl">{profile?.full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <Button variant="outline" type="button" disabled>Change Avatar</Button>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fullName">Full Name</Label>
                                                    <Input
                                                        id="fullName"
                                                        value={profile?.full_name || ""}
                                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input id="email" value={profile?.email || ""} disabled className="bg-gray-50 dark:bg-gray-800" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone</Label>
                                                    <Input
                                                        id="phone"
                                                        value={profile?.phone || ""}
                                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                        placeholder="+251..."
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="role">Role</Label>
                                                    <Input id="role" value={profile?.role?.toUpperCase()} disabled className="bg-gray-50 dark:bg-gray-800" />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="bio">Bio</Label>
                                                    <Textarea
                                                        id="bio"
                                                        value={profile?.bio || ""}
                                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                        placeholder="Tell us about yourself..."
                                                        className="min-h-[100px]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={updating}>
                                                    {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* General Settings */}
                            <TabsContent value="general" className="m-0 space-y-6">
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle>School Information</CardTitle>
                                        <CardDescription>Manage general settings for the platform.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>School Name</Label>
                                                <Input
                                                    value={systemSettings.siteName}
                                                    onChange={(e) => handleSystemUpdate('siteName', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Support Email</Label>
                                                <Input
                                                    value={systemSettings.supportEmail}
                                                    onChange={(e) => handleSystemUpdate('supportEmail', e.target.value)}
                                                />
                                            </div>
                                            <Separator className="dark:bg-gray-800" />
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">New Registrations</Label>
                                                    <p className="text-sm text-muted-foreground">Allow new students to sign up.</p>
                                                </div>
                                                <Switch
                                                    checked={systemSettings.registrationEnabled}
                                                    onCheckedChange={(checked) => handleSystemUpdate('registrationEnabled', checked)}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Maintenance Mode</Label>
                                                    <p className="text-sm text-muted-foreground">Disable access for non-admin users.</p>
                                                </div>
                                                <Switch
                                                    checked={systemSettings.maintenanceMode}
                                                    onCheckedChange={(checked) => handleSystemUpdate('maintenanceMode', checked)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Notifications */}
                            <TabsContent value="notifications" className="m-0 space-y-6">
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle>Email Notifications</CardTitle>
                                        <CardDescription>Configure when you receive emails.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="flex-1">New User Registration</Label>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label className="flex-1">New Enrollment</Label>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label className="flex-1">System Updates</Label>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Appearance */}
                            <TabsContent value="appearance" className="m-0 space-y-6">
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle>Theme Preferences</CardTitle>
                                        <CardDescription>Customize how the admin panel looks.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Interface Theme</Label>
                                            <div className="flex gap-4">
                                                <ThemeSwitcher />
                                                <span className="text-sm text-gray-500 self-center">Toggle between Light and Dark mode</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
