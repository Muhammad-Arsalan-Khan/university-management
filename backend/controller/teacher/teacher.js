import Assessment from "../../models/teacher/assigment.js"
import Attendance from "../../models/teacher/attendance.js"
import StudentGrade from "../../models/teacher/grade.js"
import fileUploader from "../../services/fileUplode/fileUplode.js";
import Enrollment from "../../models/JuniorDataEntryOperator/enrollment.js"

const createAssessment = async (req, res, next) => {
    console.log("hi")
  try {
    let fileURL = null;
    if (req.file) {
      const response = await fileUploader(req.file.buffer);
      fileURL = response.secure_url;
    }

    const newAssessment = new Assessment({
      ...req.body,
      fileURL,
    });
    await newAssessment.save();
    res.status(201).json({
      message: "Assessment created successfully",
      data: newAssessment,
    });
  } catch (err) {
    next(err);
  }
};

const getAssessments = async (req, res, next) => {
  try {
    const data = await Assessment.find()
      .populate("semesterId", "semesterNumber")
      .populate("programId", "programName");
      if (!data.length) {
      return res.status(404).json({ message: "No record Assessment found" });
    }
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const getAssessmentBySemesterAndProgram = async (req, res, next) => {
  try {
    const { semesterId, programId } = req.params;
    const data = await Assessment.find({ semesterId, programId })
      .populate("semesterId", "semesterNumber")
      .populate("programId", "programName");

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No assessments found for this semester and program" });
    }
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};


const deleteAssessment = async (req, res, next) => {
  try {
    const deleted = await Assessment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Assessment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const createAttendance = async (req, res, next) => {
  try {
    const newAttendance = new Attendance(req.body);
    await newAttendance.save();
    res.status(201).json({ message: "Attendance created successfully", data: newAttendance });
  } catch (err) {
    next(err);
  }
};

const getAttendance = async (req, res, next) => {
  try {
    const data = await Attendance.find()
      .populate("enrollmentId", "studentId courseId");
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Attendance not found" });
    res.status(200).json({ message: "Attendance updated successfully", data: updated });
  } catch (err) {
    next(err);
  }
};

const autoMarkAttendance = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const allEnrollments = await Enrollment.find({}, "_id");
    const allEnrollmentIds = allEnrollments.map((e) => e._id.toString());
    const todayAttendance = await Attendance.find({
      attendanceDate: { $gte: startOfDay, $lte: endOfDay },
    }).select("enrollmentId");
    const alreadyMarkedIds = todayAttendance.map((a) =>
      a.enrollmentId.toString()
    );
    const missingEnrollments = allEnrollmentIds.filter(
      (id) => !alreadyMarkedIds.includes(id)
    );
    if (missingEnrollments.length === 0) {
      return res.status(200).json({
        message: "All enrollments already have attendance for today ✅",
      });
    }
    const attendanceRecords = missingEnrollments.map((enrollmentId) => ({
      enrollmentId,
      status: "absent",
      attendanceDate: new Date(),
    }));
    await Attendance.insertMany(attendanceRecords);
    res.status(201).json({
      message: "Attendance auto-marked as absent for remaining enrollments",
      totalMarked: attendanceRecords.length,
    });
  } catch (err) {
    next(err);
  }
};


const createStudentGrade = async (req, res, next) => {
  try {
    const grade = new StudentGrade(req.body);
    await grade.save();
    res.status(201).json({
      message: "Student grade created successfully",
      data: grade,
    });
  } catch (err) {
    next(err);
  }
};

const getStudentGrades = async (req, res, next) => {
  try {
    const grades = await StudentGrade.find().populate("studentId", "name email");
    res.status(200).json(grades);
  } catch (err) {
    next(err);
  }
};

const getStudentGradeById  = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grades = await StudentGrade.find({ studentId : id})
      .populate("studentId", "fullname email");

    if (!grades || grades.length === 0) {
      return res.status(404).json({ message: "No grades found for this student" });
    }
    res.status(200).json(grades);
  } catch (err) {
    next(err);
  }
};

const updateStudentGrade = async (req, res, next) => {
  try {
    const updated = await StudentGrade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Grade not found" });
    res.status(200).json({
      message: "Student grade updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudentGrade = async (req, res, next) => {
  try {
    const deleted = await StudentGrade.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Grade not found" });
    res.status(200).json({ message: "Student grade deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // validate ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: 'Invalid id format' });
    // }
    // build query: match attendance _id OR enrollmentId OR nested enrollmentId.studentId
    const query = {
      $or: [
        { _id: id },                       // attendance doc id
        { enrollmentId: id },              // enrollment id stored directly
        { 'enrollmentId.studentId': id }   // nested studentId inside enrollmentId
      ]
    };

    const attendances = await Attendance.find(query)
      .populate({
        path: 'enrollmentId',
        // if enrollmentId itself is a subdocument (not ref), remove populate
        populate: { path: 'studentId', select: 'name email _id' } // nested populate (student)
      })
      .lean();
    if (!attendances || attendances.length === 0) {
      return res.status(200).json({ message: 'No attendance found' });
    }
    return res.json({ count: attendances.length, data: attendances });
  } catch (err) {
    console.error('findByAnyId error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  // try {
  //   const data = await Attendance.findById(req.params.id)
  //     .populate("enrollmentId", "studentId courseId");
  //   // if (!data) return res.status(404).json({ message: "Attendance not found" });
  //   res.status(200).json(data);
  // } catch (err) {
  //   next(err);
  }
};


export {
    deleteAssessment,
    getAssessments,
    createAssessment,
    getAssessmentBySemesterAndProgram,

    updateAttendance,
    createAttendance,
    getAttendance,
    autoMarkAttendance,

  createStudentGrade,
  getStudentGrades,
  getStudentGradeById,
  updateStudentGrade,
  deleteStudentGrade,
  getAttendanceById
}





// const deleteAttendance = async (req, res, next) => {
//   try {
//     const deleted = await Attendance.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Attendance not found" });
//     res.status(200).json({ message: "Attendance deleted successfully" });
//   } catch (err) {
//     next(err);
//   }
// };






// // 🟣 GET single by ID
// export const getAssessmentById = async (req, res, next) => {
//   try {
//     const data = await Assessment.findById(req.params.id)
//       .populate("semesterId", "semesterNumber")
//       .populate("programId", "programName");
//     if (!data) return res.status(404).json({ message: "Assessment not found" });
//     res.status(200).json(data);
//   } catch (err) {
//     next(err);
//   }
// };
// // 🟠 UPDATE
// export const updateAssessment = async (req, res, next) => {
//   try {
//     let updateData = { ...req.body };
//     if (req.file) {
//       const response = await fileUploader(req.file.buffer);
//       updateData.fileURL = response.secure_url;
//     }
//     const updated = await Assessment.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );
//     if (!updated) return res.status(404).json({ message: "Not found" });
//     res.status(200).json({
//       message: "Assessment updated successfully",
//       data: updated,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
