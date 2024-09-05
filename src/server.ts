const pool = require('./connection');

const viewDepartments = async () => {
    try {
        const res = await pool.query('SELECT * FROM department');
        console.table(res.rows);
        mainMenu();
    } catch (err) {
        console.log(err);
    }
};

const viewRoles = async () => {
    try {
        const res = await pool.query('SELECT * FROM role');
        console.table(res.rows);
        mainMenu();
    } catch (err) {
        console.log(err);
    }
}

const viewEmployees = async () => {
    try {
        const res = await pool.query('SELECT * FROM employee');
        console.table(res.rows);
        mainMenu();
    } catch (err) {
        console.log(err);
    }
}

const addDepartment = async () => {
    const { name } = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'What is the name of the department?',
    });

    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
        console.log(`Added department: ${name}`);
        mainMenu();
    } catch (err) {
        console.log(err);
    }
}

const addRole = async () => {
    const { title, salary, department_id } = await inquirer.prompt([
        {
            name: 'title',
            message: 'What is the title of the role?',
        },
        {
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            name: 'department_id',
            message: 'What is the department ID of the role?',
        }
    ]);

    try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
        console.log('Role added successfully');
        mainMenu();
    } catch (err) {
        console.log(err);
    }
}

