# Documentation for Ziply Project

## Docker Commands

### Build and Start Services
To build and start all services defined in the `docker-compose.yaml` file, run:
```bash
docker-compose up --build
```

### Stop Services
To stop all running services:
```bash
docker-compose down
```

### Specific Service Commands
- Start the web service:
  ```bash
  docker-compose up web
  ```
- Start the Celery worker:
  ```bash
  docker-compose up celery
  ```
- Start the Celery beat scheduler:
  ```bash
  docker-compose up celery-beat
  ```
- Start the Mailhog service:
  ```bash
  docker-compose up mailhog
  ```

## Django Commands

### Run Development Server
To run the Django development server:
```bash
python manage.py runserver
```

### Apply Migrations
To apply database migrations:
```bash
python manage.py migrate
```

### Create Superuser
To create a superuser for the admin panel:
```bash
python manage.py createsuperuser
```

### Run Tests
To run Django tests:
```bash
pytest
```

## Celery Commands

### Start Worker
To start the Celery worker:
```bash
celery -A ziply worker -l info --concurrency=4
```

### Start Beat Scheduler
To start the Celery beat scheduler:
```bash
celery -A ziply beat -l info -s /tmp/celerybeat-schedule
```

## Redis Commands

### Access Redis CLI
To access the Redis CLI:
```bash
docker exec -it <redis_container_name> redis-cli
```

## Mailhog Commands

### Access Mailhog Web Interface
To access the Mailhog web interface, open:
```
http://localhost:8025
```

## CI/CD Workflow

### Lint and Test Backend
The CI pipeline runs the following commands for the backend:
```bash
black --check .
isort --check-only .
flake8 .
pytest --cov=ziply --cov-report=term --cov-report=xml
```

### Lint and Test Frontend
The CI pipeline runs the following commands for the frontend:
```bash
npm run lint
npm run test -- --watchAll=false
```

### Build Frontend
To build the Next.js frontend:
```bash
npm run build
```

## Testing and Code Quality Tools

### Pytest Coverage
To run tests with coverage and generate a report:
```bash
pytest --cov=ziply --cov-report=term --cov-report=html
```
- The terminal will show a summary.
- To view a detailed HTML report, open `htmlcov/index.html` in your browser.

### Mutmut (Mutation Testing)
To run mutation tests with mutmut:
```bash
mutmut run
```
To view the results:
```bash
mutmut results
```
- You can also use `mutmut html` to generate an HTML report (if enabled).
- For more details, see the [mutmut documentation](https://mutmut.readthedocs.io/).

### Factory Boy (Test Data Factories)
- Import and use factories in your tests to generate test data.
- Example usage in a test:
  ```python
  from myapp.factories import UserFactory
  def test_user_creation():
      user = UserFactory()
      assert user.is_active
  ```

## CurrentBusinessMiddleware - Business Context Middleware

### Purpose

In a multi-tenant SaaS system, each user can belong to one or more businesses. This middleware ensures:

* Views automatically receive the current business (`request.business`)
* Unauthorized access to other users' businesses is denied
* Querysets and serializers can rely on `request.business` for filtering

### How it works

* Middleware checks for the `X-Business-Slug` header
* If the user is authenticated and is a member of the business with the given slug, the middleware sets `request.business`
* Otherwise, it blocks the request with a 403 Forbidden response

### Example header (used by frontend or API client)

`X-Business-Slug: creative-agency-23`

### Usage in views

Once the middleware is installed, you can use `request.business` directly:
```python
class TeamView(APIView):
    def get(self, request):
        members = BusinessMember.objects.filter(business=request.business)
        return Response({"members": [m.user.email for m in members]})
```

# Business Role Permissions (`permissions.py`)

Custom permissions are used to restrict access based on a user’s **business role** (Owner, Admin, Manager, Staff). These permission classes are defined in `accounts/permissions.py` and are intended for use across the platform.

---

## Usage

### Importing

In any view that uses role-based restrictions, import the permission(s) like this:

```python
from accounts.permissions import IsBusinessOwner, IsBusinessAdmin, IsBusinessManager, IsBusinessStaff
```

### Applying in views

```python
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class ReportView(APIView):
    permission_classes = [IsAuthenticated, IsBusinessAdmin]

    def get(self, request):
        return Response({"data": "Sensitive report"})
```

Only users with the **Admin** role (in their current business context) will be allowed to access this view.

---

## Available Roles & Permissions

| Role    | Permission Class    | Description                                                 |
| ------- | ------------------- | ----------------------------------------------------------- |
| Owner   | `IsBusinessOwner`   | Has full control over business and users                    |
| Admin   | `IsBusinessAdmin`   | Can manage most resources, users, settings                  |
| Manager | `IsBusinessManager` | Limited control, usually task-focused                       |
| Staff   | `IsBusinessStaff`   | Restricted to basic actions, read/update personal resources |

You can combine permissions using `Or` / `And` logic with DRF’s `permissions` utils if needed.

---

## Common Patterns

### Protecting sensitive endpoints

```python
class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated, IsBusinessOwner]
```

### Allowing broader access

```python
class TaskView(APIView):
    permission_classes = [IsAuthenticated, IsBusinessManager | IsBusinessAdmin]
```

---

## Why use custom permissions?

* ✅ Centralized logic per role
* ✅ Reusable across all views
* ✅ Fine-grained access control for B2B multi-tenant platforms
* ✅ Easy to extend later (e.g., add audit logging, restrict by action)

---

## Guidelines for Contributors

### Always

* Use role-based permissions when restricting business-level access
* Combine with `IsAuthenticated` unless you're building a public endpoint
* Clearly document which roles are allowed for each endpoint

### Never

* Assume that `request.user` alone is sufficient — permissions are per **business membership**
* Use hard-coded role checks (`if user.role == "Admin"`) in views — use permission classes instead

---

## FAQ

#### What if a user has multiple businesses?

The current business must be selected via the `X-Business-Slug` header. Middleware resolves this and injects `request.business`.

#### Can one user have multiple roles?

Yes, per business. A user can be an Admin in one and a Staff in another. Permissions are scoped to the active business.

#### Do I need to register the permissions?

No. DRF permissions are **used explicitly in views** via `permission_classes`. No registration needed.

#### Where should I place `permissions.py`?

In the Django app responsible for user or access control logic (usually `accounts/`). Not in the project root.

---

## Example from `accounts/permissions.py`

```python
from rest_framework.permissions import BasePermission

class IsBusinessOwner(BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, "current_role", None) == "Owner"
```

*Note: The actual implementation might rely on `request.businessmember.role` or similar depending on middleware.*

---

## Testing

Always cover permission classes with unit tests to verify expected access behavior:

```python
def test_owner_has_access():
    request = fake_request(user=owner_user, business=some_business)
    assert IsBusinessOwner().has_permission(request, view=None)
```

# Django REST Framework: APIView vs ViewSet

This document explains the differences between `APIView` and `ViewSet` in Django REST Framework (DRF), how to implement them, and when to use each.

---

## 1. What is APIView?

* `APIView` is a class-based view in DRF that extends Django’s regular `View` with REST-specific features.
* You explicitly define handlers for HTTP methods (`get()`, `post()`, `put()`, `delete()`, etc.).
* Offers fine-grained control over request handling and responses.

### Example of APIView

```python
# accounts/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .models import User

class UserListAPIView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### Where to put it?

* In your app’s `views.py` or a dedicated `views/` folder (e.g., `accounts/views.py`).

### How to connect URLs?

```python
# accounts/urls.py
from django.urls import path
from .views import UserListAPIView

urlpatterns = [
    path('users/', UserListAPIView.as_view(), name='user-list'),
]
```

---

## 2. What is ViewSet?

* `ViewSet` groups common CRUD operations (`list`, `create`, `retrieve`, `update`, `destroy`) into a single class.
* Reduces boilerplate code.
* Works seamlessly with DRF routers for automatic URL routing.

### Example of ViewSet

```python
# accounts/views.py
from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
```

### Where to put it?

* Same as APIView, usually `views.py` or `views/` folder.

### How to connect URLs with router?

```python
# accounts/urls.py
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = router.urls
```

This creates all standard endpoints for users:

| Method | URL            | Action         |
| ------ | -------------- | -------------- |
| GET    | `/users/`      | List users     |
| POST   | `/users/`      | Create user    |
| GET    | `/users/{id}/` | Retrieve user  |
| PUT    | `/users/{id}/` | Update user    |
| PATCH  | `/users/{id}/` | Partial update |
| DELETE | `/users/{id}/` | Delete user    |

---

## 3. Comparison: APIView vs ViewSet

| Feature                 | APIView                       | ViewSet                          |
| ----------------------- | ----------------------------- | -------------------------------- |
| Code style              | Explicit HTTP method handlers | Actions grouped by resource      |
| Boilerplate             | More verbose                  | Less code, DRY                   |
| Routing                 | Manual (explicit URL conf)    | Automatic with routers           |
| CRUD operations support | You write handlers for each   | Built-in standard CRUD           |
| Flexibility             | Maximum control               | Good for standard CRUD APIs      |
| Use case                | Custom or complex behavior    | Standard resource CRUD endpoints |

---

## 4. Benefits of ViewSets with Routers

* DRY: Less repetition and boilerplate code.
* Automatic URL generation.
* Consistent RESTful API design.
* Easy to add custom actions (using `@action` decorator).

---

## 5. How to use in your codebase?

* Put API views or viewsets inside your app’s `views.py` or split into multiple files if large.
* Use routers for viewsets in `urls.py` to generate RESTful URLs automatically.
* For simple endpoints or complex logic, use APIView.
* For standard CRUD models, prefer ViewSet + router for clean code.

---

## 6. Common mistakes & tips

* Remember to add `.as_view()` when using APIView in URLs.
* With ViewSets, never forget to register them in the router.
* Use serializers to validate and serialize data.
* Use permissions and authentication classes on views/viewsets for access control.
* Test your endpoints with tools like Postman or curl.

---

## 7. Example usage in URL configuration

```python
# project/urls.py
from django.urls import path, include

urlpatterns = [
    path('api/', include('accounts.urls')),
]
```

```python
# accounts/urls.py
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = router.urls
```
