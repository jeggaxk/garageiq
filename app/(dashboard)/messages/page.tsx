'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/dashboard/PageHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils'
import type { Message, MessageTemplate, AutomationType, MessageChannel } from '@/types'
import { Mail, Phone, MessageSquare, Edit3 } from 'lucide-react'

const typeLabels: Record<string, string> = {
  mot_reminder: 'MOT Reminder',
  service_reminder: 'Service Reminder',
  review_request: 'Review Request',
  win_back: 'Win-back',
  manual: 'Manual',
}

const statusColors: Record<string, 'green' | 'amber' | 'red' | 'gray' | 'blue'> = {
  sent: 'blue',
  delivered: 'green',
  opened: 'green',
  clicked: 'green',
  failed: 'red',
  pending: 'amber',
}

const templateLabels: Record<AutomationType, string> = {
  mot_reminder: 'MOT Reminder',
  service_reminder: 'Service Reminder',
  review_request: 'Review Request',
  win_back: 'Win-back Campaign',
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<'log' | 'templates'>('log')
  const [messages, setMessages] = useState<Message[]>([])
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [editBody, setEditBody] = useState('')
  const [editSubject, setEditSubject] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (activeTab === 'log') {
      fetch('/api/messages')
        .then((r) => r.json())
        .then((d) => setMessages(d.messages || []))
        .finally(() => setLoading(false))
    } else {
      fetch('/api/messages/templates')
        .then((r) => r.json())
        .then((d) => setTemplates(d.templates || []))
        .finally(() => setLoading(false))
    }
  }, [activeTab])

  async function saveTemplate() {
    if (!editingTemplate) return
    setSaving(true)
    const res = await fetch('/api/messages/templates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingTemplate.id, body: editBody, subject: editSubject }),
    })
    const data = await res.json()
    if (data.template) {
      setTemplates((prev) => prev.map((t) => t.id === data.template.id ? data.template : t))
      setEditingTemplate(null)
    }
    setSaving(false)
  }

  function openEdit(template: MessageTemplate) {
    setEditingTemplate(template)
    setEditBody(template.body)
    setEditSubject(template.subject || '')
  }

  const smsTemplates = templates.filter((t) => t.channel === 'sms')
  const emailTemplates = templates.filter((t) => t.channel === 'email')

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8">
      <PageHeader title="Messages" description="Message log and template editor" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
        {(['log', 'templates'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setLoading(true) }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-navy-900'
            }`}
          >
            {tab === 'log' ? 'Message log' : 'Templates'}
          </button>
        ))}
      </div>

      {activeTab === 'log' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={28} className="text-blue-500" />
                      </div>
                      <h3 className="text-navy-900 font-semibold text-base mb-1">No messages sent yet</h3>
                      <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                        Messages appear here once your automations start running. Enable at least one automation and they'll send automatically each morning.
                      </p>
                      <a
                        href="/automations"
                        className="inline-flex items-center gap-2 bg-cta-500 hover:bg-cta-400 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                      >
                        Set up automations →
                      </a>
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy-900">
                          {(msg as Message & { customer?: { name: string } }).customer?.name || '—'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(msg as Message & { customer?: { vehicle_reg?: string } }).customer?.vehicle_reg || ''}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-gray-600">{typeLabels[msg.type] || msg.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {msg.channel === 'sms' ? (
                            <Phone size={13} className="text-gray-400" />
                          ) : (
                            <Mail size={13} className="text-gray-400" />
                          )}
                          <span className="text-gray-600 text-xs uppercase">{msg.channel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge label={msg.status} color={statusColors[msg.status] || 'gray'} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">
                        {formatDate(msg.sent_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 font-medium mb-1">Dynamic variables</p>
            <p className="text-xs text-amber-700 font-mono">[FirstName] [VehicleReg] [VehicleMake] [GarageName] [GaragePhone] [GoogleReviewLink]</p>
          </div>

          {/* SMS templates */}
          <div>
            <h3 className="font-semibold text-navy-900 mb-3 flex items-center gap-2">
              <Phone size={16} className="text-gray-400" /> SMS Templates
            </h3>
            <div className="space-y-3">
              {smsTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-navy-900 mb-2">
                        {templateLabels[template.type as AutomationType] || template.type}
                      </p>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 font-mono text-xs leading-relaxed">
                        {template.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {template.body.length} characters · {Math.ceil(template.body.length / 160)} SMS credit{Math.ceil(template.body.length / 160) !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(template)}>
                      <Edit3 size={13} /> Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email templates */}
          <div>
            <h3 className="font-semibold text-navy-900 mb-3 flex items-center gap-2">
              <Mail size={16} className="text-gray-400" /> Email Templates
            </h3>
            <div className="space-y-3">
              {emailTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-navy-900 mb-2">
                        {templateLabels[template.type as AutomationType] || template.type}
                      </p>
                      {template.subject && (
                        <p className="text-xs text-gray-500 mb-1.5">Subject: <span className="text-navy-900">{template.subject}</span></p>
                      )}
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 text-xs leading-relaxed whitespace-pre-line">
                        {template.body}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(template)}>
                      <Edit3 size={13} /> Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      <Modal
        open={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        title={`Edit ${editingTemplate?.channel?.toUpperCase()} template`}
        size="lg"
      >
        {editingTemplate && (
          <div className="space-y-4">
            {editingTemplate.channel === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject line</label>
                <input
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Email subject"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message body</label>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={editingTemplate.channel === 'sms' ? 4 : 8}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono resize-none"
              />
              {editingTemplate.channel === 'sms' && (
                <p className="text-xs text-gray-400 mt-1">
                  {editBody.length} characters · {Math.ceil(editBody.length / 160)} SMS credit{Math.ceil(editBody.length / 160) !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium mb-1">Available variables:</p>
              <p className="text-xs text-gray-400 font-mono">[FirstName] [VehicleReg] [VehicleMake] [GarageName] [GaragePhone] [GoogleReviewLink]</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditingTemplate(null)}>Cancel</Button>
              <Button onClick={saveTemplate} loading={saving}>Save template</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
