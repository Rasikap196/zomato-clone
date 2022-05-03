import React from 'react';
import { withRouter } from 'react-router-dom';

class QuickSearchItem extends React.Component {
    handleNavigate = (mealTypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter?mealtype=${mealTypeId}&location=${locationId}`);
        }
        else {
            this.props.history.push(`/filter?mealtype=${mealTypeId}`);
        }
    }

    render() {
        const { qsData } = this.props;
        return (
            <div className="col-sm-12 col-md-6 col-lg-4" onClick={() => this.handleNavigate(qsData.meal_type)}>
                <div className="tileContainer">
                    <div className="tileComponent1">
                        <img src={`./${qsData.image}`} height="150" width="140" />
                    </div>
                    <div className="tileComponent2">
                        <div className="componentHeading">
                            {qsData.name}
                        </div>
                        <div className="componentSubHeading">
                            {qsData.content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(QuickSearchItem);