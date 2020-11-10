export const devHost = "http://localhost:5000";

//# CHANGE
export const prodHost = "https://cwarden.herokuapp.com/";

export const devMode = location.hostname.includes("localhost");

export const host = devMode ? devHost : prodHost;
