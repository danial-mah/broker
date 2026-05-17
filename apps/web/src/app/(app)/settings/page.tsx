import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-foreground">Profile settings</h2>
      <p className="mt-2 text-sm text-muted">Account preferences, security controls, and notification settings belong here.</p>
    </Card>
  );
}
