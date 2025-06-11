import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api';
import { toast } from 'sonner';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_super_admin: boolean;
  created_at: string;
}

export interface UserPermission {
  id: number;
  user: number;
  page: string;
  permission: string;
  created_at: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getUsers();
      setUsers(data.results || data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchPermissions = async () => {
    try {
      const data = await usersApi.getAllPermissions();
      setPermissions(data.results || data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to fetch permissions');
    }
  };

  const createUser = async (userData: {
    email: string;
    first_name: string;
    last_name: string;
    password?: string;
  }) => {
    try {
      const response = await usersApi.createUser(userData);
      toast.success(`User created successfully! Password: ${response.password}`);
      await fetchUsers();
      return { success: true, data: response };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
      return { success: false, error: error.message };
    }
  };

  const updateUserPermissions = async (userId: number, permissions: Record<string, string[]>) => {
    try {
      await usersApi.updateUserPermissions(userId, permissions);
      toast.success('Permissions updated successfully!');
      await fetchPermissions();
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update permissions');
      return { success: false, error: error.message };
    }
  };

  const getUserPermissions = (userId: number): Record<string, string[]> => {
    const userPermissions = permissions.filter(p => p.user === userId);
    const grouped: Record<string, string[]> = {};
    
    userPermissions.forEach(permission => {
      if (!grouped[permission.page]) {
        grouped[permission.page] = [];
      }
      grouped[permission.page].push(permission.permission);
    });
    
    return grouped;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchPermissions()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    users,
    permissions,
    loading,
    createUser,
    updateUserPermissions,
    getUserPermissions,
    refetch: () => Promise.all([fetchUsers(), fetchPermissions()]),
  };
};