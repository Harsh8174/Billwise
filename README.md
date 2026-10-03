# BillWise – Invoice Reminder System

BillWise is an **Invoice Management and Automated Reminder System** built using Spring Boot and PostgreSQL.

The system allows an administrator to manage customers and invoices, configure scheduled reminder jobs, track reminder attempts, and monitor job execution history.

The frontend is developed separately using **HTML, CSS, and JavaScript** and communicates with the Spring Boot backend through REST APIs.

---

## 🚀 Features

* Admin login
* Customer management
* Invoice management
* Invoice status management
* Upcoming invoice reminders
* Due-today reminders
* Overdue reminders
* Automated email notifications
* Reminder attempt history
* Scheduler job configuration
* Scheduler enable/disable functionality
* Job execution tracking
* Duplicate reminder prevention
* PostgreSQL database
* Flyway database migration
* REST APIs
* Unit and repository testing

---

# 🛠️ Technology Stack

## Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* Spring Scheduler
* Spring Mail
* REST API
* PostgreSQL
* Flyway
* Maven
* JUnit
* Mockito

## Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

---

# 📁 Project Structure

```text
Billwise [boot]
│
├── src/main/java
│   └── com.app
│       │
│       ├── BillwiseApplication.java
│       │
│       ├── com.app.controller
│       │   ├── AdminController.java
│       │   ├── CustomerController.java
│       │   ├── InvoiceController.java
│       │   └── SchedulerController.java
│       │
│       ├── com.app.enums
│       │   ├── InvoiceStatus.java
│       │   ├── JobTrigger.java
│       │   └── Reminderperiod.java
│       │
│       ├── com.app.exceptionhandler
│       │   ├── AdminLoginInvalidCredentials.java
│       │   └── GlobalExceptionHandler.java
│       │
│       ├── com.app.models
│       │   ├── Admin.java
│       │   ├── Customer.java
│       │   ├── Invoice.java
│       │   ├── JobExecution.java
│       │   ├── ReminderAttempt.java
│       │   └── SchedulerJob.java
│       │
│       ├── com.app.repository
│       │   ├── Admindao.java
│       │   ├── Customerjpa.java
│       │   ├── Invoicejpa.java
│       │   ├── JobExecutionJpa.java
│       │   ├── RemainderAttemptjpa.java
│       │   └── SchedulerJobs.java
│       │
│       ├── com.app.requestdto
│       │   ├── Admindto.java
│       │   ├── Customerdto.java
│       │   ├── Invoicedto.java
│       │   ├── Invoicestatusdto.java
│       │   └── Schulerdto.java
│       │
│       ├── com.app.responsedto
│       │   ├── Customerdto.java
│       │   ├── Dashboardresponsedto.java
│       │   ├── Invoicedto.java
│       │   ├── Jobexecutionresponse.java
│       │   ├── ReminderAttemptdto.java
│       │   └── Scheduler_Job_dto.java
│       │
│       └── com.app.services
│           ├── AdminService.java
│           ├── AdminServiceImpl.java
│           ├── CustomerService.java
│           ├── CustomerServiceImpl.java
│           ├── InvoiceService.java
│           ├── InvoiceServiceImpl.java
│           ├── JobExecutionService.java
│           ├── JobExecutionServiceImpl.java
│           ├── Notificationserviceimpl.java
│           ├── NotificatonService.java
│           ├── SchedulerService.java
│           └── SchedulerServiceImpl.java
│
├── src/main/resources
│   ├── db
│   │   └── migration
│   │       ├── V1__Seed_Data.sql
│   │       ├── V2__Insert_Admin.sql
│   │       └── V3__Create_Scheduler_Job_Tables.sql
│   │
│   ├── static
│   ├── templates
│   └── application.properties
│
├── src/test/java
│   ├── com.app.invoice_testing
│   │   └── InvoiceRespositoryTest.java
│   │
│   ├── com.app.scheduler_test
│   │   └── SchedulerServiceImplTest.java
│   │
│   ├── com.app.scheduling_testing
│   │   └── Scheduling_testing.java
│   │
│   └── com.app.test
│
└── src/test/resources
    └── application-test.properties


billwise-frontend
└── billwise-frontend
    ├── css
    │   └── styles.css
    │
    ├── js
    │   ├── api.js
    │   ├── mock-api.js
    │   └── ui.js
    │
    ├── dashboard.html
    ├── invoice-detail.html
    ├── invoices.html
    ├── login.html
    └── scheduled-jobs.html
```

---

# 🔗 API Endpoints

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| POST   | `/admin/login`            | Admin login                   |
| GET    | `/admin/dashboard`        | Get dashboard data            |
| GET    | `/customer/get/all`       | Get all customers             |
| POST   | `/customer/add`           | Add customer                  |
| POST   | `/invoice/add`            | Add invoice                   |
| PATCH  | `/invoice/setStatus/{id}` | Update invoice status         |
| POST   | `/invoice/markPaid/{id}`  | Mark invoice as paid          |
| POST   | `/schedule/add`           | Add scheduler job             |
| PATCH  | `/schedule/enable/{id}`   | Enable/disable scheduler job  |
| PATCH  | `/schedule/job/{id}`      | Update scheduler job time     |
| POST   | `/schedule/runNow/{id}`   | Run scheduler job immediately |


# ⚙️ Prerequisites

Install the following before running BillWise:

* **Java 21 or higher**
* **Maven**
* **PostgreSQL**
* **Git**
* Modern web browser

Check Java:

```bash
java -version
```

Check Maven:

```bash
mvn -version
```

---

# 🗄️ PostgreSQL Setup

BillWise uses **PostgreSQL** as its database.

Create the database:

```sql
CREATE DATABASE billwise;
```

Update the database configuration in:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/billwise
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=none
```

Replace the username and password with your PostgreSQL credentials.

---

# 🗃️ Flyway Database Migration

BillWise uses **Flyway** for database version control and schema management.

Migration files are located at:

```text
src/main/resources/db/migration/
```

Current migrations:

```text
V1__Seed_Data.sql
V2__Insert_Admin.sql
V3__Create_Scheduler_Job_Tables.sql
```

Flyway automatically detects and executes pending migrations when the Spring Boot application starts.

Hibernate is configured with:

```properties
spring.jpa.hibernate.ddl-auto=none
```

Therefore, database schema changes are managed through Flyway instead of Hibernate's automatic schema generation.

### Migration naming convention

New migrations should follow:

```text
V4__Description.sql
V5__Description.sql
```

For example:

```text
V4__Add_Invoice_Reference.sql
```

---

# 🔧 Backend Setup

Clone the repository:

```bash
git clone <your-github-repository-url>
```

Move into the backend project:

```bash
cd Billwise
```

Build the project:

```bash
mvn clean install
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

You can also run:

```text
BillwiseApplication.java
```

directly from Eclipse/STS.

The backend will start on the port configured in:

```text
application.properties
```

Example:

```text
http://localhost:8080
```

---

# 🌐 Frontend Setup

The frontend is located separately in:

```text
billwise-frontend/
```

Main pages include:

```text
login.html
dashboard.html
invoices.html
invoice-detail.html
scheduled-jobs.html
```

JavaScript files:

```text
js/
├── api.js
├── mock-api.js
└── ui.js
```

CSS:

```text
css/
└── styles.css
```

### Running the frontend

You can run the frontend using **VS Code Live Server**.

Open:

```text
billwise-frontend
```

in VS Code and start Live Server.

For example:

```text
http://127.0.0.1:5500/login.html
```

The frontend uses JavaScript's `fetch()` API to communicate with the Spring Boot REST APIs.

---

# 🔗 Backend + Frontend Flow

The overall application works like this:

```text
              BillWise Frontend
                     │
                     │ REST API
                     ↓
            Spring Boot Backend
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    Controller    Services     Scheduler
        │            │            │
        └────────────┼────────────┘
                     ↓
                Repository
                     │
                     ↓
                PostgreSQL
```

---

# 🔐 Admin Login

BillWise provides an admin login system.

The admin account is inserted through the Flyway migration:

```text
V2__Insert_Admin.sql
```

The administrator can:

* Login
* Manage customers
* Create invoices
* Update invoices
* Change invoice status
* View invoices
* View reminder history
* Configure scheduled jobs
* Monitor job execution

---

# 🧾 Invoice Management

An invoice contains information such as:

* Invoice number
* Customer
* Invoice date
* Due date
* Amount
* Status
* Description/reference
* Timestamps

Invoice statuses are represented using:

```text
InvoiceStatus.java
```

Typical statuses include:

```text
NEW
PENDING
DUE
OVERDUE
PAID
```

If an invoice is marked as:

```text
PAID
```

the scheduler does not send further reminders for that invoice.

---

# 📧 Automated Reminder System

BillWise contains an automated reminder system using Spring Scheduler.

Reminder periods are represented by:

```text
Reminderperiod.java
```

The system supports reminder periods such as:

```text
UPCOMING
DUE_TODAY
OVERDUE
```

The general process is:

```text
Scheduler
    ↓
Find invoices
    ↓
Check invoice status
    ↓
Check due date
    ↓
Determine reminder period
    ↓
Check previous reminder
    ↓
Send email if required
    ↓
Save reminder attempt
```

---

# 🛡️ Duplicate Reminder Prevention

Duplicate reminders are prevented using the **ReminderAttempt** model and database records.

The important model is:

```text
ReminderAttempt.java
```

and its repository:

```text
RemainderAttemptjpa.java
```

Whenever a reminder is successfully processed, the system stores a reminder attempt associated with the invoice and reminder period.

For example:

```text
Invoice INV-1001

UPCOMING
    ↓
SENT

DUE_TODAY
    ↓
SENT

OVERDUE
    ↓
SENT
```

Before sending another reminder, the scheduler checks whether the same invoice has already received that reminder period.

Conceptually:

```text
             Eligible Invoice
                    │
                    ↓
          Determine Reminder Period
                    │
                    ↓
       Check ReminderAttempt table
                    │
             Already sent?
              /          \
            YES           NO
             │             │
             ↓             ↓
           SKIP       Send Email
                           │
                           ↓
                  Save ReminderAttempt
```

### Example

Suppose invoice `INV-1001` requires a `DUE_TODAY` reminder.

First scheduler execution:

```text
INV-1001
DUE_TODAY
     ↓
No previous record
     ↓
Send Email
     ↓
Save ReminderAttempt
```

If the scheduler executes again:

```text
INV-1001
DUE_TODAY
     ↓
Previous SENT record found
     ↓
Skip
```

This prevents the same reminder from being sent repeatedly.

---

# 🔄 Duplicate Prevention After Restart

The duplicate-prevention information is stored in **PostgreSQL**, not only in application memory.

Therefore, restarting the Spring Boot application does not reset reminder history.

Example:

```text
Before Restart

Invoice: INV-1001
Period: DUE_TODAY
Status: SENT
```

After restart:

```text
Application starts
       ↓
Scheduler executes
       ↓
Checks PostgreSQL
       ↓
DUE_TODAY already SENT
       ↓
Skip reminder
```

This allows duplicate prevention across application restarts and repeated scheduler executions.

---

# 📋 Reminder Attempt Tracking

Reminder attempts are represented by:

```text
ReminderAttempt.java
```

and returned through:

```text
ReminderAttemptdto.java
```

The system can track information such as:

```text
Invoice
Reminder Period
Status
Attempt Count
Date
```

This provides a history of reminder activity.

---

# ⚙️ Scheduler Jobs

Scheduler configuration is represented by:

```text
SchedulerJob.java
```

with:

```text
SchedulerJobs.java
SchedulerService.java
SchedulerServiceImpl.java
SchedulerController.java
```

Scheduler configuration can contain information such as:

* Job name
* Cron expression
* Enabled/disabled state
* Reminder type

The frontend provides:

```text
scheduled-jobs.html
```

for working with scheduled jobs.

---

# 📊 Job Execution Tracking

BillWise also tracks scheduler execution using:

```text
JobExecution.java
```

and:

```text
JobExecutionJpa.java
JobExecutionService.java
JobExecutionServiceImpl.java
Jobexecutionresponse.java
```

A job execution can record whether a scheduler operation resulted in:

```text
FOUND
SKIPPED
SENT
FAILED
```

This helps monitor what happened during each scheduler execution.

---

# 🧪 Testing

BillWise contains tests under:

```text
src/test/java
```

### Invoice Repository Test

```text
com.app.invoice_testing
└── InvoiceRespositoryTest.java
```

This tests invoice repository/database functionality.

### Scheduler Service Test

```text
com.app.scheduler_test
└── SchedulerServiceImplTest.java
```

This tests scheduler-related business logic, including reminder processing.

### Scheduling Test

```text
com.app.scheduling_testing
└── Scheduling_testing.java
```

This tests scheduling-related functionality.

---

# ▶️ Run Tests

Run all tests using Maven:

```bash
mvn test
```

For a complete build:

```bash
mvn clean install
```

---

# 🔄 Complete Application Flow

```text
                 Admin
                   │
                   ↓
              Login Page
                   │
                   ↓
              Dashboard
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
    Customers   Invoices   Scheduler
                   │          │
                   ↓          ↓
              PostgreSQL   Scheduler
                              │
                              ↓
                       Check Invoices
                              │
                              ↓
                     Determine Reminder
                              │
                              ↓
                    Check ReminderAttempt
                         /          \
                       YES           NO
                        │             │
                      Skip       Send Email
                                      │
                                      ↓
                             Save Attempt
                                      │
                                      ↓
                              Job Execution
```

---

# 🔒 Configuration & Security

Do not commit sensitive credentials to GitHub.

For example, avoid committing:

```properties
spring.datasource.password=YOUR_PASSWORD
spring.mail.username=YOUR_EMAIL
spring.mail.password=YOUR_PASSWORD
```

For production, use environment variables or an external configuration mechanism.

---

# 📌 Future Improvements

Possible future enhancements include:

* Multiple admin users
* Role-based access control
* Customer portal
* WhatsApp notifications
* SMS notifications
* PDF invoice generation
* Custom email templates
* Retry mechanism for failed emails
* Docker deployment
* Cloud deployment
* Dashboard analytics

---

# 👨‍💻 Author

**Harsh Sharma**

### BillWise – Invoice Reminder System

Built using:

**Java • Spring Boot • PostgreSQL • Hibernate • Flyway • JUnit • Mockito • HTML • CSS • JavaScript**
