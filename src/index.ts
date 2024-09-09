import inquirer from 'inquirer';
import { pool, connectPool } from './connection.js';

await connectPool();

async function mainMenu() {
    const fillIn = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all employees',
            'View all roles',
            'Add a department',
            'Add an employee',
            'Add a role',
            'Update an employee role',
            'Delete a department',
            'Delete a employee',
            'Delete a role',
            'Exit'
        ],
    });

    switch (fillIn.action) {
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all employees':
            viewEmployees();
            break;    
        case 'View all roles':
            viewRoles();
            break;
        case 'Add a department':
            addDepartment();
            break;
       case 'Add an employee':
            addEmployee();
            break; 
        case 'Add a role':
            addRole();
            break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
        case 'Delete a department':
            deleteDepartment();
            break;
        case 'Delete a employee':
            deleteEmployee();
            break;
        case 'Delete a role':
            deleteRole();
            break;    
        case 'Exit':
            process.exit(0);
    }
};


const viewDepartments = async ():Promise<void> => {
    const sql = `SELECT * FROM department`;
    const res = await pool.query(sql);
    console.table(res.rows);
    mainMenu();
}

const viewRoles = async ():Promise<void> => {
    const sql = `SELECT role.id, role.title, role.salary, department.name AS department
                FROM role
                JOIN department ON role.department_id = department.id`;
    const res = await pool.query(sql);
    console.table(res.rows);
    mainMenu();
   
}

const viewEmployees = async ():Promise<void> => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role. salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    const res = await pool.query(sql);
    console.table(res.rows);
    mainMenu();
}

const addDepartment = async ():Promise<void> => {
    const department = [{name: 'departmentName', 
                        type: 'input', 
                        message: 'Enter the name of the department'}];
    const fillIn = await inquirer.prompt(department);

    const sql = `INSERT INTO department (name) VALUES ($1)`;
    await pool.query(sql, [fillIn.departmentName]);

    console.log(`Added ${fillIn.departmentName} to the database`);

    mainMenu();
}


const addEmployee = async ():Promise<void> => {
    const {rows: roles} = await pool.query('SELECT id, title FROM role');
    const {rows: mangagers} = await pool.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL');
    const roleChoices = roles.map(role => ({name: role.title, value: role.id}));
    const managerChoices = mangagers.map(manager => ({name: `${manager.first_name} ${manager.last_name}`, value: manager.id}));
    const employee = [
        {name: 'employeeFirstName', type: 'input', message: `Enter the employee's first name`},
        {name: 'employeeLastName', type: 'input', message: `Enter the employee's last name`},
        {name: 'employeeRole', type: 'list', message: `Select the employee's role`, choices: roleChoices},
        {name: 'employeeManager', type: 'list', message: `Select the employee's manager`, choices: managerChoices}];
    const fillIn = await inquirer.prompt(employee);
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
    await pool.query(sql, [fillIn.employeeFirstName, fillIn.employeeLastName, fillIn.employeeRole, fillIn.employeeManager]);
    console.log(`Added ${fillIn.employeeFirstName} ${fillIn.employeeLastName} to the database`);
    mainMenu();
}

const addRole = async ():Promise<void> => {
    const { rows } = await pool.query('SELECT id, name FROM department');
    const departmentChoices = rows.map(department => ({name: department.name, value: department.id}));
    const role = [
        {name: 'roleTitle', type: 'input', message: 'Enter the title of the role'},
        {name: 'roleSalary', type: 'input', message: 'Enter the salary of the role'},
        {name: 'roleDepartment', type: 'list', message: 'Select the department for the role', choices: departmentChoices}];
    const fillIn = await inquirer.prompt(role);
    const sql = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`;
    await pool.query(sql, [fillIn.roleTitle, fillIn.roleSalary, fillIn.roleDepartment]);
    console.log(`Added ${fillIn.roleTitle} to the database`);
    mainMenu();
}

const updateEmployeeRole = async ():Promise<void> => {
    const {rows: employees} = await pool.query('SELECT id, first_name, last_name FROM employee');
    const {rows: roles} = await pool.query('SELECT id, title FROM role');

    const employeeChoices = employees.map(employee => ({name: `${employee.first_name} ${employee.last_name}`, value: employee.id}));
    const roleChoices = roles.map(role => ({name: role.title, value: role.id}));

    const updateRole = [
        {name: 'employeeName', type: 'list', message: 'Select the employee to update', choices: employeeChoices},
        {name: 'roleName', type: 'list', message: 'Select the new role', choices: roleChoices}];

    const fillIn = await inquirer.prompt(updateRole);

    const selectedEmployee = employees.find(employee => employee.value === fillIn.employee)?.name;

    const sql = `UPDATE employee SET role_id = $2 WHERE id = $1`;
    await pool.query(sql, [fillIn.role, fillIn.employee]);
    console.log(`Updated ${selectedEmployee}'s role`);
    mainMenu();
}

const deleteDepartment = async ():Promise<void> => {
    const {rows: departments} = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.map(department => ({name: department.name, value: department.id}));

    const deleteDepartmentPrompt = [{name: 'departmentName', type: 'list', message: 'Select the department to delete', choices: departmentChoices}];
    const fillIn = await inquirer.prompt(deleteDepartmentPrompt);

    const deletedDepartment = departments.find(department => department.id === fillIn.departmentName);
    const sql = `DELETE FROM department WHERE id = $1`;
    await pool.query(sql, [fillIn.departmentName]);
    console.log(`Deleted ${deletedDepartment}`);
    mainMenu();
}

const deleteEmployee = async ():Promise<void> => {
    const {rows: employees} = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.map(employee => ({name: `${employee.first_name} ${employee.last_name}`, value: employee.id}));

    const deleteEmployee = [{name: 'employeeName', type: 'list', message: 'Select the employee to delete', choices: employeeChoices}];
    const fillIn = await inquirer.prompt(deleteEmployee);

    const deletedEmployee = employees.find(employee => employee.id === fillIn.employeeName);

    const sql = `DELETE FROM employee WHERE id = $1`;
    await pool.query(sql, [fillIn.employeeName]);
    console.log(`Deleted ${deletedEmployee}`);
    mainMenu();
}

const deleteRole = async ():Promise<void> => {
    const {rows: roles} = await pool.query('SELECT id, title FROM role');
    const roleChoices = roles.map(role => ({name: role.title, value: role.id}));

    const deleteRole = [{name: 'roleName', type: 'list', message: 'Select the role to delete', choices: roleChoices}];
    const fillIn = await inquirer.prompt(deleteRole);

    const deletedRole = roles.find(role => role.id === fillIn.roleName);
    
    const sql = `DELETE FROM role WHERE id = $1`;
    await pool.query(sql, [fillIn.roleName]);
    console.log(`Deleted ${deletedRole}`);
    mainMenu();
}

mainMenu();