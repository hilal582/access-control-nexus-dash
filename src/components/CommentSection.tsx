import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Clock, History } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CommentSectionProps {
  pageName: string;
}

const CommentSection = ({ pageName }: CommentSectionProps) => {
  const { user } = useAuth();
  const {
    comments,
    loading,
    createComment,
    updateComment,
    deleteComment,
    getCommentHistory,
    canCreate,
    canView
  } = useComments(pageName);

  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [showingHistory, setShowingHistory] = useState<number | null>(null);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    const result = await createComment(newComment);
    if (result.success) {
      setNewComment("");
    }
  };

  const handleEditComment = (comment: any) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editContent.trim()) return;
    
    const result = await updateComment(editingId, editContent);
    if (result.success) {
      setEditingId(null);
      setEditContent("");
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(id);
    }
  };

  const handleShowHistory = async (commentId: number) => {
    if (showingHistory === commentId) {
      setShowingHistory(null);
      setHistoryData([]);
      return;
    }

    const result = await getCommentHistory(commentId);
    if (result.success) {
      setHistoryData(result.data);
      setShowingHistory(commentId);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading comments...</div>
        </CardContent>
      </Card>
    );
  }

  if (!canView) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            You don't have permission to view comments on this page.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Comments</span>
            <Badge variant="secondary">{comments.length}</Badge>
          </CardTitle>
          <CardDescription>
            Collaborate and share insights about this page content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Comment */}
          {canCreate && (
            <div className="space-y-3">
              <h4 className="font-medium">Add a comment</h4>
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {comment.author_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{comment.author_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {user?.is_super_admin && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShowHistory(comment.id)}
                          >
                            <History className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View modification history</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    
                    {comment.can_edit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditComment(comment)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {comment.can_delete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{comment.content}</p>
                )}

                {comment.updated_at !== comment.created_at && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                    <Clock className="w-3 h-3" />
                    <span>
                      Last modified on {new Date(comment.updated_at).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Comment History */}
                {showingHistory === comment.id && historyData.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                    <h5 className="font-medium text-sm mb-2">Modification History</h5>
                    <div className="space-y-2">
                      {historyData.map((history, index) => (
                        <div key={history.id} className="text-xs">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {history.action}
                            </Badge>
                            <span className="text-gray-600">
                              by {history.modified_by_name}
                            </span>
                            <span className="text-gray-500">
                              {new Date(history.modified_at).toLocaleString()}
                            </span>
                          </div>
                          {history.previous_content && (
                            <div className="mt-1 p-2 bg-white rounded text-gray-700">
                              Previous: "{history.previous_content}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No comments yet. {canCreate && "Be the first to add one!"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default CommentSection;