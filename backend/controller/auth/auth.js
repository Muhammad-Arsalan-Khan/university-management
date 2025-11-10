import User from "../../models/userSchema.js" 
import bcrypt from "bcryptjs"
import { setUser, setAdmin, setRole } from "../../utils/jwt.js"
import shortid from "shortid"

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if(!email || !password){
       const err = new Error("field are required")
       err.statusCode = 400
       throw err
    }
    const existingUser = await User.findOne({ email })
    console.log(existingUser._id)
    if (!existingUser) {
       const err = new Error("account does not exists")
       err.statusCode = 400
       throw err
    }
    const isPasswordMatch = await bcrypt.compare( password, existingUser.password)
    if (!isPasswordMatch) {
       const err = new Error("invalid email password")
       err.statusCode = 400
       throw err
    }
    const id = existingUser._id
    const token = setUser(id)
    let HOD;
    let SeniorDataEntryOperator; 
    let JuniorDataEntryOperator; 
    let other; 
    let Librarian; 
    let LabIncharge;
    let Teacher; 
    let Student;
    let feeOprator;
    if (existingUser.role == "SeniorDataEntryOperator" ) {
      const role = existingUser.role
      SeniorDataEntryOperator = setRole(role)
    }
    if (existingUser.role == "JuniorDataEntryOperator" ) {
      const role = existingUser.role
      JuniorDataEntryOperator = setRole(role)
    }
    if (existingUser.role == "other" ) {
      const role = existingUser.role
      other = setRole(role)
    }
    if (existingUser.role == "Librarian" ) {
      const role = existingUser.role
      Librarian = setRole(role)
    }
    if (existingUser.role == "LabIncharge" ) {
      const role = existingUser.role
      LabIncharge = setRole(role)
    }
    if (existingUser.role == "Teacher") {
      const role = existingUser.isVerified
      Teacher = setRole(role)
    }
    if (existingUser.role == "feeOprator") {
      const role = existingUser.isVerified
      feeOprator = setRole(role)
    }
    if (existingUser.role == "Student") {
      const role = existingUser.isVerified
      Student = setRole(role)
    }
    if (existingUser.role == "HOD") {
      const isVerified = existingUser.isVerified
      HOD = setAdmin(isVerified)
    }
    res.status(200).json({
      message: "login successful",
      // user: userData,
      id: existingUser._id,
      token,
      HOD,
      SeniorDataEntryOperator,
      JuniorDataEntryOperator,
      other,
      Librarian,
      LabIncharge,
      Teacher,
      Student,
      feeOprator
    })
  } catch (err) {
    next(err)
  }
}

async function signup(req, res, next) {
  try {
    const { Username, email, password, role} = req.body
    if(!Username || !email || !password ||  !role){
      const err = new Error("field are required")
      err.statusCode = 400
      throw err
    }
    const userId = shortid.generate()
    const data = { Username , email,  password, role, userId}
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const err = new Error("Account already exists")
      err.statusCode = 400;
      throw err
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ ...data , password: hashedPassword })
    await newUser.save()
    res.status(201).json({ message: "user registered successfully", data: newUser._id, id: userId || "signup success" })
    //  res.status(201).json({ message: "user registered successfully"})
  } catch (err) {
     next(err)
  }
}

async function logout(req, res, err) {
  try {
    res.clearCookie("token")
    if(req.cookies.isVerified){
      res.clearCookie("isVerified")
      return res.json({msg:"logout admin"})
    }
    return res.json({msg:"logout"})
  } catch (err) {
    next(err)
  }
}

// async function getUser(req, res, next) {
//   try {
//     const Users = await User.find()
//     res.status(200).json({ success: true, data: Users });
//   } catch (err) {
//     next(err)
//   }
// }

async function getUser(req, res, next) {
  try {
    const Users = await User.find({}, { _id: 1, Username: 1, email: 1 });
    const formattedUsers = Users.map(u => ({
      _id: u._id,
      name: u.Username,
      email: u.email
    }));
    res.status(200).json({ success: true, data: formattedUsers });
  } catch (err) {
    next(err);
  }
}



export { login, signup,  logout, getUser }
