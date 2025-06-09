
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Clock } from "lucide-react";
import { toast } from "sonner";

const CommentSection = ({ pageName }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      content: "This is a great analysis of our product performance metrics.",
      author: "John Doe",
      createdAt: "2024-01-15 10:30 AM",
      modifiedAt: "2024-01-15 11:45 AM",
      modifiedBy: "Jane Smith"
    },
    {
      id: 2,
      content: "I agree with the recommendations. We should implement these changes next quarter.",
      author: "Mike Johnson",
      createdAt: "2024-01-15 02:15 PM",
      modifiedAt: null,
      modifiedBy: null
    },
    {
      id: 3,
      content: "Has anyone considered the budget implications of these proposals?",
      author: "Sarah Wilson",
      createdAt: "2024-01-16 09:20 AM",
      modifiedAt: "2024-01-16 09:25 AM",
      modifiedBy: "Sarah Wilson"
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      content: newComment,
      author: "Current User",
      createdAt: new Date().toLocaleString(),
      modifiedAt: null,
      modifiedBy: null
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment("");
    toast.success("Comment added successfully");
  };

  const handleEditComment = (id) => {
    const comment = comments.find(c => c.id === id);
    setEditingId(id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    setComments(prev => prev.map(comment => 
      comment.id === editingId 
        ? { 
            ...comment, 
            content: editContent, 
            modifiedAt: new Date().toLocaleString(),
            modifiedBy: "Current User"
          }
        : comment
    ));
    setEditingId(null);
    setEditContent("");
    toast.success("Comment updated successfully");
  };

  const handleDeleteComment = (id) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
    toast.success("Comment deleted successfully");
  };

  return (
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

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{comment.author}</p>
                    <p className="text-xs text-gray-500">{comment.createdAt}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditComment(comment.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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

              {comment.modifiedAt && (
                <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                  <Clock className="w-3 h-3" />
                  <span>
                    Modified by {comment.modifiedBy} on {comment.modifiedAt}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
