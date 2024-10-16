/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { Toast } from '@/components/ui/Toast'

// Define the base URL for the API
const API_BASE_URL = 'http://localhost:3001/api'

// Define interfaces for our data types
interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Role {
  id: string
  name: string
}

interface Permission {
  id: string
  name: string
}

interface App {
  id: string
  name: string
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const { toast, toasts, dismissToast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [usersRes, rolesRes, permissionsRes, appsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/roles`),
        axios.get(`${API_BASE_URL}/permissions`),
        axios.get(`${API_BASE_URL}/apps`),
      ])
      setUsers(usersRes.data)
      setRoles(rolesRes.data)
      setPermissions(permissionsRes.data)
      setApps(appsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch data. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (type: string, data: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${type}`, data)
      fetchData() // Refresh data after creation
      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully.`,
      })
    } catch (error) {
      console.error(`Error creating ${type}:`, error)
      toast({
        title: 'Error',
        description: `Failed to create ${type}. Please try again.`,
        variant: 'destructive',
      })
    }
  }

  const handleUpdate = async (type: string, id: string, data: any) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${type}/${id}`, data)
      fetchData() // Refresh data after update
      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully.`,
      })
    } catch (error) {
      console.error(`Error updating ${type}:`, error)
      toast({
        title: 'Error',
        description: `Failed to update ${type}. Please try again.`,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (type: string, id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${type}/${id}`)
      fetchData() // Refresh data after deletion
      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`,
      })
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      toast({
        title: 'Error',
        description: `Failed to delete ${type}. Please try again.`,
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="apps">Apps</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Users</h2>
            <Button onClick={() => handleCreate('users', { name: 'New User', email: 'new@example.com', role: 'User' })}>
              Create User
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdate('users', user.id, { ...user, name: `${user.name} (Updated)` })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('users', user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Roles</h2>
            <Button onClick={() => handleCreate('roles', { name: 'New Role' })}>
              Create Role
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdate('roles', role.id, { ...role, name: `${role.name} (Updated)` })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('roles', role.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="permissions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Permissions</h2>
            <Button onClick={() => handleCreate('permissions', { name: 'New Permission' })}>
              Create Permission
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdate('permissions', permission.id, { ...permission, name: `${permission.name} (Updated)` })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('permissions', permission.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="apps" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Apps</h2>
            <Button onClick={() => handleCreate('apps', { name: 'New App' })}>
              Create App
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdate('apps', app.id, { ...app, name: `${app.name} (Updated)` })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('apps', app.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      {toasts.map((toast: any) => (
        <Toast id={toast.id} key={toast.id} {...toast} onDismiss={dismissToast} />
      ))}
    </div>
  )
}