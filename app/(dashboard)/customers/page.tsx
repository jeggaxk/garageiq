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
  Trash2,
  Send,
  Download,
  Pencil,
  Wrench,
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
  const [duplicateExisting, setDuplicateExisting] = useState<{ id: string; name: string; phone?: string; vehicle_reg?: string } | null>(null)
  const [editTarget, setEditTarget] = useState<Customer | null>(null)
  const [editForm, setEditForm] = useState({
    name: '', phone: '', email: '', vehicle_reg: '', vehicle_make: '',
    last_service_date: '', last_mot_date: '',
  })
  const [editing, setEditing] = useState(false)
  const [editError, setEditError] = useState('')
  const [sendTarget, setSendTarget] = useState<Customer | null>(null)
  const [sendChannel, setSendChannel] = useState<'sms' | 'email'>('sms')
  const [sendBody, setSendBody] = useState('')
  const [sendSubject, setSendSubject] = useState('')
  const [sending, setSending] = useState(false)
  const [workedOnTarget, setWorkedOnTarget] = useState<Customer | null>(null)
  const [workedOnService, setWorkedOnService] = useState(false)
  const [workedOnMot, setWorkedOnMot] = useState(false)
  const [workedOnSaving, setWorkedOnSaving] = useState(false)
  const [lookingUp, setLookingUp] = useState(false)
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

  function normaliseDate(dateStr: string): string {
    if (!dateStr) return ''
    // Handle DD/MM/YYYY
    const ukMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (ukMatch) return `${ukMatch[3]}-${ukMatch[2].padStart(2, '0')}-${ukMatch[1].padStart(2, '0')}`
    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    return dateStr
  }

  async function confirmWorkedOn() {
    if (!workedOnTarget || (!workedOnService && !workedOnMot)) return
    setWorkedOnSaving(true)
    const today = new Date().toISOString().split('T')[0]
    const body: Record<string, string> = {}
    if (workedOnService) body.last_service_date = today
    if (workedOnMot) body.last_mot_date = today
    await fetch(`/api/customers/${workedOnTarget.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setWorkedOnSaving(false)
    setWorkedOnTarget(null)
    setWorkedOnService(false)
    setWorkedOnMot(false)
    fetchCustomers()
  }

  async function lookupVehicle(reg: string, target: 'add' | 'edit') {
    if (!reg) return
    setLookingUp(true)
    const res = await fetch(`/api/vehicle-lookup?reg=${encodeURIComponent(reg)}`)
    const data = await res.json()
    setLookingUp(false)
    if (data.error) return
    if (target === 'add') {
      setAddForm(prev => ({
        ...prev,
        vehicle_make: data.make || prev.vehicle_make,
        last_mot_date: data.lastMotDate || prev.last_mot_date,
      }))
    } else {
      setEditForm(prev => ({
        ...prev,
        vehicle_make: data.make || prev.vehicle_make,
        last_mot_date: data.lastMotDate || prev.last_mot_date,
      }))
    }
  }

  async function handleAddCustomer(e: React.FormEvent, force = false) {
    e.preventDefault()
    setAdding(true)
    setAddError('')
    setDuplicateExisting(null)
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...addForm,
        last_mot_date: normaliseDate(addForm.last_mot_date),
        last_service_date: normaliseDate(addForm.last_service_date),
        force,
      }),
    })
    const data = await res.json()
    setAdding(false)
    if (res.status === 409 && data.duplicate) {
      setDuplicateExisting(data.existing)
      return
    }
    if (data.error) {
      setAddError(data.error)
      return
    }
    setShowAddModal(false)
    setDuplicateExisting(null)
    setAddForm({ name: '', phone: '', email: '', vehicle_reg: '', vehicle_make: '', last_service_date: '', last_mot_date: '' })
    fetchCustomers()
  }

  function openEdit(customer: Customer) {
    setEditTarget(customer)
    setEditForm({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      vehicle_reg: customer.vehicle_reg || '',
      vehicle_make: customer.vehicle_make || '',
      last_service_date: customer.last_service_date || '',
      last_mot_date: customer.last_mot_date || '',
    })
    setEditError('')
  }

  async function handleEditCustomer(e: React.FormEvent) {
    e.preventDefault()
    if (!editTarget) return
    setEditing(true)
    setEditError('')
    const res = await fetch(`/api/customers/${editTarget.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editForm,
        last_mot_date: normaliseDate(editForm.last_mot_date),
        last_service_date: normaliseDate(editForm.last_service_date),
      }),
    })
    const data = await res.json()
    setEditing(false)
    if (data.error) { setEditError(data.error); return }
    setEditTarget(null)
    fetchCustomers()
  }

  const updateEdit = (field: string, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }))

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
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <PageHeader
        title="Customers"
        description={`${customers.length} customers`}
        action={
          <div className="flex gap-2">
            <a href="/corviz-customers-template.csv" download className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-navy-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors">
              <Download size={13} /> CSV template
            </a>
            <Button variant="secondary" size="sm" onClick={() => setShowUploadModal(true)}>
              <Upload size={15} /> <span className="hidden sm:inline">Import CSV</span>
            </Button>
            <Button size="sm" onClick={() => { setShowAddModal(true); setDuplicateExisting(null) }}>
              <Plus size={15} /> <span className="hidden sm:inline">Add customer</span>
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
                            onClick={() => { setWorkedOnTarget(customer); setWorkedOnService(false); setWorkedOnMot(false) }}
                            className="p-1.5 rounded-lg hover:bg-green-50 text-gray-300 hover:text-green-500 transition-colors"
                            title="Worked on today"
                          >
                            <Wrench size={14} />
                          </button>
                          <button
                            onClick={() => { setSendTarget(customer); setSendChannel('sms'); setSendBody(''); setSendSubject(''); setSendResult(null) }}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-500 transition-colors"
                            title="Send message"
                          >
                            <Send size={14} />
                          </button>
                          <button
                            onClick={() => openEdit(customer)}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-300 hover:text-amber-500 transition-colors"
                            title="Edit customer"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                            title="Delete customer"
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
      <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setDuplicateExisting(null) }} title="Add customer" size="md">
        <form onSubmit={handleAddCustomer} className="space-y-4">
          {addError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{addError}</div>
          )}
          {duplicateExisting && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-amber-900">This customer already exists</p>
              <p className="text-sm text-amber-700">
                <span className="font-medium">{duplicateExisting.name}</span>
                {duplicateExisting.phone && ` · ${duplicateExisting.phone}`}
                {duplicateExisting.vehicle_reg && ` · ${duplicateExisting.vehicle_reg}`}
              </p>
              <p className="text-xs text-amber-600">Would you like to update their details, or add them as a separate entry?</p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { openEdit({ id: duplicateExisting.id, name: duplicateExisting.name, phone: duplicateExisting.phone, vehicle_reg: duplicateExisting.vehicle_reg } as never); setShowAddModal(false); setDuplicateExisting(null) }}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  Update their details
                </button>
                <button
                  type="button"
                  onClick={(e) => handleAddCustomer(e as never, true)}
                  className="flex-1 border border-amber-300 text-amber-800 text-xs font-semibold py-2 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  Add anyway
                </button>
              </div>
            </div>
          )}
          {!duplicateExisting && (
            <>
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
            </>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setShowAddModal(false); setDuplicateExisting(null) }}>Cancel</Button>
            {!duplicateExisting && <Button type="submit" loading={adding}>Add customer</Button>}
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

      {/* Edit Customer Modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit customer" size="md">
        <form onSubmit={handleEditCustomer} className="space-y-4">
          {editError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{editError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full name *" value={editForm.name} onChange={(e) => updateEdit('name', e.target.value)} required placeholder="John Smith" />
            <Input label="Phone" value={editForm.phone} onChange={(e) => updateEdit('phone', e.target.value)} placeholder="07700 900000" />
          </div>
          <Input label="Email" type="email" value={editForm.email} onChange={(e) => updateEdit('email', e.target.value)} placeholder="john@example.com" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vehicle reg" value={editForm.vehicle_reg} onChange={(e) => updateEdit('vehicle_reg', e.target.value.toUpperCase())} placeholder="AB12 CDE" />
            <Input label="Vehicle make" value={editForm.vehicle_make} onChange={(e) => updateEdit('vehicle_make', e.target.value)} placeholder="Ford Focus" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Last MOT date" type="date" value={editForm.last_mot_date} onChange={(e) => updateEdit('last_mot_date', e.target.value)} />
            <Input label="Last service date" type="date" value={editForm.last_service_date} onChange={(e) => updateEdit('last_service_date', e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button type="submit" loading={editing}>Save changes</Button>
          </div>
        </form>
      </Modal>

      {/* Worked On Modal */}
      <Modal open={!!workedOnTarget} onClose={() => setWorkedOnTarget(null)} title="Worked on today" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Select what was done on <span className="font-medium text-navy-900">{workedOnTarget?.name}</span>'s vehicle today. The date will be set to today automatically.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={workedOnService}
                onChange={(e) => setWorkedOnService(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-navy-900">Service</p>
                <p className="text-xs text-gray-400">Updates last service date to today</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={workedOnMot}
                onChange={(e) => setWorkedOnMot(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-navy-900">MOT</p>
                <p className="text-xs text-gray-400">Updates last MOT date to today</p>
              </div>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" type="button" onClick={() => setWorkedOnTarget(null)}>Cancel</Button>
            <Button
              onClick={confirmWorkedOn}
              loading={workedOnSaving}
              disabled={!workedOnService && !workedOnMot}
            >
              <Wrench size={14} /> Confirm
            </Button>
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
