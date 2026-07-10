export async function getCurrentUser() {

  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://localhost:5000/auth/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}