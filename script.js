import { group, check, sleep } from "k6";
import http from "k6/http";
// import { apiToken } from "./apiToken.js"

// export let options = {
//     vus: 10,
//     duration: "30s"
// };

const apiUrl = "https://gorest.co.in/public/v2";
const apiToken = "41d1e38dea4825da07c1415ac78f8fa84442492bf0f1715634531397e8c1d50d";

export default function() {
    // http.get('https://test.k6.io');

    // Method POST
    let payload = JSON.stringify({
        name: "Lita Amelia",
        email: "litaak@example.com",
        gender: "female",
        status: "active",
      });

    let headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
    };

    let createUserResponse = http.post(`${apiUrl}/users`, payload, { headers: headers });
    console.log("Create User Response Status:", createUserResponse.status);
    
    check(createUserResponse, {
        "Create User Status is 201": (resp) => resp.status === 201,
    });

    let userId = null;
    if (createUserResponse.status === 201) {
      userId = createUserResponse.json().data.id;
      console.log("Created user with ID:", userId);
    } else {
      console.log("Failed to create user:", createUserResponse.body);
      return; 
    }

    // Method GET
    let getUserResponse = http.get(`${apiUrl}/users/${userId}`, { headers: headers });
    check(getUserResponse, {
      "Get User Status is 200": (resp) => resp.status === 200,
    });

    // Method PUT
    let updatedPayload = JSON.stringify({
        name: "Lita aja",
        status: "inactive",
    });

    let updateUserResponse = http.put(`${apiUrl}/users/${userId}`, updatedPayload, { headers: headers });
    console.log("Update User Response Status:", updateUserResponse.status);

    check(updateUserResponse, {
        "Update User Status is 200": (resp) => resp.status === 200,
    });

    // Method Delete
    let deleteUserResponse = http.del(`${apiUrl}/users/${userId}`, null, { headers: headers });
    console.log("Delete User Response Status:", deleteUserResponse.status);

    check(deleteUserResponse, {
        "Delete User Status is 204": (resp) => resp.status === 204,
    });

    sleep(1)
}