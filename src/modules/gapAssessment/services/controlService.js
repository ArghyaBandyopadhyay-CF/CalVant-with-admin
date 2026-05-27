// const API = process.env.REACT_APP_SP + "/control-service/api/controls";
import axios from "axios";

const API = "https://api.calvant.com/framework/api";

const controlService = {
  getControlsByFramework: async (frameworkCode) => {
    const res = await axios.get(`${API}/controls/framework/${frameworkCode}`);
    return res.data;
  },
};

export default controlService;
