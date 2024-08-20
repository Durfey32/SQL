INSERT INTO departments (name) 
VALUES ('HR', 'Accounting', 'Customer Service', 'Legal"', 'IT');

INSERT INTO roles (title, salary, department_id)
VALUES ('HR Manager', 100000, 1),
       ('HR Assistant', 50000, 1),
       ('Accountant', 60000, 2),
       ('Customer Service Rep', 40000, 3),
       ('Legal Assistant', 50000, 4),
       ('Lawyer', 100000, 4),
       ('IT Manager', 80000, 5),
       ('IT Specialist', 60000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Mike', 'Jones', 3, 2),
       ('Sarah', 'Miller', 4, 3),
       ('Chris', 'Brown', 5, 4),
       ('Jessica', 'Davis', 6, 5),
       ('David', 'Moore', 7, 6),
       ('Ashley', 'Taylor', 8, 7);