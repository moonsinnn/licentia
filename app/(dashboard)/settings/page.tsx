import { Settings, User, Bell, Shield, Mail, CreditCard } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and system preferences
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            We&apos;re working on the settings page with the following features:
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <SettingCard
              title="Profile Settings"
              description="Update your personal information and preferences"
              icon={<User className="h-5 w-5 text-primary" />}
            />
            <SettingCard
              title="Notification Preferences"
              description="Configure email and system notifications"
              icon={<Bell className="h-5 w-5 text-primary" />}
            />
            <SettingCard
              title="Security Settings"
              description="Manage account security and authentication"
              icon={<Shield className="h-5 w-5 text-primary" />}
            />
            <SettingCard
              title="Email Templates"
              description="Customize license and notification emails"
              icon={<Mail className="h-5 w-5 text-primary" />}
            />
            <SettingCard
              title="Billing & Subscription"
              description="Manage your payment methods and subscription"
              icon={<CreditCard className="h-5 w-5 text-primary" />}
            />
            <SettingCard
              title="System Configuration"
              description="Configure system-wide settings and defaults"
              icon={<Settings className="h-5 w-5 text-primary" />}
            />
          </div>
        </div>
        <div className="flex items-center p-6 pt-0">
          <div className="text-xs text-muted-foreground">Available in the next update</div>
        </div>
      </div>
    </div>
  )
}

interface SettingCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function SettingCard({ title, description, icon }: SettingCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
} 