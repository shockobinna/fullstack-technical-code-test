# fullstack-technical-code-test
A full-stack job position test code using Django and React.js

# Papelaria

Papelaria is a project developed using Django 4.2.7 and React. It is designed to realise CRUD operations which involves saving sales, editing sales, deleting and displaying sales giving real time updates on sales, a particular sale details, customers and the seller who made the sales.
It is also provides the functionality of returning the total sales commission to be paid or paid to every seller over a certain time interval.

## Getting Started

These instructions will help you set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed on your machine:

- [Python](https://www.python.org/) (version 3.8 or higher recommended)
- [Node.js](https://nodejs.org/) (version 12 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js installation)
- [Django](https://www.djangoproject.com/) (version 4.2.7)
- [PostgreSQL](https://www.postgresql.org/) (or your preferred database)
- [git](https://git-scm.com/)

### Installing

1. Clone the repository:


- git clone https://github.com/shockobinna/fullstack-technical-code-test

2. Change into the project directory: 
- cd papelaria


### Backend Setup (Django)

3. Create a virtual environment (recommended):
- python -m venv venv

4. Activate the virtual environment:
- On Windows: venv\Scripts\activate
- On macOS/Linux: source venv/bin/activate


5. Install backend dependencies:
- pip install -r requirements.txt

6. Apply database migrations:
- python manage.py migrate

7. Create a superuser account (for Django admin access):
- python manage.py createsuperuser


8. Configure environment variables:
- Create a .env file in the root directory with the following content:
### .env file

### Database settings
- DB_NAME=your_database_name
- DB_USER=your_database_user
- DB_PASSWORD=your_database_password
- DB_HOST=your_database_host
- DB_PORT=your_database_port

### Django settings.py
- DJANGO_SECRET_KEY=your_secret_key
- DEBUG=True




9. Run the Django development server:
- python manage.py runserver


10. Frontend Setup (React)
Change into the frontend directory:
- Open another terminal
- cd frontend
- npm install
- npm start


### Accessing the Application
Your application should open up on your browser.
- Backend: http://localhost:8000/
- Frontend: http://localhost:3000/




## Additional Notes
Customize the .env file with your specific configuration details.
You may need to configure your database settings in the settings.py file.
Customize other settings as needed.
Feel free to update this README with project-specific instructions.


