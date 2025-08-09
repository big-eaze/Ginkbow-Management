import { it, describe, expect, beforeEach, vi, } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "./Utils/axios.js";
import RegisterationPage from "./RegistrationPage";


vi.mock("./Utils/axios.js");

describe("Registration Page", () => {

  let user;

  beforeEach(() => {
    user = userEvent.setup();
    render(
      <RegisterationPage />
    )
  })


  it("displays staff form when staff role is selected", () => {

    const select = screen.getByTestId("role-selection");
    expect(
      screen.getByTestId("role-selection")
    ).toBeInTheDocument();


    //simulate user selecting "staff"
    fireEvent.change(select, { target: { value: "staff" } });
    expect(screen.queryAllByTestId("staff-role")).toHaveLength(2);
  });


  it("does not show admin or student form when student is selected", () => {
    const select = screen.getByTestId("role-selection");
    fireEvent.change(select, { target: { value: "staff" } });

    expect(
      screen.queryByTestId("admissionNumber")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId("adminId")
    ).not.toBeInTheDocument();
  })


  it("creates new account ", async () => {
    const select = screen.getByTestId("role-selection");

    fireEvent.change(select, { target: { value: "student" } });

    await user.type(screen.getByPlaceholderText("First-Name"), "Lori")
    await user.type(screen.getByPlaceholderText("Last-Name"), "Jordan")
    await user.type(screen.getByPlaceholderText("Username"), "loriJ12");
    await user.type(screen.getByPlaceholderText("Password"), "movement1092");
    await user.type(screen.getByPlaceholderText("confirm password"), "movement1092");
    await user.type(screen.getByPlaceholderText("admissionNumber"), "SCH-71002");

    const registerBtn = screen.getByTestId("registration-btn");
    await user.click(registerBtn);

    expect(axios.post).toHaveBeenCalledWith("/auth/signup", {
      firstName: "Lori",
      lastName: "Jordan",
      username: "loriJ12",
      role: "student",
      password: "movement1092",
      confirmPassword: "movement1092",
      admissionNumber: "SCH-71002"
    }, {
      headers: {
        "content-type": "application/json"
      }
    });
  })
})