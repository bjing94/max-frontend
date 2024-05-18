import { Axios } from "axios";

export type UpscaleStatus = "not found" | "ready" | "in work";

export class UpscaleService {
  private readonly axiosClient: Axios;
  constructor(url: string) {
    this.axiosClient = new Axios({
      baseURL: url,
    });
  }

  public async upscale(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.axiosClient.post<string>("/upscale", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data: { filename: string } = JSON.parse(response.data);

    return data.filename;
  }

  public async checkStatus(name: string): Promise<UpscaleStatus> {
    const response = await this.axiosClient.get<string>("/upscale/status", {
      params: {
        name: name,
      },
    });
    const data: { status: UpscaleStatus } = JSON.parse(response.data);
    if (response.status === 200) {
      return data.status;
    }
    return "not found";
  }

  public async download(name: string) {
    const response = await this.axiosClient.get("upscale/download", {
      params: {
        name,
      },
      responseType: "blob",
    });
    if (response.status === 200) {
      return response.data.status;
    }
    if (response.status === 400) {
      return response.data.status;
    }
  }
}
console.log(process.env.REACT_APP_SERVER_URL);
export const service = new UpscaleService(process.env.REACT_APP_SERVER_URL!);
