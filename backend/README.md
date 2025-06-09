
# Super Admin Dashboard - Django Backend

## Setup Instructions

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser
```bash
python manage.py createsuperuser
```

### 5. Run Development Server
```bash
python manage.py runserver
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/users/` - List all users (admin only)
- `POST /api/auth/users/` - Create new user (admin only)

### User Permissions
- `GET /api/auth/permissions/user/{user_id}/` - Get user permissions
- `POST /api/auth/permissions/update/{user_id}/` - Update user permissions

### Comments
- `GET /api/pages/{page}/comments/` - List comments for a page
- `POST /api/pages/{page}/comments/` - Create comment (requires create permission)
- `PUT /api/pages/comments/{id}/` - Update comment (requires edit permission)
- `DELETE /api/pages/comments/{id}/` - Delete comment (requires delete permission)
- `GET /api/pages/comments/{id}/history/` - View comment history (admin only)

### Page Permissions
- `GET /api/pages/{page}/permissions/` - Get current user's permissions for a page

## Models

### User
- Custom user model with email as username
- `is_super_admin` field for admin privileges

### UserPermission
- Links users to page permissions
- Supports: view, edit, create, delete permissions
- 10 predefined pages

### Comment
- Page-specific comments
- Author tracking
- Creation and modification timestamps

### CommentHistory
- Tracks all comment modifications
- Stores previous content
- Records who made changes and when

## Admin Interface

Access Django admin at `http://localhost:8000/admin/` to:
- Manage users and permissions
- View comment history
- Monitor system activity

## Security Features

- JWT authentication with access/refresh tokens
- Permission-based access control
- CORS configuration for frontend integration
- Password validation
- Admin-only endpoints protection
