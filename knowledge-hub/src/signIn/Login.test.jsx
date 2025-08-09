import { it, describe, expect, beforeEach, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login.jsx";
import userEvent from "@testing-library/user-event";
import axios from "../Utils/axios.js";


vi.mock("../Utils/axios.js");




describe("Sign in ", () => {

  let user;
  let usernameField;
  let passwordField;
  let loginBtn;

  beforeEach(() => {
    cleanup()
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    user = userEvent.setup();
    usernameField = screen.getByTestId("username-field");
    passwordField = screen.getByTestId("password-field");
    loginBtn = screen.getByTestId("signin-btn");
    vi.clearAllMocks();
  })

  it("renders sign in component", () => {

    expect(
      usernameField
    ).toBeInTheDocument();


    expect(
      passwordField
    ).toBeInTheDocument();


  });



  it("displays validation error message when input field are empty ", async () => {

    await user.click(loginBtn);

    const errorMessage = screen.getByTestId("error-message");

    expect(errorMessage).toBeInTheDocument();
  });



  it("displays error message when password doesn't have mininum of 8 characters", async () => {

    await user.type(usernameField, "testuser");
    await user.type(passwordField, "test123");
    await user.click(loginBtn);

    const errorMessage = screen.getByTestId("error-message");

    expect(errorMessage).toBeInTheDocument();

    await user.clear(usernameField); // just in case
    await user.clear(passwordField);

  })

  it("it sign in", async () => {

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: "" }
    });
    
    axios.post.mockResolvedValueOnce({ data: { token: "fake-token", role: "admin" } });

    await user.type(usernameField, "jahman1092");
    await user.type(passwordField, "Israel1092@");

    await user.click(loginBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/auth/signin", {
        username: "jahman1092",
        password: "Israel1092@"
      },
        {
          headers: {
            "content-type": "application/json"
          }
        }
      );

      
      expect(window.location.href).toBe("/ad-dashboard");
    })
  })
})