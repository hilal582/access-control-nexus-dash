from django.contrib.auth.models import AbstractUser
from django.db import models
import secrets
import string

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_super_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    @staticmethod
    def generate_strong_password(length=12):
        """Generate a strong password with uppercase, lowercase, digits, and symbols"""
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        password = ''.join(secrets.choice(alphabet) for i in range(length))
        return password

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

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"OTP for {self.user.email}"
    
    @staticmethod
    def generate_otp():
        """Generate a 6-digit OTP"""
        return ''.join(secrets.choice(string.digits) for _ in range(6))