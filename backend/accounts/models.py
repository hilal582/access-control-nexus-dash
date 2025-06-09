
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_super_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email

class UserPermission(models.Model):
    PERMISSION_CHOICES = [
        ('view', 'View'),
        ('edit', 'Edit'),
        ('create', 'Create'),
        ('delete', 'Delete'),
    ]
    
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
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='permissions')
    page = models.CharField(max_length=50, choices=PAGE_CHOICES)
    permission = models.CharField(max_length=10, choices=PERMISSION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'page', 'permission']
    
    def __str__(self):
        return f"{self.user.email} - {self.page} - {self.permission}"
