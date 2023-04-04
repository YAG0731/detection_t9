const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: "POST",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/", async (req, res) => {
  try {
    const response = await axios.post("https://detect.roboflow.com/wildfire_smoke_detection-498gm/1/", {
      api_key: "vIkUHcco5ivmpVzbIkvX",
      image: "https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&CRS=EPSG:4326&TIME=2023-04-01&WRAP=DAY&BBOX=37.345276,-123.082581,38.438416,-121.967468&FORMAT=image/jpeg&WIDTH=508&HEIGHT=498&AUTOSCALE=FALSE&ts=1680578520515",
    });
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
