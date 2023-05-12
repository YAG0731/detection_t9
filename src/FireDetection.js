import React, { Component } from 'react';
import RoboflowDetector from './detectionComponents/roboflowDetection';
import axios from 'axios';

class FireDetection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      area: 'North California',
      imageColor: 'True Color Composite',
      date: '2023-05-11T15:00',
      selectedFile: null,
      inputFileUrl: '',
      gotInputImage: false,
      detections: [],
      results: null,
      imgUrl: null, // Store the imgUrl in state
      satellite: 'MODIS'
    };
    this.getFile = this.getFile.bind(this);
  }

  componentDidMount() {
    this.getFile();

    // Call the handleDetection function
  }
  async getFile() {
    this.setState({
      gotInputImage: false
    });
    var url = '';
    var height = 1500;
    if (this.state.satellite === 'MODIS') {
      url += 'https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&&CRS=EPSG:4326&WRAP=DAY&LAYERS='
      if (this.state.imageColor === 'True Color Composite') {
        url += 'MODIS_Terra_CorrectedReflectance_TrueColor';
      } else {
        url += 'MODIS_Aqua_CorrectedReflectance_Bands721';
      }

      url += '&FORMAT=image/jpeg&HEIGHT=' + height + '&WIDTH=' + height + '&BBOX=';

      if (this.state.area === 'North California') {
        url += '37,-125,42,-120&TIME=';
      }
      if (this.state.area === 'Kaohsiung') {
        url += '22.623,120,23.27,120.799&TIME=';
      }
      if (this.state.area === 'Sonoma') {
        url += '37.757263,-123.049622,38.515320,-122.225647&TIME=';
      } else {
        url += '32,-122,39,-114&TIME=';
      }
      var curr_time = this.state.date
      url += curr_time.split('T')[0];
    }
    else if (this.state.satellite === 'GOES') {
      url += 'https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&TIME='
      url += this.state.date + ':00Z&BBOX='
      if (this.state.area === 'North California') {
        url += '37,-125,42,-120&';
      }
      if (this.state.area === 'Kaohsiung') {
        url += '22.623,120,23.27,120.799&';
      }
      if (this.state.area === 'Sonoma') {
        url += '37.757263,-123.049622,38.515320,-122.225647&';
      } else {
        url += '32,-122,39,-114&';
      }

      url += 'CRS=EPSG:4326&LAYERS=GOES-West_ABI_GeoColor&WRAP=x&FORMAT=image/jpeg&'
      url += 'WIDTH=' + height + '&HEIGHT=' + height + '&ts=1683871570870';

    }
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
      const gridSize = 150;
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
          gotInputImage: true,
          imgUrl: url // Store the imgUrl in state
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', zIndex: '-100' }}>
            <h1 style={{ marginBottom: '10px' }}>Wildfire and Smoke Detection</h1>
            <div style={{ margin: '10px 0 0 10px', width: '100vw' }}>
              <select class="my-select" onChange={(e) => { this.setState({ satellite: e.target.value }); setTimeout(() => { this.getFile() }, 10) }}>
                <option value='MODIS'>Modis(Daily)</option>
                <option value='GOES'>GOES-18(10 min)</option>
              </select>

              <select class="my-select" onChange={(e) => { this.setState({ area: e.target.value }); setTimeout(() => { this.getFile() }, 10) }}>
                <option value='North California'>North California</option>
                <option value='South California'>South California</option>
                <option value='Kaohsiung'>Kaohsiung</option>
                <option value={'Sonoma'}>Sonoma</option>
              </select>
              <select class="my-select" onChange={(e) => { this.setState({ imageColor: e.target.value }); setTimeout(() => { this.getFile() }, 10) }}>
                <option value='True Color Composite'>True Color Composite</option>
                <option value='False Color Composite'>False Color Composite</option>
              </select>

              <input class='select' type='datetime-local' onChange={(e) => { this.setState({ date: e.target.value }); setTimeout(() => { this.getFile() }, 10) }} />
            </div>
            <RoboflowDetector imgurl={this.state.imgUrl} />
            <div style={{ border: '1px solid grey', borderRadius: '15px', padding: '5px', width: '70%' }}>

              <h5 style={{ fontWeight: 'bold' }}>Input Image:</h5>
              <hr />
              {this.state.area}, {this.state.imageColor}, {this.state.satellite}, {this.state.date}:
              <br />
              <br />

              {
                this.state.gotInputImage === false ?
                  <div>Loading...</div>
                  :
                  <img src={this.state.inputFileUrl} width='70%' />
              }

              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FireDetection;
