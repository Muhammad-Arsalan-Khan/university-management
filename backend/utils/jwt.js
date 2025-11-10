import  jwt  from "jsonwebtoken"

function setUser (userData) {
    return jwt.sign(
      {
        id: userData,
      },
      process.env.JWT_SECRET,
    );
}

function setRole (role) {
    return jwt.sign(
      {
        id: role,
      },
      process.env.JWT_SECRET,
    );
}

function setAdmin (isVerified) {
    return jwt.sign(
      {
        adminToken: isVerified,
      },
      process.env.JWT_SECRET,
    );
}

function verifyUser(token) {
    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return null
    }
}

export { setUser, verifyUser, setAdmin, setRole }