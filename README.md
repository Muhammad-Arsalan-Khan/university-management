# University Management System (UMS)

### **Supervised By:**

### **Sir *Anwar Ali***

### **Group Member:**
### **Muhammmad Arsalan khan (me)***
### **Siraj ismail***
### **Shayan Shakil***

A fully professional **University Management System** designed to digitalize and streamline all major university operations. The system provides **role-based dashboards**, **secure authentication**, and **centralized MySQL database** with complete automation of academic and administrative workflows.

Developed using:

* **React.js (Frontend)**
* **Node.js + Express (Backend)**
* **MySQL (Database)**
* **Cloudinary (File Storage)**
* **JWT + Cookies (Authentication)**

The system is built with a clean folder structure, reusable components, and modular MVC backend.

---

# 🚀 Key Highlights

* Multiple dashboards for different university roles
* Highly secure login system (JWT + Hashed Passwords)
* Role-based access (HOD, Teacher, Students, Operators, Librarian, Lab Incharge)
* Auto attendance modules
* Assignment, Fee, Library & Enrollment automation
* Cloud-based file upload (assignment files, vouchers)
* Clean and scalable backend architecture

---

# 🧭 Role-Based Dashboards

Below is the complete professional description of each dashboard, written for direct submission.

---

## 🏛️ **HOD (Head of Department) Dashboard**

The HOD dashboard provides full departmental control.

### **HOD Can:**

* View department statistics (teachers, students, courses, programs)
* Manage academic structure: programs, semesters, course assignments
* Create **Senior Data Entry Operators**
* Monitor departmental performance
* Review staff history and activity

---

## 👨‍💼 **Senior Data Entry Operator Dashboard**

Senior Operator manages **all staff-related operations**.

### **Senior Operator Can:**

* Add, update, delete university staff
* Assign roles (Junior Operator, Librarian, Lab Incharge, Teacher, etc.)
* Manage staff attendance
* Create and manage Junior Data Entry Operators

---

## 👨‍💻 **Junior Data Entry Operator Dashboard**

Designed for academic data operations.

### **Junior Operator Can:**

* Add, update, delete student records
* Manage enrollment and sections
* View student profiles
* Cannot edit marks or academic assessments

---

## 📚 **Librarian Dashboard**

A complete library automation system.

### **Librarian Can:**

* Add, update, delete books
* Check book quantity and availability
* View full borrowing/return history
* Issue and return books using Student ID
* Track fines and overdue books

---

## 🧪 **Lab Incharge Dashboard**

A smart entry/exit tracking system.

### **Lab Incharge Can:**

* Enter User ID to mark **lab entry** with exact timestamp
* Enter User ID again to mark **lab exit** automatically
* View daily, weekly, and monthly lab usage logs
* Track which student/teacher visited the lab and when

---

## 🧑‍🏫 **Teacher Dashboard**

A complete academic management panel.

### **Teacher Can:**

* View personal profile
* View assigned courses & programs
* Upload assignments/quizzes with file support
* Assign assessments to specific programs/semesters
* Add student grades
* Track which students are enrolled in their courses

---

## 🎓 **Student Dashboard**

A simple and clean dashboard for student needs.

### **Student Can:**

* View enrolled courses and instructors
* Download assignments/quizzes
* Upload fee voucher image
* Check fee approval status (Pending / Approved / Rejected)
* View semester history (GPA, course list, teachers)
* Track all previous assessments

---

# 🗄️ Database Overview (MySQL)

A well-structured relational database including:

* Students
* Teachers
* Staff
* Program & Semester
* Enrollment
* Fee Structure & Student Fee
* Assignments & Grades
* Books & Borrow Records
* Lab Attendance

---

# 📦 Architecture

### **Frontend Folder Structure**

* `/components` — Reusable UI Components
* `/pages` — Dashboard Pages
* `/routes` — Protected & Public Routing
* `/services` — API Handling
* `/context` — Auth Context / Global State

### **Backend Structure (MVC)**

* `/models` — MySQL Models
* `/controller` — Business Logic
* `/routes` — API Endpoints
* `/middleware` — Auth, Errors, Multer
* `/services` — Cloudinary, Helpers

---

# 🏁 Conclusion

This University Management System (UMS) provides a complete, role-based, secure, and scalable platform to digitalize academic and administrative workflows. Under the supervision of **Sir Anwar Ali**, this system ensures modern, automated, and professional-level university operations.

---
## ⚙️ Installation & Usage

1. **Clone or Download** this repository.  
   ```bash
      https://github.com/Muhammad-Arsalan-Khan/university-management.git
