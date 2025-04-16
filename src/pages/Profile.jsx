async function fetchProfiles() {
    try {
      const options = {
        method: "GET",
        headers: {
           "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Noroff-API-Key": `178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9`
        },
      };
      const response = await fetch("https://v2.api.noroff.dev/holidaze/profiles", options);
      const responseData = await response.json();
      console.log(responseData);
  
    } catch (error) {
      console.error(error.message);
    }
  }

  fetchProfiles();

const Profile = () => {
    return (
        <>
            <h1>Profile</h1>
        </>
    );
};

export default Profile;
