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
- Factories help create model instances with sensible defaults for testing.
