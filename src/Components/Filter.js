import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';


class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations: [],
            mealtype: undefined,
            cuisine: [],
            location: undefined,
            lcost: undefined,
            hcost: undefined,
            sort: 1,
            page: 1,
            pageCount: 0,
            mealtypename: undefined,
            locationname: undefined
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);  // "mealtype=1"  -->  {mealtype : 1}
        const { mealtype, location } = qs;

        const filterObj = {
            mealtype: Number(mealtype),
            location
        }

        axios({
            method: 'POST',
            url: 'http://localhost:8989/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, mealtype, location, pageCount: response.data.pageCount })
            })
            .catch(err => console.log(err));

        axios({
            method: 'GET',
            url: 'http://localhost:8989/locations',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {

                this.setState({ locations: response.data.locations })
            })
            .catch(err => console.log(err));

        axios({
            method: 'GET',
            url: `http://localhost:8989/mealtypes/${mealtype}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ mealtypename: response.data.mealTypes[0].name })
            })
            .catch(err => console.log(err));
    }

    handleSortChange = (sort) => {
        const { mealtype, cuisine, location, lcost, hcost, page } = this.state;

        const filterObj = {
            mealtype: Number(mealtype),
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            location,
            lcost,
            hcost,
            page,
            sort
        }

        axios({
            method: 'POST',
            url: 'http://localhost:8989/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, sort, pageCount: response.data.pageCount })
            })
            .catch(err => console.log(err));
    }

    handleCostChange = (lcost, hcost) => {

        const { mealtype, cuisine, location, sort, page } = this.state;

        const filterObj = {
            mealtype: Number(mealtype),
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            location,
            lcost,
            hcost,
            page,
            sort
        }

        axios({
            method: 'POST',
            url: 'http://localhost:8989/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, lcost, hcost, pageCount: response.data.pageCount })
            })
            .catch(err => console.log(err));
    }

    handleLocationChange = (event) => {
        const location = event.target.value;

        const { mealtype, cuisine, lcost, hcost, sort, page } = this.state;
        if (location && location > 0) {
            const filterObj = {
                mealtype: Number(mealtype),
                cuisine_id: cuisine.length != 0 ? cuisine : undefined,
                location,
                lcost,
                hcost,
                page,
                sort
            }

            axios({
                method: 'POST',
                url: 'http://localhost:8989/filter',
                headers: { 'Content-Type': 'application/json' },
                data: filterObj
            })
                .then(response => {
                    // if(location === undefined)
                    this.setState({ restaurants: response.data.restaurants, location, pageCount: response.data.pageCount })
                })
                .catch(err => console.log(err));

            this.props.history.push(`/filter?mealtype=${mealtype}&location=${location}`);

        }
        else {
            const filterObj = {
                mealtype: Number(mealtype)
                
            }

            axios({
                method: 'POST',
                url: 'http://localhost:8989/filter',
                headers: { 'Content-Type': 'application/json' },
                data: filterObj
            })
                .then(response => {
                    this.setState({ restaurants: response.data.restaurants, mealtype, pageCount: response.data.pageCount })
                })
                .catch(err => console.log(err));
                this.props.history.push(`/filter?mealtype=${mealtype}`);
        }

    }

    handleNavigate = (resId) => {
        this.props.history.push(`/details?restaurant=${resId}`);
    }

    handleCuisineChange = (cuisineId) => {

        const { cuisine, location, mealtype, hcost, lcost, sort, page } = this.state;
        if (cuisine.indexOf(cuisineId) == -1) {
            cuisine.push(cuisineId);
        }
        else {
            var index = cuisine.indexOf(cuisineId);
            cuisine.splice(index, 1);
        }
        let filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };
        axios({
            method: 'POST',
            url: 'http://localhost:8989/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, cuisine, pageCount: response.data.pageCount })
            })
            .catch(err => console.log(err));
    }

    handlePageChange = (pageNumber) => {

        const page = pageNumber;
        console.log("ihhh in page" + page)
        const { location, cuisine, mealtype, hcost, lcost, sort, pageCount } = this.state;
        if (page > 0 && page <= pageCount) {
            let filterObj = {
                location_id: location,
                mealtype_id: mealtype,
                cuisine_id: cuisine.length != 0 ? cuisine : undefined,
                hcost: hcost,
                lcost: lcost,
                sort: sort,
                page: page
            };

            axios({
                method: 'POST',
                url: 'http://localhost:8989/filter',
                headers: { 'Content-Type': 'application/json' },
                data: filterObj
            })

                .then(res => {
                    this.setState({ restaurants: res.data.restaurants, pageCount: res.data.pageCount, page: page })
                })
                .catch(err => console.log(err))
        }

    }

    render() {
        const { restaurants, locations, pageCount, page, mealtypename, location } = this.state;
        var lis = [];
        console.log("location %j" + location)
        for (var i = 1; i <= pageCount; i++) {
            lis.push(i);
        }
        return (
            <div>
                <div id="myId" className="heading">{mealtypename} Places</div>


                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
                            <div className="filter-heading">Filters / Sort</div>
                            <span className="glyphicon glyphicon-chevron-down toggle-span" data-toggle="collapse"
                                data-target="#filter"></span>
                            <div id="filter" className="collapse show">
                                <div className="Select-Location">Select Location</div>
                                <select className="Rectangle-2236" onChange={this.handleLocationChange}>
                                    <option value={0}>Select</option>
                                    {locations.map(item => {
                                        return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                    })}
                                </select>
                                <div className="Cuisine">Cuisine</div>
                                <div style={{ display: 'block' }}>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(1)} />
                                    <span className="checkbox-items">North Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(2)} />
                                    <span className="checkbox-items">South Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(3)} />
                                    <span className="checkbox-items">Chineese</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(4)} />
                                    <span className="checkbox-items">Fast Food</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(5)} />
                                    <span className="checkbox-items">Street Food</span>
                                </div>
                                <div className="Cuisine">Cost For Two</div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 500)} />
                                    <span className="checkbox-items">Less than &#8377; 500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                                    <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                                    <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                                    <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(2000, 50000)} />
                                    <span className="checkbox-items">&#8377; 2000 +</span>
                                </div>
                                <div className="Cuisine">Sort</div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => this.handleSortChange(1)} />
                                    <span className="checkbox-items">Price low to high</span>
                                </div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => this.handleSortChange(-1)} />
                                    <span className="checkbox-items">Price high to low</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="col-sm-8 col-md-8 col-lg-8">

                                {restaurants.length > 0 ? restaurants.map(item => {
                                    return <div className="Item" onClick={() => this.handleNavigate(item._id)}>
                                        <div>
                                            <div className="small-item vertical">
                                                <img className="img" src={`./${item.image}`} />
                                            </div>
                                            <div className="big-item">
                                                <div className="rest-name">{item.name}</div>
                                                <div className="rest-location">{item.locality}</div>
                                                <div className="rest-address">{item.city}</div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div>
                                            <div className="margin-left">
                                                <div className="Bakery">CUISINES : {item.cuisine.map(cuisine => `${cuisine.name}, `)}</div>
                                                <div className="Bakery">COST FOR TWO : &#8377; {item.min_price}</div>
                                            </div>
                                        </div>
                                    </div>
                                }) : <div className='no-records'>
                                    No Records Found...
                                </div>}
                            </div>

                            {pageCount > 0 ? <div className="pagination">

                                <a href="#" onClick={() => this.handlePageChange(page - 1)}>&laquo;</a>
                                {lis.map((item) => {
                                    return <a href="#" onClick={() => this.handlePageChange(item)} >{item}</a>
                                })}
                                <a href="#" onClick={() => this.handlePageChange(page + 1)}>&raquo;</a>
                            </div> : null}
                        </div>

                    </div>
                </div>
            </div >
        )
    }
}

export default Filter;