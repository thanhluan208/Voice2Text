import axios from "axios";

class Services {
  constructor() {
    this.axios = axios;
    this.interceptors = null;
    this.axios.defaults.withCredentials = false;
    this.get = this.axios.get;
    this.post = this.axios.post;
    this.put = this.axios.put;
    this.delete = this.axios.delete;
    this.patch = this.axios.patch;
  }

  attachTokenToHeader(token) {
    this.interceptors = this.axios.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  removeInterceptors() {
    this.axios.interceptors.request.eject(this.interceptors);
  }

  source() {
    return this.axios.CancelToken.source();
  }

  isCancel(error) {
    return this.axios.isCancel(error);
  }
}

export default new Services();
