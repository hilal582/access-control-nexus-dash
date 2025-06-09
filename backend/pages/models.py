
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Comment(models.Model):
    PAGE_CHOICES = [
        ('products-list', 'Products List'),
        ('marketing-list', 'Marketing List'),
        ('order-list', 'Order List'),
        ('media-plans', 'Media Plans'),
        ('offer-pricing', 'Offer Pricing SKUs'),
        ('clients', 'Clients'),
        ('suppliers', 'Suppliers'),
        ('customer-support', 'Customer Support'),
        ('sales-reports', 'Sales Reports'),
        ('finance', 'Finance & Accounting'),
    ]
    
    page = models.CharField(max_length=50, choices=PAGE_CHOICES)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.author.email} - {self.page} - {self.content[:50]}"

class CommentHistory(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='history')
    previous_content = models.TextField()
    modified_by = models.ForeignKey(User, on_delete=models.CASCADE)
    modified_at = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=20, choices=[
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('deleted', 'Deleted'),
    ])
    
    class Meta:
        ordering = ['-modified_at']
    
    def __str__(self):
        return f"{self.comment.id} - {self.action} by {self.modified_by.email}"
