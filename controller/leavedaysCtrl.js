const db = require("../models/index");
const LeaveDays = db.leavedays;

// exports.createBulk = async (req, res) => {
//   try {
//     if (!req.Leave_Type || !Array.isArray(req.body)) {
//       return res.status(400).send({
//         status: 'Fail',
//         message: 'Invalid or empty request body for bulk insertion',
//       });
//     }

//     // Extract IDs from the request body
//     const newIds = req.body.map((Employee_Id) => Employee_Id.id);

//     // Check if any of the new IDs already exist in the database
//     const existingIds = await Employee.findAll({
//       where: {
//         Employee_Id: newIds,
//       },
//       attributes: ['Employee_Id'], // Only fetch the IDs for existing records
//     });

//     if (existingIds.length > 0) {
//       return res.status(400).send({
//         status: 'Fail',
//         message: 'One or more IDs already exist in the database',
//         existingIds: existingIds.map((record) => record.id),
//       });
//     }

//     // Bulk Insert
//     const createdEmployees = await Employee.bulkCreate(req.body);

//     res.status(201).send({
//       status: 'Success',
//       message: 'Bulk insertion successful',
//       data: createdEmployees,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(400).send({
//       status: 'Fail',
//       message: 'Error occurred during bulk insertion' || error.message,
//     });
//   }
// };

exports.createLeavedays = async (req, res) => {
  console.log(req.body);

  if (!req.body.Number_of_Leave_Days) {
    return res.status(404).send({
      message: "Please enter Number_of_Leave_Days",
    });
  }
  console.log(req.body.Leave_Type);

  LeaveDays.create({
    Employee_Id: req.body.Employee_Id,
    Leave_Type: req.body.Leave_Type,
    Number_of_Leave_Days: req.body.Number_of_Leave_Days,
    Opening_Leave_Days: req.body.Opening_Leave_Days,
    Brought_Forward: req.body.Brought_Forward,
    Taken_Leave_Days: req.body.Taken_Leave_Days,
    Remaining_Leave_Days: req.body.Remaining_Leave_Days,
    Leave_Year: req.body.Leave_Year,
    Carry_Forward: req.body.Carry_Forward,
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
        message: "Some error occoured while creating leave days list" && err.message,
      });
    });
};

// exports.createLeavedays = async (req, res) => {
//   console.log(req.body);

//   try {
//     // Check if the employee with the given Employee_Id exists
//     const existingEmployee = await db.employees.findByPk(req.body.Employee_Id);

//     if (!existingEmployee) {
//       return res.status(404).send({
//         message: "Employee not found with the specified Employee_Id",
//       });
//     }

//     if (!req.body.Number_of_Leave_Days) {
//       return res.status(400).send({
//         status: "Fail",
//         message: "Please enter Number_of_Leave_Days",
//       });
//     }

//     const createdLeaveDays = await db.leavedays.create({
//       Employee_Id: req.body.Employee_Id,
//       Leave_Type: req.body.Leave_Type,
//       Number_of_Leave_Days: req.body.Number_of_Leave_Days,
//       Opening_Leave_Days: req.body.Opening_Leave_Days,
//       Brought_Forward: req.body.Brought_Forward,
//       Taken_Leave_Days: req.body.Taken_Leave_Days,
//       Remaining_Leave_Days: req.body.Remaining_Leave_Days,
//       Leave_Year: req.body.Leave_Year,
//       Carry_Forward: req.body.Carry_Forward,
//     });

//     res.status(201).send({
//       status: "Success",
//       message: "Successfully created",
//       data: createdLeaveDays,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       status: "Fail",
//       message: "Some error occurred while creating leave days list",
//       error: err.message,
//     });
//   }
// };

exports.findAll = (req, res) => {
  const title = req.query.id;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  LeaveDays.findAll({ where: condition })
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

  LeaveDays.findByPk(primId)
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
      message: `Error retrieving user with id:${primId}` ,
      });
    });
};

exports.update = (req, res) => {
    const id = req.params.id;
  
    console.log(req.body.Leave_Type);
    console.log(req.body.Number_of_Leave_Days);
    console.log(req.body);
    LeaveDays.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Update successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Employee's Leave days with id=${id}.`,
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

  LeaveDays.destroy({
    where: {
      id: id,
    },
  })
    .then((Number) => {
      if ((Number = 1)) {
        res.status(200).send({
          status: "Success",
          message: "Leave day was deleted Successfully",
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
        messsage: err.message || `Error deleting Employee's leave day with ${id}`,
      });
    });
};


// exports.deleteAll = (req,res) => {

//     Employee.destroy({
//         where:{},
//         truncate : false,
//     }).then(Number => {
//         res.status(200).send({
//             status: "Success",
//             message: `${Number} Employee were deleted Successfully`
//         })
//     }).catch(err=>{
//         res.status(500).send({
//             status: "Fail",
//             message: err.message || "Some error occoured while removing all Employee!"
//         })
//     })
// }