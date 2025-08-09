import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";
import { cleanup, render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "../Utils/axios.js";
import MenuProvider from "../Utils/MenuContext.jsx";
import Dashboard from "./Dashboard.jsx";



describe("renders dashboard", () => {


  vi.mock("../Utils/axios.js");

  beforeEach(() => {
    axios.get.mockImplementation((urlPath) => {
      if (urlPath === "/students") {
        return Promise.resolve({
          data: {
            totalStudents: 100,
            students: []
          }
        })
      }
      if (urlPath === "/staff") {
        return Promise.resolve({
          data: {
            totalStaff: 25,
            staffMembers: []
          }
        })
      }
      if (urlPath === "/results?expand=student") {
        return Promise.resolve({
          data: {
            totalResults: 50,
            results: []
          }
        })
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders dashboard with correct stats", async () => {
    render(
      <MemoryRouter>
        <MenuProvider>
          <Dashboard />
        </MenuProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Dashboard Overview")).toBeInTheDocument()
    })

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  }
  );
})