const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;


export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {

  const response = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );


  return response.json();

}



export async function loginUser(data: {
  email: string;
  password: string;
}) {

  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );


  return response.json();

}