import React from "react";
import ChangePassword from "../components/ChangePassword";
import { StaffNavItems } from "../data/navItems";


function StaffChangePassword() {

  return (
    <ChangePassword
      navItems={StaffNavItems}
      subtitle="Staff Panel"
    />
  )
}

export default StaffChangePassword;