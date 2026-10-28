import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const API_URL = (process.env.REACT_APP_API_URL || 'https://backend-w6n9.onrender.com').replace(/\/$/, '');

const initialState = {
  input: '',
  imageUrl: '',
  box: null,
  error: '',
  isDetecting: false,
  route: 'signin',
  isSignedIn: false,
  user: { id: '', name: '', email: '', entries: 0, joined: '' }
};

class App extends Component {
  state = { ...initialState, user: { ...initialState.user } };
  requestId = 0;

  componentWillUnmount() {
    this.requestId += 1;
  }

  loadUser = (data) => {
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    } });
  }

  calculateFaceLocation = (data) => {
    const face = data?.outputs?.[0]?.data?.regions?.[0]?.region_info?.bounding_box;
    if (!face) return null;
    const image = document.getElementById('inputimage');
    if (!image || !image.width || !image.height) return null;
    const width = image.width;
    const height = image.height;
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - face.right_col * width,
      bottomRow: height - face.bottom_row * height
    };
  }

  onInputChange = (event) => this.setState({ input: event.target.value });

  onImageLoad = () => {
    if (this.faceResponse) {
      this.setState({ box: this.calculateFaceLocation(this.faceResponse) });
    }
  }

  onButtonSubmit = async (event) => {
    if (event) event.preventDefault();
    const input = this.state.input.trim();
    let validUrl;
    try {
      const url = new URL(input);
      validUrl = ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password;
    } catch {
      validUrl = false;
    }
    if (!validUrl) {
      this.setState({ error: 'Enter a valid HTTP or HTTPS image URL.' });
      return;
    }
    const currentRequest = ++this.requestId;
    this.faceResponse = null;
    this.setState({ imageUrl: input, box: null, error: '', isDetecting: true });

    try {
      const response = await fetch(`${API_URL}/imageurl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      if (!response.ok) throw new Error('Face detection failed. Please try another image.');
      const data = await response.json();
      if (currentRequest !== this.requestId) return;
      this.faceResponse = data;
      const hasFace = Boolean(data?.outputs?.[0]?.data?.regions?.length);
      this.setState({
        box: this.calculateFaceLocation(data),
        error: hasFace ? '' : 'No faces were detected in this image.'
      });

      if (hasFace && this.state.user.id) {
        try {
          const countResponse = await fetch(`${API_URL}/image`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.state.user.id })
          });
          if (!countResponse.ok) throw new Error('Unable to update entry count');
          const count = await countResponse.json();
          if (currentRequest === this.requestId) {
            this.setState((prev) => ({
              user: { ...prev.user, entries: count }
            }));
          }
        } catch {
          // Face detection still succeeds if the entry counter is unavailable.
          if (currentRequest === this.requestId) {
            this.setState({ error: 'Face detected, but your entry count could not be updated.' });
          }
        }
      }
    } catch (error) {
      if (currentRequest === this.requestId) {
        this.faceResponse = null;
        this.setState({ error: error.message || 'Unable to detect faces.', box: null });
      }
    } finally {
      if (currentRequest === this.requestId) this.setState({ isDetecting: false });
    }
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.requestId += 1;
      this.faceResponse = null;
      return this.setState({ ...initialState, user: { ...initialState.user } });
    }
    this.setState({ route, isSignedIn: route === 'home' });
  }

  render() {
    const { isSignedIn, imageUrl, route, box, error, isDetecting } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} isDetecting={isDetecting}
              input={this.state.input} />
            {isDetecting && <p role="status">Detecting faces…</p>}
            {error && <p role="alert">{error}</p>}
            <FaceRecognition box={box} imageUrl={imageUrl} onImageLoad={this.onImageLoad} />
          </div>
        ) : route === 'signin' ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
