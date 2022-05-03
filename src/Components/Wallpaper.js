import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            suggestions: [],
            inputText: undefined
        }
    }

    handleDDChange = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);

        axios({
            method: 'GET',
            url: `http://localhost:8989/restaurants/${locationId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants })
            })
            .catch(err => console.log(err));
    }

    handleSearch = (event) => {
        const inputText = event.target.value;

        const { restaurants } = this.state;

        const suggestions = restaurants.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()));

        this.setState({ suggestions, inputText });
    }

    selectingRestaurant = (resObj) => {
        this.props.history.push(`/details?restaurant=${resObj._id}`);
    }


    showSuggestion = () => {
        const { suggestions, inputText } = this.state;

        if (suggestions.length == 0 && inputText == undefined) {
            return null;
        }
        if (suggestions.length > 0 && inputText == '') {
            return null;
        }
        if (suggestions.length == 0 && inputText) {
            return <ul >
                <li>No Search Results Found</li>
            </ul>
        }
        return (
            <ul >
                {
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.selectingRestaurant(item)}>{`${item.name} -   ${item.locality},${item.city}`}</li>))
                }
            </ul>
        );

    }

    render() {
        const { locationsData } = this.props;
        return (
            <div>
                {/* Adding Wallpaper  */}
                <img src="./Assets/homepageimg.png" width="100%" height="450" />
                <div>

                    <div className="logo">
                        <p>e!</p>
                    </div>

                    <div className="headings">
                        Find the best restaurants, cafes, bars
                    </div>

                    <div className="locationSelector">
                        <select className="locationDropdown" onChange={this.handleDDChange}>
                            <option value="0" >Select</option>
                            {locationsData.map(item => {
                                return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                            })}
                        </select>
                        <div>
                            <span className="glyphicon glyphicon-search search"></span>
                            <div id="notebooks">
                                <input id="query" className="restaurantsinput" type="text"
                                    placeholder="Please Enter Restaurant Name" onChange={this.handleSearch} />
                                {this.showSuggestion()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Wallpaper);