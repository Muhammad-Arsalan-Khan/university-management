import StaffAttendance from "../../models/seniorDataEntryOprator/attendance.js" 
import Department from "../../models/seniorDataEntryOprator/departmentSchema.js"
import Payroll from "../../models/seniorDataEntryOprator/payroll.js"
import Teacher from "../../models/seniorDataEntryOprator/teacherSchema.js"
import Staff from "../../models/seniorDataEntryOprator/staffSchema.js"

//depart
async function createDepart(req, res) {
  try {
    const { departmentName, departmentHeadId, officeLocation, phone } = req.body;
    const existing = await Department.findOne({ departmentName });
    if (existing) {
      return res.status(400).json({ message: "Department already exists!" });
    }
    const newDepartment = new Department({
      departmentName,
      departmentHeadId,
      officeLocation,
      phone,
    });
    await newDepartment.save();
    res.status(201).json({
      message: "Department created successfully!",
      data: newDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function modifyDepart(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDepartment = await Department.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function deleteDepart(req, res) {
  try {
    const { id } = req.params;
    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({
      message: "Department deleted successfully",
      data: deletedDepartment,
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
async function getDepart(req, res) {
  try {
    const departments = await Department.find()
      .populate("departmentHeadId", "name email phone") // show only selected fields
      .sort({ departmentName: 1 }); // Sort A–Z by department name
    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }
    res.status(200).json({
      message: "All departments fetched successfully",
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

//staff
async function createStaff(req, res) {
  try {
    const {userId, fullName, gender,email,phone,hireDate,designation,departmentId,salary} = req.body;
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Staff with this email already exists" });
    }
    const newStaff = new Staff({userId,fullName,gender,email,phone,hireDate,designation,departmentId, salary});
    await newStaff.save();
    res.status(201).json({
      message: "Staff member created successfully",
      data: newStaff,
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
async function getStaff(req, res) {
  try {
    const staffMembers = await Staff.find()
      .populate("departmentId", "departmentName officeLocation phone") // show department info
      .sort({ fullName: 1 }); // sort alphabetically

    if (!staffMembers || staffMembers.length === 0) {
      return res.status(404).json({ message: "No staff members found" });
    }
    res.status(200).json({
      message: "All staff members fetched successfully",
      count: staffMembers.length,
      data: staffMembers,
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function modifyStaff(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.departmentId) {
      const department = await Department.findById(updates.departmentId);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
    }
    const updatedStaff = await Staff.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("departmentId", "departmentName officeLocation");

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json({
      message: "Staff member updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
async function deleteStaff(req, res) {
  try {
    const { id } = req.params;
    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json({
      message: "Staff member deleted successfully",
      data: deletedStaff,
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}


//  Teacher

async function createTeacher(req, res) {
  try {
    const {staffId,experienceYear,qulification,specialization,universityName,passingYear} = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    const existing = await Teacher.findOne({ staffId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Teacher already exists for this staff member" });
    }
    const newTeacher = new Teacher({
      staffId,
      experienceYear,
      qulification,
      specialization,
      universityName,
      passingYear,
    });
    await newTeacher.save();
    res.status(201).json({
      message: "Teacher created successfully",
      data: newTeacher,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function getTeacher(req, res) {
  try {
    const teachers = await Teacher.find()
      .populate("staffId", "fullName email designation departmentId") // populate staff details
      .populate({
        path: "staffId",
        populate: {
          path: "departmentId",
          select: "departmentName",
        },
      })
      .sort({ "staffId.fullName": 1 });
    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }
    res.status(200).json({
      message: "All teachers fetched successfully",
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function modifyTeacher(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.staffId) {
      const staff = await Staff.findById(updates.staffId);
      if (!staff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("staffId", "fullName email designation departmentId")
      .populate({
        path: "staffId",
        populate: {
          path: "departmentId",
          select: "departmentName",
        },
      });
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
      message: "Teacher updated successfully",
      data: updatedTeacher,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
async function deleteTeacher(req, res) {
  try {
    const { id } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
      message: "Teacher deleted successfully",
      data: deletedTeacher,
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}


//Attendance
async function Attendance(req, res) {
  try {
    const { staffId, status } = req.body;
    const staff = await Staff.findById(staffId);
    // if (!staff) {
    //   return res.status(404).json({ message: "Staff member not found" });
    // }
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const existingAttendance = await StaffAttendance.findOne({
      staffId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already marked for this staff today",
      });
    }
    const newAttendance = new StaffAttendance({
      staffId,
      status,
    });

    await newAttendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      data: newAttendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function modifyAttendance(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["present", "absent", "late", "excused"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    const updatedAttendance = await StaffAttendance.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("staffId", "fullName email designation");

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
async function getAllAttendance(req, res) {
  try {
    const records = await StaffAttendance.find()
      .populate("staffId", "fullName email designation")
      .sort({ date: -1 });
    if (!records.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }
    res.status(200).json({
      message: "All attendance records fetched successfully",
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}


const autoMarkStaffAttendance = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const allStaff = await Staff.find({}, "_id");
    const allStaffIds = allStaff.map((s) => s._id.toString());
    const todayAttendance = await StaffAttendance.find({
      attendanceDate: { $gte: startOfDay, $lte: endOfDay },
    }).select("staffId");
    const alreadyMarkedIds = todayAttendance.map((a) =>
      a.staffId.toString()
    );
    const missingStaff = allStaffIds.filter(
      (id) => !alreadyMarkedIds.includes(id)
    );
    if (missingStaff.length === 0) {
      return res.status(200).json({
        message: "All staff already have attendance for today",
      });
    }
    const attendanceRecords = missingStaff.map((staffId) => ({
      staffId,
      status: "absent",
      attendanceDate: new Date(),
    }));
    await StaffAttendance.insertMany(attendanceRecords);
    res.status(201).json({
      message: "Attendance auto-marked as absent for remaining staff",
      totalMarked: attendanceRecords.length,
    });
  } catch (err) {
    next(err);
  }
};



export {
  getStaff,
  createStaff,
  modifyStaff,
  deleteStaff,
  getDepart,
  createDepart,
  modifyDepart,
  deleteDepart,
  getTeacher,
  createTeacher,
  modifyTeacher,
  deleteTeacher,
  Attendance,
  modifyAttendance,
  getAllAttendance,
  autoMarkStaffAttendance
}