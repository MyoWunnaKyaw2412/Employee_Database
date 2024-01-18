const db = require("../models/index");
const leavedays = require("../models/leavedays");
const Employee = db.employees;
const LeaveDays = db.leavedays;
exports.createBulk = async (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body)) {
      return res.status(400).send({
        status: 'Fail',
        message: 'Invalid or empty request body for bulk insertion',
      });
    }

    // Extract IDs from the request body
    const newIds = req.body.map((Employee_Id) => Employee_Id.id);

    // Check if any of the new IDs already exist in the database
    const existingIds = await Employee.findAll({
      where: {
        Employee_Id: newIds,
      },
      attributes: ['Employee_Id'], // Only fetch the IDs for existing records
    });

    if (existingIds.length > 0) {
      return res.status(400).send({
        status: 'Fail',
        message: 'One or more IDs already exist in the database',
        existingIds: existingIds.map((record) => record.id),
      });
    }

    // Bulk Insert
    const createdEmployees = await Employee.bulkCreate(req.body);

    res.status(201).send({
      status: 'Success',
      message: 'Bulk insertion successful',
      data: createdEmployees,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: 'Fail',
      message: 'Error occurred during bulk insertion' || error.message,
    });
  }
};
exports.create = async (req, res) => {
  console.log(req.body);

  if (!req.body.Name) {
    return res.status(404).send({
      message: "Please enter your name",
    });
  }

  const existingEmployee = await Employee.findOne({
    where: { Employee_Id: req.body.Employee_Id },
  });

  if (existingEmployee) {
    return res.status(400).send({
      status: "Fail",
      message: "Employee ID already exists",
    });
  }
  
  console.log(req.body.Name);
  console.log(req.body.NRC_Exists);
  console.log(req.body.Employee_Id);

  Employee.create({
    Employee_Id: req.body.Employee_Id,
    Name: req.body.Name,
    Father_Name: req.body.Father_Name,
    DOB: req.body.DOB,
    Gender: req.body.Gender,
    NRC_Exists: req.body.NRC_Exists,
    NRC: req.body.NRC,
  })
    .then((data) => {
      res.status(201).send({
        status: "Success",
        message: "Successfully created",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        status: "Fail",
        message: "Some error occoured while creating a user" || err.message,
      });
    });
};

exports.findAll = (req, res) => {
  const title = req.query.email;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Employee.findAll({ where: condition })
    .then((data) => {
      res.status(200).send({
        status: "Success",
        message: "Retrieved all tutorials.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.finbyPk = (req, res) => {
  const primId = req.params.id;

  Employee.findByPk(primId)
    .then((data) => {
      if (data) {
        res.status(200).send({
          status: "Success",
          data: data,
        });
      } else {
        res.status(404).send({
          status: "Fail",
          message: `Can't Find User with id ${primId}`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        status: "Fail",
        message: "Error retrieving user with id! ",
      });
    });
};

exports.update = (req, res) => {
    const id = req.params.id;
  
    console.log(req.body.Employee_Id);
    console.log(req.body.NRC_Exists);
    console.log(req.body);
    Employee.update(req.body, {
      where: { Employee_Id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Update successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Students with id=${id}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Students with id=" + id,
        });
      });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Employee.destroy({
    where: {
      Employee_Id: id,
    },
  })
    .then((Number) => {
      if ((Number = 1)) {
        res.status(200).send({
          status: "Success",
          message: "Employee was deleted Successfully",
        });
      } else {
        res.status(404).send({
          status: "Fail",
          message: `Can't delete Employee with ${id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Fail",
        messsage: err.message || `Error deleting Employee with ${id}`,
      });
    });
};

exports.deleteAll = (req,res) => {

    Employee.destroy({
        where:{},
        truncate : false,
    }).then(Number => {
        res.status(200).send({
            status: "Success",
            message: `${Number} Employee were deleted Successfully`
        })
    }).catch(err=>{
        res.status(500).send({
            status: "Fail",
            message: err.message || "Some error occoured while removing all Employee!"
        })
    })
};

//--------- on to Many--------------------------------

exports.EmployeeLeaveDays = async (req,res) => {
  const id = req.params.id;

 const eldays = await Employee.findAll({
   where: {Employee_Id : id},
   include: [{
     model : LeaveDays,
     as: 'leavedays'
   }],
   
 })
 res.status(200).send({
   message: 'Successfully recieved',
   data : eldays
 })
}

// exports.EmployeeLeaveDays = async(req,res) => {

//   const id = req.params.id;

//   const eldays = await Employee.findAll({
//     where : {Employee_Id : id},
//     include: [{
//       model : LeaveDays,
//       as : 'leavedays_tables'
//     }]
//   })
//   res.status(200).send({
//     message: "Successfully received",
//     data: eldays,
//   })
