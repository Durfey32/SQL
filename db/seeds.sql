INSERT INTO departments (name) 
VALUES ('HR'), ('Accounting'), ('Customer Service'), ('Legal'), ('IT'), ('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES ('HR Manager', 100000, 1),
       ('HR Assistant', 50000, 1),
       ('Accountant', 60000, 2),
       ('Customer Service Rep', 40000, 3),
       ('Legal Assistant', 50000, 4),
       ('Lawyer', 100000, 4),
       ('IT Manager', 80000, 5),
       ('IT Specialist', 60000, 5);
       ('Sales Manager', 90000, 6),
       ('Sales Associate', 50000, 6);
       ('CEO', 200000, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 11),
       ('Jane', 'Smith', 2, 1),
       ('Mike', 'Jones', 3, 11),
       ('Sarah', 'Miller', 4, 1),
       ('Chris', 'Brown', 5, 6),
       ('Jessica', 'Davis', 6, 11),
       ('David', 'Moore', 7, 11),
       ('Ashley', 'Taylor', 8, 7);
       ('Robert', 'Wilson', 9, 11),
       ('Emily', 'Johnson', 10, 9);
       ('James', 'White', 10, 9);
       ('Jill', 'Green', 11, NULL);
