'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Monitor,
  Palette,
  Save,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    username: session?.user?.username || 'demo',
    email: 'demo@a123systems.com',
    fullName: 'Demo User',
    role: session?.user?.role || 'operator',
    timezone: 'America/New_York',
    phone: '+1 (555) 123-4567'
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    alertThreshold: 'medium',
    weeklyReports: true,
    systemMaintenance: true,
    performanceDigest: false
  });

  // System preferences
  const [systemPreferences, setSystemPreferences] = useState({
    theme: 'light',
    language: 'en',
    refreshRate: '30',
    defaultView: 'dashboard',
    enableSounds: false,
    compactView: false
  });

  const handleSave = async (section: string) => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert(`${section} settings saved successfully!`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1D23]">Settings</h1>
              <p className="text-[#6B7280]">
                Manage your account and system preferences
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23] flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-blue-600 text-[#1A1D23] text-lg">
                        {getInitials(profileData.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium text-[#1A1D23]">{profileData.fullName}</h3>
                      <p className="text-[#6B7280]">{profileData.email}</p>
                      <Badge variant="outline" className="mt-2 border-[#E5E7EB] text-[#6B7280]">
                        {profileData.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-[#6B7280]">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-white border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#6B7280]">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-[#6B7280]">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="bg-white border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#6B7280]">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-white border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-[#6B7280]">Timezone</Label>
                      <select
                        id="timezone"
                        value={profileData.timezone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full bg-white border border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent rounded-md px-3 py-2"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-[#6B7280]">Role</Label>
                      <Input
                        id="role"
                        value={profileData.role}
                        disabled
                        className="bg-[#F8F9FA] border-[#E5E7EB] text-[#9CA3AF]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleSave('Profile')}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23] flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[#1A1D23] font-medium">Email Alerts</h4>
                        <p className="text-sm text-[#6B7280]">Receive critical alerts via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailAlerts}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailAlerts: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[#1A1D23] font-medium">Push Notifications</h4>
                        <p className="text-sm text-[#6B7280]">Real-time browser notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[#1A1D23] font-medium">Weekly Reports</h4>
                        <p className="text-sm text-[#6B7280]">Automated performance summaries</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6B7280]">Alert Threshold</Label>
                      <select
                        value={notificationSettings.alertThreshold}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, alertThreshold: e.target.value }))}
                        className="w-full bg-white border border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent rounded-md px-3 py-2"
                      >
                        <option value="low">Low - All alerts</option>
                        <option value="medium">Medium - Important alerts only</option>
                        <option value="high">High - Critical alerts only</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleSave('Notification')}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system">
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23] flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    System Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#6B7280]">Theme</Label>
                      <select
                        value={systemPreferences.theme}
                        onChange={(e) => setSystemPreferences(prev => ({ ...prev, theme: e.target.value }))}
                        className="w-full bg-white border border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent rounded-md px-3 py-2"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6B7280]">Language</Label>
                      <select
                        value={systemPreferences.language}
                        onChange={(e) => setSystemPreferences(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full bg-white border border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent rounded-md px-3 py-2"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6B7280]">Data Refresh Rate (seconds)</Label>
                      <select
                        value={systemPreferences.refreshRate}
                        onChange={(e) => setSystemPreferences(prev => ({ ...prev, refreshRate: e.target.value }))}
                        className="w-full bg-white border border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent rounded-md px-3 py-2"
                      >
                        <option value="10">10 seconds</option>
                        <option value="30">30 seconds</option>
                        <option value="60">1 minute</option>
                        <option value="300">5 minutes</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6B7280]">Default View</Label>
                      <select
                        value={systemPreferences.defaultView}
                        onChange={(e) => setSystemPreferences(prev => ({ ...prev, defaultView: e.target.value }))}
                        className="w-full bg-white border border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent rounded-md px-3 py-2"
                      >
                        <option value="dashboard">Dashboard</option>
                        <option value="assets">Assets</option>
                        <option value="map">Map</option>
                        <option value="reports">Reports</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[#1A1D23] font-medium">Enable Sound Notifications</h4>
                        <p className="text-sm text-[#6B7280]">Play sound for critical alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemPreferences.enableSounds}
                          onChange={(e) => setSystemPreferences(prev => ({ ...prev, enableSounds: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[#1A1D23] font-medium">Compact View</h4>
                        <p className="text-sm text-[#6B7280]">Use smaller spacing and components</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemPreferences.compactView}
                          onChange={(e) => setSystemPreferences(prev => ({ ...prev, compactView: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleSave('System')}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23] flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#1A1D23] font-medium mb-2">Session Information</h4>
                      <div className="bg-[#F8F9FA] p-4 rounded-lg space-y-2 border border-[#E5E7EB]">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">Current Session:</span>
                          <span className="text-[#1A1D23]">Active</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">Last Login:</span>
                          <span className="text-[#1A1D23]">{new Date().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">IP Address:</span>
                          <span className="text-[#1A1D23]">192.168.1.100</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[#1A1D23] font-medium mb-2">Password Security</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-[#6B7280]">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            className="bg-white border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-[#6B7280]">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            className="bg-white border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-[#6B7280]">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            className="bg-white border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[#1A1D23] font-medium mb-2">Two-Factor Authentication</h4>
                      <div className="bg-[#F8F9FA] p-4 rounded-lg border border-[#E5E7EB]">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[#1A1D23]">Two-factor authentication is not enabled</p>
                            <p className="text-sm text-[#6B7280]">Add an extra layer of security to your account</p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-[#E5E7EB] text-[#6B7280] hover:bg-white hover:text-[#1A1D23]"
                          >
                            Enable 2FA
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}