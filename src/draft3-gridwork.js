import React, { Component } from 'react';
import Detection from "./detection.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      area: 'North California',
      imageColor: 'True Color Composite',
      date: '2021-03-01',
      selectedFile: null,
      inputFileUrl: '',
      gotInputImage: false,
      detections: []
    };
    this.getFile = this.getFile.bind(this);
  }

  componentDidMount() {
    this.getFile();

    const API_KEY = 'vIkUHcco5ivmpVzbIkvX';
    const MODEL_ID = 'wildfire_smoke_detection-498gm';
    const imageUrl = 'https://wvs.earthdata.nasa.gov/?LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&CRS=EPSG:4326&COORDINATES=27.043215,-123.067073,37.673594,-113.020781&FORMAT=image/jpeg&AUTOSCALE=FALSE&RESOLUTION=10km';
    const roboflowApiUrl = `https://detect.roboflow.com/${MODEL_ID}`;

    fetch(roboflowApiUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: imageUrl
      })
    })
      .then((response) => response.json())
      .then((data) => {
        const detections = data['predictions'];
        // Set detections in the component state
        this.setState({ detections });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getFile() {
    this.setState({
      gotInputImage: false
    });
    var url =
      'https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&&CRS=EPSG:4326&WRAP=DAY&LAYERS=';
    var height = 2000;
    if (this.state.imageColor === 'True Color Composite') {
      url += 'MODIS_Terra_CorrectedReflectance_TrueColor';
    } else {
      url += 'MODIS_Terra_CorrectedReflectance_Bands721';
    }
    url += '&FORMAT=image/jpeg&HEIGHT=' + height + '&WIDTH=' + height + '&BBOX=';

    if (this.state.area === 'North California') {
      url += '37,-125,42,-120&TIME=';
    } else {
      url += '32,-122,39,-114&TIME=';
    }
    url += this.state.date;

    const res = await fetch(url);
    console.log(res);
    const blob = await res.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    console.log(file);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Draw a 50x50 grid on the image
      const gridSize = 50;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      for (let i = gridSize; i < canvas.width; i += gridSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
      }
      for (let i = gridSize; i < canvas.height; i += gridSize) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
      }
      ctx.stroke();

      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'image.jpg', { type: blob.type });
        console.log(file);

        this.setState({
          selectedFile: file,
          inputFileUrl: URL.createObjectURL(file),
          gotInputImage: true
        });
      }, 'image/jpeg', 0.9);
    };
  }

  render() {
    const { area, imageColor, date, inputFileUrl, gotInputImage, detections } = this.state;
    const buttonGroupButtonStyle = {
      width: '20%',
      backgroundColor: '#f0f0f0',
      border: '1px solid grey',
      padding: '10px 24px',
      float: 'left',
      margin: '0 20px 0 0',
      borderRadius: '20px',
      color: 'black',
      outline: 'none'
    };
    const buttonGroupButtonActiveStyle = {
      width: '20%',
      backgroundColor: '#1580fb',
      border: '1px solid #1580fb',
      color: 'white',
      padding: '10px 24px',
      float: 'left',
      margin: '0 20px 0 0',
      borderRadius: '20px',
      outline: 'none'
    };
    return (
      <div>
        <div>
          <div style={{ position: 'absolute', marginTop: '72px', zIndex: '-100' }}>

            <div style={{ margin: '10px 0 0 20px', width: '75vw' }}>

              <select style={{ padding: '16px' }} onChange={(e) => { this.setState({ area: e.target.value }); setTimeout(() => { this.getFile() }, 10) }}>
                <option value='North California'>North California</option>
                <option value='South California'>South California</option>
              </select>
              <select style={{ padding: '16px' }} onChange={(e) => { this.setState({ imageColor: e.target.value }); setTimeout(() => { this.getFile() }, 10) }}>
                <option value='True Color Composite'>True Color Composite</option>
                <option value='False Color Composite'>False Color Composite</option>
              </select>
              <input type='date' onChange={(e) => { this.setState({ date: e.target.value }); setTimeout(() => { this.getFile() }, 10) }} />
            </div>
            <div style={{ border: '1px solid grey', borderRadius: '10px', padding: '10px', width: '60%' }}>
              <h5 style={{ fontWeight: 'bold' }}>Input Image:</h5>
              <hr />
              {this.state.area}, {this.state.imageColor}, {this.state.date}:
              <br />
              <br />

              {
                this.state.gotInputImage === false ?
                  <div>Loading...</div>
                  :
                  <img src={this.state.inputFileUrl} width='100%' />
              }
              <div>
              <Detection modelName="wildfire_smoke_detection-498gm" modelVersion="1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;