import { ShorthandRule } from "../types/shorthand";

export interface LoginResponse {
  token: string;
  user: {
    email: string;
    isAdmin: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface ShorthandCategory {
  category: string;
  testText: string;
  rules: ShorthandRule[];
}

export const API_URL = "http://localhost:5001";

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
};

export const getUsers = async (token: string): Promise<User[]> => {
  const response = await fetch(`${API_URL}/api/admin/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch users");
  }

  return response.json();
};

export const getTestData = async (token: string) => {
  const response = await fetch(`${API_URL}/api/test-data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch test data");
  }

  return response.json();
};

export const getAdminTestData = async (token: string) => {
  const response = await fetch(`${API_URL}/api/admin/test-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin test data");
  }

  return response.json();
};

// New functions for managing shorthand rules
export const getShorthandCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/shorthand`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch categories");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const updateShorthandCategory = async (
  category: string,
  testText: string,
  rules: ShorthandRule[],
  token: string
) => {
  try {
    const response = await fetch(`${API_URL}/api/shorthand/${category}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        testText,
        rules,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update category");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const createUser = async (
  token: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/api/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};
