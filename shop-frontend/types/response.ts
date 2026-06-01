export interface Response {
    success: boolean;
    info: string;
}

export interface ResponseWithData {
    info: string | null | undefined;
    success: boolean;
    data: number
}

export interface SettingsResponse {
    info: string | null | undefined;
    success: boolean;
    data: [{ theme: "DARK" | "LIGHT", language: "LV" | "EN" }] | null;
}