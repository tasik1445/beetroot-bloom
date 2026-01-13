import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Settings as SettingsIcon } from 'lucide-react';

interface SiteSetting {
  setting_key: string;
  setting_value: string | null;
  setting_type: string | null;
  description: string | null;
}

const Settings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch settings
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data as SiteSetting[];
    }
  });

  // Initialize local state when data loads
  useEffect(() => {
    if (siteSettings) {
      const settingsMap: Record<string, string> = {};
      siteSettings.forEach(s => {
        settingsMap[s.setting_key] = s.setting_value || '';
      });
      setSettings(settingsMap);
    }
  }, [siteSettings]);

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (updates: { key: string; value: string }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ setting_value: update.value })
          .eq('setting_key', update.key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: "Settings Saved", description: "Your settings have been saved successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  });

  const handleSave = () => {
    const updates = Object.entries(settings).map(([key, value]) => ({ key, value }));
    updateMutation.mutate(updates);
  };

  const getSettingMeta = (key: string) => {
    return siteSettings?.find(s => s.setting_key === key);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Site Settings</h2>
            <p className="text-muted-foreground">Manage your site configuration</p>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name || ''}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    placeholder="Your site name"
                  />
                  <p className="text-xs text-muted-foreground">
                    {getSettingMeta('site_name')?.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ''}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    placeholder="+880-XXXX-XXXXXX"
                  />
                  <p className="text-xs text-muted-foreground">
                    {getSettingMeta('contact_phone')?.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    placeholder="support@example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    {getSettingMeta('contact_email')?.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>Configure delivery options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="free_delivery_threshold">Free Delivery Threshold (৳)</Label>
                  <Input
                    id="free_delivery_threshold"
                    type="number"
                    value={settings.free_delivery_threshold || ''}
                    onChange={(e) => setSettings({ ...settings, free_delivery_threshold: e.target.value })}
                    placeholder="1500"
                  />
                  <p className="text-xs text-muted-foreground">
                    {getSettingMeta('free_delivery_threshold')?.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                  <Input
                    id="low_stock_threshold"
                    type="number"
                    value={settings.low_stock_threshold || ''}
                    onChange={(e) => setSettings({ ...settings, low_stock_threshold: e.target.value })}
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    {getSettingMeta('low_stock_threshold')?.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Urgency Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Urgency & Scarcity</CardTitle>
              <CardDescription>Configure urgency elements on the landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_countdown">Enable Countdown Timer</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Show countdown timer on landing page
                  </p>
                </div>
                <Switch
                  id="enable_countdown"
                  checked={settings.enable_countdown_timer === 'true'}
                  onCheckedChange={(checked) => setSettings({ 
                    ...settings, 
                    enable_countdown_timer: checked ? 'true' : 'false' 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="limited_stock_message">Limited Stock Message</Label>
                <Input
                  id="limited_stock_message"
                  value={settings.limited_stock_message || ''}
                  onChange={(e) => setSettings({ ...settings, limited_stock_message: e.target.value })}
                  placeholder="মাত্র ৫০টি প্যাকেজ বাকি"
                />
                <p className="text-xs text-muted-foreground">
                  {getSettingMeta('limited_stock_message')?.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
