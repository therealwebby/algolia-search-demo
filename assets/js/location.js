export default class Location {
  set currentLocation (value) {
    this._currentLocation = value;
  }

  get currentLocation () {
    return this._currentLocation;
  }

  getUserLocation () {
    this.isGettingLocation = true;

    navigator.geolocation.getCurrentPosition(
      location => this._locationSuccess(location),
      () => this._locationError()
    );
  }

  _locationSuccess (location) {
    this.currentLocation = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };
    this.hasLocation = true;
    this.isGettingLocation = false;
  }

  _locationError () {
    this.hasLocation = false;
    this.isGettingLocation = false;
  }
}
