
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
  email?: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  page: string;
  permission: string;
  created_at: string;
}

// Fetch all users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as User[];
    },
  });
};

// Fetch user permissions
export const useUserPermissions = (userId: string) => {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserPermission[];
    },
    enabled: !!userId,
  });
};

// Create a new user (this will be handled by Supabase Auth + trigger)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, firstName, lastName }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
        email_confirm: true,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create user");
    },
  });
};

// Update user permissions
export const useUpdateUserPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      permissions 
    }: { 
      userId: string; 
      permissions: { page: string; permission: string }[];
    }) => {
      // First delete existing permissions
      const { error: deleteError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Then insert new permissions
      if (permissions.length > 0) {
        const { error: insertError } = await supabase
          .from('user_permissions')
          .insert(
            permissions.map(p => ({
              user_id: userId,
              page: p.page,
              permission: p.permission,
            }))
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Permissions updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update permissions");
    },
  });
};

// Make user super admin
export const useMakeSuperAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_super_admin: true })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User promoted to super admin!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to promote user");
    },
  });
};
