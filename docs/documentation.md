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
