// Mock admin user (password: admin123)
// Hash generated with bcryptjs-like pattern for demo purposes
// In production, use actual bcryptjs or Web Crypto API

export const mockAdminUser = {
  id: 1,
  username: "admin",
  email: "admin@kvztrutnov2.cz",
  // Hashed password for "admin123"
  passwordHash: "$2a$10$8/2j5gx8K0VK5b8V5c8K5eZ5b8K5b8K5b8K5b8K5b8K5b8K5b8K5e",
  role: "admin",
  fullName: "KVZ Administrátor",
  createdAt: new Date("2025-01-01"),
};

// Placeholder user for testing (password: test123)
export const testUser = {
  username: "test",
  email: "test@kvztrutnov2.cz",
  passwordHash: "$2a$10$9/3k6hy9L1WL6c9W6d9L6fA6c9L6c9L6c9L6c9L6c9L6c9L6c9L6f",
  role: "editor",
};
