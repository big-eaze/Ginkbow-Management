import React from "react";
import ChangePassword from "../components/ChangePassword";
import { studentNavItems } from "../data/navItems";

function StudentChangePassword() {
  
  
  return(
    <ChangePassword
    navItems={studentNavItems}
    subtitle="Student Panel"
  />
  )
  
}

export default StudentChangePassword;