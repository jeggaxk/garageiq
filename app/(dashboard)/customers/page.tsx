'use client'

import { useEffect, useState, useCallback } from 'react'
import PageHeader from '@/components/dashboard/PageHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatDate, getCustomerStatus } from '@/lib/utils'
import type { Customer } from '@/types'
import {
  Search,
  Upload,
  Plus,
  Users,
  Car,
  AlertCircle,
  Trash2,
  Send,
  Download,
} from 'lucide-react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ imported?: number; error?: string } | null>(null)
  const [addForm, setAddForm] = useState({
    name: '', phone: '', email: '', vehicle_reg: '', vehicle_make: '',
    last_service_date: '', last_mot_date: '',
  })
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [sendTarget, setSendTarget] = useState<Customer | null>(null)
  const [sendChannel, setSendChannel] = useState<'sms' | 'email'>('sms')
  const [sendBody, setSendBody] = useState('')
  const [sendSubject, setSendSubject] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success?: boolean; error?: string } | null>(null)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    const res = await fetch(`/api/customers?${params}`)
    const data = await res.json()
    setCustomers(data.customers || [])
    setLoading(false)
  }, [search])

  useEffect(() => {
    const t = setTimeout(fetchCustomers, 300)
    return () => clearTimeout(t)
  }, [fetchCustomers])

  async function handleUpload() {
    if (!uploadFile) return
    setUploading(true)
    setUploadResult(null)
    const formData = new FormData()
    formData.append('file', uploadFile)
    const res = await fetch('/api/customers/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setUploadResult(data)
    setUploading(false)
    if (data.imported) {
      fetchCustomers()
      setTimeout(() => {
        setShowUploadModal(false)
        setUploadFile(null)
        setUploadResult(null)
      }, 2000)
    }
  }

  async function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    setAddError('')
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    })
    const data = await res.json()
    setAdding(false)
    if (data.error) {
      setAddError(data.error)
      return
    }
    setShowAddModal(false)
    setAddForm({ name: '', phone: '', email: '', vehicle_reg: '', vehicle_make: '', last_service_date: '', last_mot_date: '' })
    fetchCustomers()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this customer?')) return
    await fetch(`/api/customers/${id}`, { method: 'DELETE' })
    fetchCustomers()
  }

  const updateAdd = (field: string, value: string) =>
    setAddForm((prev) => ({ ...prev, [field]: value }))

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!sendTarget) return
    setSending(true)
    setSendResult(null)
    const res = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: sendTarget.id, channel: sendChannel, body: sendBody, subject: sendSubject }),
    })
    const data = await res.json()
    setSendResult(data)
    setSending(false)
    if (data.success) {
      setTimeout(() => { setSendTarget(null); setSendBody(''); setSendSubject(''); setSendResult(null) }, 1500)
    }
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8">
      <PageHeader
        title="Customers"
        description={`${customers.length} customers`}
        action={
          <div className="flex gap-2">
            <a href="/revvia-customers-template.csv" download className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-navy-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors">
              <Download size={13} /> CSV template
            </a>
            <Button variant="secondary" size="sm" onClick={() => setShowUploadModal(true)}>
              <Upload size={15} /> Import CSV
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus size={15} /> Add customer
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, reg, or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last MOT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    {search ? (
                      <>
                        <Users size={32} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-gray-400">No customers match your search</p>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 bg-cta-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Users size={28} className="text-cta-500" />
                        </div>
                        <h3 className="text-navy-900 font-semibold text-base mb-1">Add your first customers</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                          Import a CSV export from your existing system, or add customers one by one. Your automations won't send until you have customers loaded.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setShowUploadModal(true)}
                            className="inline-flex items-center gap-2 bg-cta-500 hover:bg-cta-400 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                          >
                            <Upload size={16} /> Upload CSV
                          </button>
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-navy-900 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
                          >
                            <Plus size={16} /> Add manually
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const status = getCustomerStatus(customer)
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy-900">{customer.name}</p>
                        <p className="text-xs text-gray-400">{customer.phone || customer.email || '—'}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="font-mono text-xs font-semibold text-navy-900 bg-gray-100 inline-block px-2 py-0.5 rounded">
                          {customer.vehicle_reg || '—'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{customer.vehicle_make || ''}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-600 text-xs">
                        {formatDate(customer.last_mot_date)}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-600 text-xs">
                        {formatDate(customer.last_service_date)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge label={status.label} color={status.color} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSendTarget(customer); setSendChannel('sms'); setSendBody(''); setSendSubject(''); setSendResult(null) }}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-500 transition-colors"
                            title="Send message"
                          >
                            <Send size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add customer" size="md">
        <form onSubmit={handleAddCustomer} className="space-y-4">
          {addError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{addError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full name *" value={addForm.name} onChange={(e) => updateAdd('name', e.target.value)} required placeholder="John Smith" />
            <Input label="Phone" value={addForm.phone} onChange={(e) => updateAdd('phone', e.target.value)} placeholder="07700 900000" />
          </div>
          <Input label="Email" type="email" value={addForm.email} onChange={(e) => updateAdd('email', e.target.value)} placeholder="john@example.com" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vehicle reg" value={addForm.vehicle_reg} onChange={(e) => updateAdd('vehicle_reg', e.target.value.toUpperCase())} placeholder="AB12 CDE" />
            <Input label="Vehicle make" value={addForm.vehicle_make} onChange={(e) => updateAdd('vehicle_make', e.target.value)} placeholder="Ford Focus" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Last MOT date" type="date" value={addForm.last_mot_date} onChange={(e) => updateAdd('last_mot_date', e.target.value)} />
            <Input label="Last service date" type="date" value={addForm.last_service_date} onChange={(e) => updateAdd('last_service_date', e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" loading={adding}>Add customer</Button>
          </div>
        </form>
      </Modal>

      {/* Upload CSV Modal */}
      <Modal open={showUploadModal} onClose={() => { setShowUploadModal(false); setUploadFile(null); setUploadResult(null) }} title="Import customers from CSV" size="md">
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-medium mb-1">CSV column headers:</p>
            <p className="text-xs text-amber-700 font-mono">name, phone, email, last_service_date, last_mot_date, vehicle_reg, vehicle_make</p>
            <p className="text-xs text-amber-600 mt-1">Dates: DD/MM/YYYY or YYYY-MM-DD</p>
          </div>
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-amber-300 transition-colors cursor-pointer"
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            <Upload size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-600 font-medium">
              {uploadFile ? uploadFile.name : 'Click to choose CSV file'}
            </p>
            <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
          </div>
          {uploadResult && (
            <div className={`p-3 rounded-lg text-sm ${uploadResult.imported ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {uploadResult.imported ? `✓ Imported ${uploadResult.imported} customers successfully` : uploadResult.error}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!uploadFile} loading={uploading}>Import customers</Button>
          </div>
        </div>
      </Modal>

      {/* Send Message Modal */}
      <Modal open={!!sendTarget} onClose={() => setSendTarget(null)} title={`Send message to ${sendTarget?.name}`} size="md">
        <form onSubmit={handleSendMessage} className="space-y-4">
          {/* Channel toggle */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            {(['sms', 'email'] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setSendChannel(ch)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${sendChannel === ch ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {ch === 'sms' ? 'SMS' : 'Email'}
              </button>
            ))}
          </div>

          {sendChannel === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={sendSubject}
                onChange={(e) => setSendSubject(e.target.value)}
                placeholder="e.g. Your MOT is coming up"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={sendBody}
              onChange={(e) => setSendBody(e.target.value)}
              required
              rows={4}
              placeholder={sendChannel === 'sms' ? 'Type your SMS message…' : 'Type your email message…'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            {sendChannel === 'sms' && (
              <p className="text-xs text-gray-400 mt-1">{sendBody.length} characters · {Math.ceil(sendBody.length / 160) || 1} SMS credit</p>
            )}
          </div>

          {sendResult && (
            <div className={`p-3 rounded-lg text-sm ${sendResult.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {sendResult.success ? '✓ Message sent successfully' : sendResult.error || 'Failed to send'}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" type="button" onClick={() => setSendTarget(null)}>Cancel</Button>
            <Button type="submit" loading={sending} disabled={!sendBody.trim()}>
              <Send size={14} /> Send message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
