// Settings page
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Bell, Shield, Palette, Database, Save } from 'lucide-react'

const Settings: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'data', name: 'Data & Privacy', icon: Database },
  ]

  const handleSave = async () => {
    setSaving(true)
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-border-primary">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-border-secondary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-border-primary">
                <div className="w-20 h-20 bg-accent-primary rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text-primary">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-text-secondary">{user?.email}</p>
                  <p className="text-sm text-text-tertiary mt-1">{user?.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.firstName}
                    className="w-full px-4 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.lastName}
                    className="w-full px-4 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Email Notifications</h3>
                
                <label className="flex items-center justify-between p-4 bg-background-secondary rounded-lg cursor-pointer hover:bg-background-tertiary transition-colors">
                  <div>
                    <p className="font-medium text-text-primary">Attendance alerts</p>
                    <p className="text-sm text-text-secondary">Get notified when attendance is marked</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-accent-primary rounded focus:ring-accent-primary" />
                </label>

                <label className="flex items-center justify-between p-4 bg-background-secondary rounded-lg cursor-pointer hover:bg-background-tertiary transition-colors">
                  <div>
                    <p className="font-medium text-text-primary">Grade updates</p>
                    <p className="text-sm text-text-secondary">Get notified when grades are updated</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-accent-primary rounded focus:ring-accent-primary" />
                </label>

                <label className="flex items-center justify-between p-4 bg-background-secondary rounded-lg cursor-pointer hover:bg-background-tertiary transition-colors">
                  <div>
                    <p className="font-medium text-text-primary">Announcements</p>
                    <p className="text-sm text-text-secondary">Receive school announcements</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-accent-primary rounded focus:ring-accent-primary" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border-primary">
                <h3 className="text-lg font-medium text-text-primary mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">Current session</p>
                      <p className="text-sm text-text-secondary">Chrome on Windows • Active now</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-success-bg text-success-text rounded-full">Current</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-4">Theme</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-accent-primary rounded-lg bg-surface-primary">
                    <div className="w-full h-20 bg-background-tertiary rounded mb-3"></div>
                    <p className="font-medium text-text-primary">Light</p>
                    <p className="text-sm text-text-secondary">Clean and bright</p>
                  </button>
                  <button className="p-4 border-2 border-border-primary rounded-lg bg-surface-primary hover:border-border-secondary transition-colors">
                    <div className="w-full h-20 bg-background-primary rounded mb-3"></div>
                    <p className="font-medium text-text-primary">Dark</p>
                    <p className="text-sm text-text-secondary">Easy on the eyes</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-4">Data Management</h3>
                <div className="space-y-4">
                  <button className="w-full p-4 bg-background-secondary rounded-lg text-left hover:bg-background-tertiary transition-colors">
                    <p className="font-medium text-text-primary">Download my data</p>
                    <p className="text-sm text-text-secondary">Get a copy of all your data</p>
                  </button>
                  <button className="w-full p-4 bg-error-bg rounded-lg text-left hover:bg-error-border transition-colors">
                    <p className="font-medium text-error-text">Delete my account</p>
                    <p className="text-sm text-error-text opacity-80">Permanently delete your account and data</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-6 border-t border-border-primary flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
