import axios, { AxiosInstance } from "axios";
import { TCategory, TCreateOrderRequest, TProduct, TTable, TUser, TUserLoginRequest } from "./types";

// ----- Axios instance for client-side -----
const clientRequest: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// ----- Axios instance for SSR / Server-side -----
export const serverRequest = (cookie?: string): AxiosInstance =>
  axios.create({
    baseURL: `${process.env.API_URL}/api` || "http://localhost:8000/api",
    headers: cookie ? { cookie } : undefined,
  });

// ----- API functions -----
// Fetch all users
export const fetchUsers = async (): Promise<TUser[]> => {
  try {
    const res = await serverRequest().get<TUser[]>("/users");
    return res.data;
  } catch (err) {
    return [];
  }
};

// Login user
export const loginUser = async (data: TUserLoginRequest): Promise<boolean> => {
  try {
    const res = await clientRequest.post("/auth/login", data);
    return res.status === 200;
  } catch (err: any) {
    return false;
  }
};

// Fetch tables (client-side)
export const fetchTables = async (): Promise<TTable[]> => {
  try {
    const res = await clientRequest.get<TTable[]>("/tables");
    return res.data;
  } catch (err) {
    return [];
  }
};

export const updateTableById = async (id: string, data: Partial<TTable>): Promise<TTable | null> => {
  try {
    const res = await clientRequest.put<TTable>(`/tables/${id}`, data);
    return res.data;
  } catch (err) {
    return null;
  }
}

// Fetch tables (server-side SSR)
export const fetchTablesSSR = async (cookie?: string): Promise<TTable[]> => {
  try {
    const res = await serverRequest(cookie).get<TTable[]>("/tables");
    return res.data;
  } catch (err) {
    return [];
  }
};

export const fetchMe = async (): Promise<TUser | null> => {
  try {
    const res = await clientRequest.get<TUser>("/auth/me");
    return res.data;
  } catch (err) {
    return null;
  }
};

export const fetchMeSSR = async (cookie?: string): Promise<TUser | null> => {
  try {
    const res = await serverRequest(cookie).get<TUser>("/auth/me");
    return res.data;
  } catch (err) {
    return null;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const res = await clientRequest.post("/auth/logout");
    return res.data;
  } catch (err) {
    return false;
  }
}

export const fetchTableByIdSSR = async (id: string, cookie?: string): Promise<TTable| null> => {
  try {
    const res = await serverRequest(cookie).get<TTable>(`/tables/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export const fetchCategoriesSSR = async (cookie?: string): Promise<TCategory[]> => {
  try {
    const res = await serverRequest(cookie).get<TCategory[]>('/categories');
    return res.data;
  } catch (err) {
    return [];
  }
}

export const fetchProductsByCategory = async (categoryId: string): Promise<TProduct[]> => {
  try {
    const res = await clientRequest.get<TProduct[]>("/products", {
      params: { categoryId }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}


export const createOrder = async (
  data: TCreateOrderRequest
): Promise<boolean> => {
  try {
    const res = await clientRequest.post("/orders", data);
    return res.status === 201;
  } catch (err) {
    return false;
  }
};

// Update quantity of an order item
export const updateOrderItem = async (
  tableId: string,
  productId: string,
  quantity: number
) => {
  try {
    const res = await clientRequest.put(`/orders/update-item`, {
      tableId,
      productId,
      quantity,
    });
    return res.data;
  } catch (err) {
    return null;
  }
};

// Fetch order for table
export const fetchOrdersByTable = async (tableId: string) => {
  try {
    const res = await clientRequest.get(`/orders/table/${tableId}`);
    return res.data || { items: [] };
  } catch (err) {
    return { items: [] };
  }
};

// Add product to order
export const addProductToOrder = async (
  orderId: string,
  productId: string,
  quantity: number
) => {
  try {
    const res = await clientRequest.post(`/orders/${orderId}/items`, {
      productId,
      quantity,
    });
    return res.data;
  } catch (err) {
    return null;
  }
};

// Delete product from order
export const deleteOrderItems = async (
  orderId: string,
  productIds: string[]
) => {
  try {
    for (const pid of productIds) {
      await clientRequest.delete(`/orders/${orderId}/items/${pid}`);
    }
    return true;
  } catch (err) {
    return false;
  }
};


export const payOrder = async (orderId: string) => {
try {
    await clientRequest.post(`/orders/${orderId}`);
    return true;
  } catch (err) {
    return false;
  }
}