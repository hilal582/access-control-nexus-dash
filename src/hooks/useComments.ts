import { useState, useEffect } from 'react';
import { pagesApi } from '@/lib/api';
import { toast } from 'sonner';

export interface Comment {
  id: number;
  page: string;
  content: string;
  author: number;
  author_name: string;
  author_email: string;
  created_at: string;
  updated_at: string;
  can_edit: boolean;
  can_delete: boolean;
}

export interface CommentHistory {
  id: number;
  previous_content: string;
  modified_by: number;
  modified_by_name: string;
  modified_by_email: string;
  modified_at: string;
  action: string;
}

export const useComments = (page: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const data = await pagesApi.getComments(page);
      setComments(data.results || data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    }
  };

  const fetchPermissions = async () => {
    try {
      const data = await pagesApi.getPagePermissions(page);
      setPermissions(data.permissions || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const createComment = async (content: string) => {
    try {
      await pagesApi.createComment(page, content);
      toast.success('Comment added successfully!');
      await fetchComments();
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
      return { success: false, error: error.message };
    }
  };

  const updateComment = async (commentId: number, content: string) => {
    try {
      await pagesApi.updateComment(commentId, content);
      toast.success('Comment updated successfully!');
      await fetchComments();
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update comment');
      return { success: false, error: error.message };
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await pagesApi.deleteComment(commentId);
      toast.success('Comment deleted successfully!');
      await fetchComments();
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
      return { success: false, error: error.message };
    }
  };

  const getCommentHistory = async (commentId: number) => {
    try {
      const data = await pagesApi.getCommentHistory(commentId);
      return { success: true, data: data.results || data };
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch comment history');
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchComments(), fetchPermissions()]);
      setLoading(false);
    };

    if (page) {
      loadData();
    }
  }, [page]);

  return {
    comments,
    permissions,
    loading,
    createComment,
    updateComment,
    deleteComment,
    getCommentHistory,
    refetch: () => Promise.all([fetchComments(), fetchPermissions()]),
    canView: permissions.includes('view'),
    canEdit: permissions.includes('edit'),
    canCreate: permissions.includes('create'),
    canDelete: permissions.includes('delete'),
  };
};