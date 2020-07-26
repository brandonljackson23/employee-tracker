const inquirer = require('inquirer');
const consoleTable = require('console.table');
const connection = require('./db/database');

// Display all deparments
const allDepartments = () => {
  const departmentsList = [];
  connection.promise().query('SELECT * FROM departments;', function (err, res) {
    if (err) { throw err }
    for (var i = 0; i < res.length; i++) {
      departmentsList.push(res[i].name);
    }
  })
  return departmentsList;
};

// Display all roles
const allRoles = () => {
  const rolesList = [];
  connection.promise().query(`SELECT * FROM roles;`, function (err, res) {
    if (err) { throw err }
    for (var i = 0; i < res.length; i++) {
      rolesList.push(res[i].title);
    }
  })
  return rolesList;
};

// Display all managers
function allEmployees() {
  const managersList = [];
  connection.promise().query(`SELECT * FROM employees;`, function (err, res) {
    if (err) { throw err }
    for (var i = 0; i < res.length; i++) {
      let name = (res[i].first_name).concat(' ').concat(res[i].last_name)
      managersList.push(name);
    }
  })
  return managersList;
};

// Display main menu
const mainMenu = () => {
  inquirer.prompt(
    {
      type: "list",
      name: "main_menu",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "Add an employee",
        "Update an employee's role",
        "View all roles",
        "Add a role",
        "View all departments",
        "Add a department",
        "Exit"
      ]
    }
  )
    .then(response => {
      if (response.main_menu === "View all employees") {
        return viewEmployees()
      } else if (response.main_menu === "Add an employee") {
        return createEmployee();
      } else if (response.main_menu === "Update an employee's role") {
        return updateEmployee();
      } else if (response.main_menu === "View all roles") {
        return viewRoles();
      } else if (response.main_menu === "Add a role") {
        return createRole();
      } else if (response.main_menu === "View all departments") {
        return viewDepartments();
      } else if (response.main_menu === "Add a department") {
        return createDepartment();
      } else if (response.main_menu === "Exit") {
        return exitMenu();
      }
    })
};

const viewEmployees = () => {
  connection.promise().query(`
      SELECT employees.id AS ID,
      CONCAT(employees.first_name, ' ', employees.last_name) AS Name,
      roles.title AS Role,
      roles.salary AS Salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS Manager,
      departments.name AS Department
      FROM employees 
      LEFT JOIN roles ON employees.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees manager ON employees.manager_id = manager.id;`
  )
    .then(([results]) => {
      console.table(results);
      return mainMenu();
    })
};

// Create an employee
const createEmployee = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
      validate: first_name => {
        if (first_name) {
          return true;
        } else {
          console.log('Please enter a first name.');
          return false;
        }
      }
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the new employee's last name?",
      validate: last_name => {
        if (last_name) {
          return true;
        } else {
          console.log('Please enter a last name.');
          return false;
        }
      }
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's title?",
      choices: allRoles()
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: allEmployees()
    }
  ])
    .then(response => {
      const employeeFirstName = response.first_name;
      const employeeLastName = response.last_name;
      const employeeRole = response.role;
      const employeeManager = response.manager;
      var roleId = '';
      var managerId = '';

      connection.promise().query(`SELECT * FROM roles;`, function (err, res) {
        if (err) { throw err };
        for (var i = 0; i < res.length; i++) {
          if (employeeRole === res[i].title) {
            roleId = (res[i].id);
          }
        }
      })
      connection.promise().query(`SELECT * FROM employees;`, function (err, result) {
        if (err) { throw err };
        for (var i = 0; i < result.length; i++) {
          let resManager = (result[i].first_name).concat(' ').concat(result[i].last_name)
          if (employeeManager === resManager) {
            managerId = (result[i].id);
          }
        }
        let post = {
          first_name: employeeFirstName,
          last_name: employeeLastName,
          role_id: roleId,
          manager_id: managerId
        }
        connection.query(`INSERT INTO employees SET ?`, post);
        console.log(`
                
`+ post.first_name + " " + post.last_name + ` was added.

                `
        );
        return mainMenu();
      })
    })
};

// Update employee's role
const updateEmployee = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "What is the employee's title?",
      choices: allRoles()
    }
  ])
    .then(response => {
      if (response.role === "Role") {
        let targetEmployee = response.updateEmployeeID;
        let newRole = response.updateEmployeeRole;
        var roleID = '';
        connection.promise().query(`SELECT * FROM roles;`, function (err, res) {
          if (err) { throw err };
          for (var i = 0; i < res.length; i++) {
            if (newRole === res[i].title) {
              roleID = (res[i].id);
            }
          }
          connection.query(`UPDATE employees SET employees.role_id = ? WHERE CONCAT(employees.first_name, ' ', employees.last_name) = ?;`, [roleID, targetEmployee]);
          console.log("You updated " + targetEmployee + "'s role to " + newRole);
          return mainMenu();
        })
      }
    })
};

const viewRoles = () => {
  connection.promise().query(`
        SELECT roles.id AS ID,
        roles.title AS Role ,
        roles.salary AS Salary,
        departments.name AS Department
        FROM roles 
        LEFT JOIN departments ON roles.department_id = departments.id
        ORDER BY id;`
  )
    .then(([results]) => {
      console.table(results);
      return mainMenu();
    })
};

// Create a role
const createRole = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the role's title?",
      validate: title => {
        if (title) {
          return true;
        } else {
          console.log('Please enter a title.');
          return false;
        }
      }
    },
    {
      type: "input",
      name: "salary",
      message: "What is the role's salary?",
      validate: salary => {
        if (salary) {
          return true;
        } else {
          console.log('Please enter a salary.');
          return false;
        }
      }
    },
    {
      type: "list",
      name: "department",
      message: "To which department does this role belong?",
      choices: allDepartments()
    }
  ])
    .then(response => {
      const roleTitle = response.title;
      const roleSalary = response.salary;
      const roleDepartment = response.department;

      var departmentId = '';
      connection.promise().query(`SELECT * FROM departments;`, function (err, res) {
        if (err) { throw err };
        for (var i = 0; i < res.length; i++) {
          if (roleDepartment === res[i].name) {
            departmentId = (res[i].id);
          }
        }
        let post = {
          title: roleTitle,
          salary: roleSalary,
          department_id: departmentId
        };
        connection.query(`INSERT INTO roles SET ?`, post);
        console.log(post.title + " was added.");
        return mainMenu();
      })
    })
};

const viewDepartments = () => {
  connection.promise().query(`
      SELECT id AS ID,
      name AS Department 
      FROM departments 
      ORDER BY id;`
  )
    .then(([results]) => {
      console.table(results);
      return mainMenu();
    })
};

// Create a department
const createDepartment = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the department's name?",
      validate: name => {
        if (name) {
          return true;
        } else {
          console.log('Please enter a department name.');
          return false;
        }
      }
    }
  ])
    .then(response => {
      let post = { name: response.name };
      connection.query(`INSERT INTO departments SET ?`, post);
      console.log(post.name + " was added.");
      return mainMenu();
    })
};

// Exits command line app
const exitMenu = () => {
  console.log(
    `
 _________________________________________________
|                                                 |
|                                                 |
|     ____                 _ _                    |
|    |  __| ____  ____  __| | |___ _   _  ___     |
|    | |__ / _  |/ _  |/ _  |  _  | | | |/ _ |    |
|    | |_ | (_) | (_) | (_| | |_) | |_| |  __/    |
|    |____|____/|____/|___,_|_,__/|___, |____|    |
|                                  |____/         |
|                                                 |
|_________________________________________________|

`);
  process.exit();
};

console.log(
  `
 _______________________________________________________
|                                                       |
|                                                       |
|     _____                 _                           |
|    | ____|_ __ ____ _ ___| | ___  _   _  ___  ___     |
|    |  _| | '_ ' _  | '_  | |/ _  | | | |/ _ |/ _ |    |
|    | |___| | | | | | |_) | | (_) | |_| |  __/  __/    |
|    |_____|_| |_| |_| ,__/|_|____/|___, |____|____|    |
|                    |_|           |_____/              |
|        __  __                                         |
|       |   /  | __ _ _ ___  __ _  __ _  ___ _ __       |
|       | | /| |/ _' | '_  |/ _' |/ _' |/ _ | '__|      |
|       | |  | | (_) | | | | (_) | (_) |  __/ |         |
|       |_|  |_|___,_|_| |_|___,_|___, |____|_|         |
|                                 |____/                |
|                                                       |
|_______________________________________________________|

`
);

mainMenu();