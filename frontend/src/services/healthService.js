import axios from "axios";
import { env } from "../config/env";

export async function getHealth() {
    const response = await axios.get(
        env.apiBaseUrl.replace("/api/v1", "/api/health")
    );

    return response.data;
}