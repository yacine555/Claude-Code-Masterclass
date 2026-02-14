import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders successfully", () => {
    render(<Avatar name="John" />)
    const avatar = screen.getByRole("img")
    expect(avatar).toBeInTheDocument()
  })

  it("displays the first letter of a simple name", () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("displays the first 2 uppercase letters for PascalCase names", () => {
    render(<Avatar name="JohnDoe" />)
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("handles names with multiple uppercase letters correctly", () => {
    render(<Avatar name="MaryCatherineSmith" />)
    expect(screen.getByText("MC")).toBeInTheDocument()
  })

  it("displays single letter for names without PascalCase", () => {
    render(<Avatar name="bob" />)
    expect(screen.getByText("B")).toBeInTheDocument()
  })
})
