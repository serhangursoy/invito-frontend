import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';

class Dashboard extends React.Component {

  state = {}

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      users: props.users,
      owner: props.owner
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data, users: nextProps.users, owner: nextProps.owner});
  }

  fromName(id) {
    this.state.users.find();
  }

  Reject() {
    this.props.delegator("decline", this.state.data.id);
  }

  Accept() {
    this.props.delegator("accept", this.state.data.id);
  }

  Cancel() {
    this.props.delegator("cancel", this.state.data.id);
  }

  render() {
    let users = this.state.users;
    let fromID = this.state.data.fromId;

    let quer = users.find(x => x.id === fromID);
    let fromWho = quer
      ? quer.name
      : "Unknown";

    let options;
    if (this.state.owner !== "true") {
      // Check if already answered.

      if (this.state.data.reqAccepted || this.state.data.reqDeclined) {
        if (this.state.data.reqAccepted) {
          options = (<Grid container item justify="center">
            <Fab className="acceptButton">
              <Icon color="inherit">check_icon</Icon>
            </Fab>
            <Fab className="declineButton replied" onClick={this.Reject.bind(this)}>
              <Icon color="inherit">close_icon</Icon>
            </Fab>
          </Grid>);
        } else {
          options = (<Grid container item justify="center">
            <Fab className="acceptButton replied" onClick={this.Accept.bind(this)}>
              <Icon color="inherit">check_icon</Icon>
            </Fab>
            <Fab className="declineButton">
              <Icon color="inherit">close_icon</Icon>
            </Fab>
          </Grid>);
        }
      } else {
        options = (<Grid container item justify="center">
          <Fab className="acceptButton" onClick={this.Accept.bind(this)}>
            <Icon color="inherit">check_icon</Icon>
          </Fab>
          <Fab className="declineButton" onClick={this.Reject.bind(this)}>
            <Icon color="inherit">close_icon</Icon>
          </Fab>
        </Grid>);
      }
    } else {
      fromWho = "You";
      let status = (this.state.data.reqAccepted) ? "accepted": "not responded yet";
      status = (this.state.data.reqDeclined) ? "declined": status;
      options = (<Grid container item justify="space-evenly">
        <Typography gutterBottom>
          Requested user is {status}
        </Typography>
        <Fab className="declineButton" onClick={this.Cancel.bind(this)}>
          <Icon color="inherit">delete_forever_icon</Icon>
        </Fab>
      </Grid>);
    }
    return (<Grid item xs={5} xl={5} style={{
        margin: 4
      }}>
      <Paper style={{
          padding: "10px"
        }}>
        <Typography variant="h4" gutterBottom>
          {this.state.data.desciption}
        </Typography>
        <Grid item xs={6} xl={6}>
          <Typography variant="subtitle2" gutterBottom>
            {this.state.data.date}
          </Typography>
          <Typography>
            From: {fromWho}</Typography>
        </Grid>
        {options}
      </Paper>
    </Grid>);
  }
}

export default Dashboard;
