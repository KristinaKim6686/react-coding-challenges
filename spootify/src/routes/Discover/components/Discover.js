import React, { Component } from "react";
import axios from "axios";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import { api, clientId, clientSecret } from "../../../config";

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
      token: "",
    };
  }

  componentDidMount() {
    const authUrl = "https://accounts.spotify.com/api/token";
    const clientId = "d33f5f01889247fc9c955c3645259684";
    const clientSecret = "0cc7cd9eb02940499d6d9f959adc0f4d";
    const baseUrl = "https://api.spotify.com/v1";

    // setting the access token
    axios(authUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      data: "grant_type=client_credentials",
      method: "POST",
    }).then((tokenResponse) => {
      this.setState({ token: tokenResponse.data.access_token });

      //  new releases fetch when the page is loading

      axios("https://api.spotify.com/v1/browse/new-releases", {
        headers: {
          Authorization: "Bearer " + tokenResponse.data.access_token,
        },
        method: "GET",
      }).then((response) => {
        this.setState({ newReleases: response.data.albums.items });
        console.log(response);
      });
      axios("https://api.spotify.com/v1/browse/featured-playlists", {
        headers: {
          Authorization: "Bearer " + tokenResponse.data.access_token,
        },
        method: "GET",
      }).then((response) => {
        this.setState({ playlists: response.data.playlists.items });
      });

      // fetching categories
      axios("https://api.spotify.com/v1/browse/categories", {
        headers: {
          Authorization: "Bearer " + tokenResponse.data.access_token,
        },
        method: "GET",
      }).then((response) => {
        this.setState({ categories: response.data.categories.items });
      });
    });
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock
          text="RELEASED THIS WEEK"
          id="released"
          data={newReleases}
        />
        <DiscoverBlock
          text="FEATURED PLAYLISTS"
          id="featured"
          data={playlists}
        />
        <DiscoverBlock
          text="BROWSE"
          id="browse"
          data={categories}
          imagesKey="icons"
        />
      </div>
    );
  }
}
