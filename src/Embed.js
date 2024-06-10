import React from 'react';
import {fetchAuthSession} from 'aws-amplify/auth';
import { get } from 'aws-amplify/api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

var QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");

const useStyles = theme => ({
  loading: {
    alignContent: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginTop: theme.spacing(4),
  },
});

class Embed extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loader: true
        };
    }
    
    componentDidMount() {
        this.getQuickSightDashboardEmbedURL();
    }
    
    getQuickSightDashboardEmbedURL = async () => {
        const data = await fetchAuthSession();
        const jwtToken = data.tokens.idToken;
        const payloadSub = data.tokens.idToken.payload.sub;
        const email = data.tokens.idToken.payload.email;
        
        const params = { 
            headers: {},
            response: true,
            queryStringParameters: {
                jwtToken: jwtToken.toString(),
                payloadSub: payloadSub,
                email: email
            }
        }
        //const quicksight = await get('quicksight', '/getQuickSightDashboardEmbedURL', params);
        const quicksight = await get({
            apiName: 'quicksight',
            path: '/getQuickSightDashboardEmbedURL',
            options: {
                queryParams: {
                    jwtToken: jwtToken,
                    payloadSub: payloadSub,
                    email: email
                }
            }
        });
        console.log(params.queryStringParameters);
        //console.log(quicksight);
        const containerDiv = document.getElementById("dashboardContainer");
        
        const options = {
            url: quicksight.data.data.EmbedUrl,
            container: containerDiv,
            parameters: {
                country: "United States"
            },
            scrolling: "no",
            height: "800px",
            width: "912px",
            footerPaddingEnabled: true,
        };
        const dashboard = QuickSightEmbedding.embedDashboard(options);
        this.setState({ loader: false });
    };
    
    render() {
        const { classes } = this.props;
        return (
            <div>
                { this.state.loader && (
                    <div className={classes.loading}> <CircularProgress /> </div>
                )}
                <div id="dashboardContainer"></div>
            </div>
        );
    }
}

export default withStyles(useStyles)(Embed);
