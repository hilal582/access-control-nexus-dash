
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_super_admin: boolean;
  created_at: string;
  email?: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  page: string;
  permission: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*');

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to fetch permissions');
    }
  };

  const createUser = async (userData: { first_name: string; last_name: string; email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
          }
        }
      });

      if (error) throw error;
      
      toast.success('User created successfully!');
      await fetchUsers();
      return { success: true };
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
      return { success: false, error: error.message };
    }
  };

  const updateUserPermissions = async (userId: string, newPermissions: Record<string, string>) => {
    try {
      // First, delete existing permissions for this user
      const { error: deleteError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Then insert new permissions
      const permissionsToInsert = Object.entries(newPermissions).map(([page, permission]) => ({
        user_id: userId,
        page,
        permission: permission.toLowerCase()
      }));

      const { error: insertError } = await supabase
        .from('user_permissions')
        .insert(permissionsToInsert);

      if (insertError) throw insertError;

      toast.success('Permissions updated successfully!');
      await fetchPermissions();
      return { success: true };
    } catch (error: any) {
      console.error('Error updating permissions:', error);
      toast.error(error.message || 'Failed to update permissions');
      return { success: false, error: error.message };
    }
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
    refetch: () => Promise.all([fetchUsers(), fetchPermissions()])
  };
};
