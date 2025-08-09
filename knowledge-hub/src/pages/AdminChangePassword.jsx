import React from "react";
import ChangePassword from "../components/ChangePassword";
import { adminNavItems} from "../data/navItems";

function AdminChangePassword() {
  return (
    <ChangePassword
      navItems={adminNavItems}
      subtitle="Admin Panel"
    />
  )
}

export default AdminChangePassword;