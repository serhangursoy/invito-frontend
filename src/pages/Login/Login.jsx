import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = {
  paper: {
      padding: 10,
      margin: 50,
      marginTop: "-25%",
      textAlign: 'center',
      height: "80%",
      display: "grid"
    },
  paperHeader: {
          padding: 10,
          marginLeft: "10%",
          marginRight: "10%",
          textAlign: 'center',
          height: "130%"
    },
  button: {
      marginLeft: "40%",
      marginRight: "40%",
      height: "60%",
      background: 'linear-gradient(45deg, #b86ea8 30%, #445eba 90%)',
    },
  holder: {
      paddingTop: "5%",
      background: 'linear-gradient(45deg, #5b2e7e 30%, #220f34 90%)',
      height: "-webkit-fill-available"
    },
  errorCard: {
    background: "red"
  }
}

class Login extends React.Component {

  state = { }

  constructor(props){
    super(props);
    this.state = {
      haveError: props.haveError? props.haveError: false,
      errorMessage: props.errorMessage? props.errorMessage: "",
      userValue: "",
      userNewValue: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
        {
          haveError: nextProps.haveError,
          errorMessage: nextProps.errorMessage
        });
  }

  handleChange(event){
    this.setState({userValue: event.target.value});
  }
  handleChangeNew(event){
    this.setState({userNewValue: event.target.value});
  }

  loginRequest(){
    this.props.callback("login", this.state.userValue);
  }
  registerRequest(){
    this.props.callback("register", this.state.userNewValue);
  }

  render() {
    let ErrorElement;
    if(this.state.haveError) {
      ErrorElement = (<Paper style={styles.errorCard}>
         <Typography variant='subtitle1' gutterBottom style={{color:'white'}}> {this.state.errorMessage} </Typography>
      </Paper>);
    } else {
      ErrorElement = "";
    }
    return (
          <Grid container
              direction="row"
              justify="space-between"
              alignItems="stretch" style={styles.holder}>
              <Grid item xs={12} xl={12}>
                 <Paper style={styles.paperHeader}>
                   <Typography variant="h2" gutterBottom> Invito </Typography>
                   <Typography variant="subtitle2" gutterBottom> Welcome. Before we begin, you need to sign in </Typography>
                    {ErrorElement}
                 </Paper>
              </Grid>
              <Grid item xs={6} xl={6}>
                 <Paper style={styles.paper}>
                   <Typography variant="subtitle1" gutterBottom> Login </Typography>
                   <TextField
                      id="outlined-name"
                      label="Username"
                      value={this.state.userValue}
                      onChange={this.handleChange.bind(this)}
                      margin="normal"
                      variant="outlined"
                    />
                  <Button variant="contained" color="primary" style={styles.button} onClick={this.loginRequest.bind(this)}>
                     Continue
                   </Button>
                 </Paper>
               </Grid>
               <Grid item xs={6} xl={6}>
                 <Paper style={styles.paper}>
                   <Typography variant="subtitle1" gutterBottom> Create new user </Typography>
                   <TextField
                      id="outlined-name"
                      label="Username"
                      value={this.state.userNewValue}
                      onChange={this.handleChangeNew.bind(this)}
                      margin="normal"
                      variant="outlined"
                    />
                  <Button variant="contained" color="primary" style={styles.button} onClick={this.registerRequest.bind(this)}>
                       Continue
                    </Button>
                 </Paper>
               </Grid>
         </Grid>
    );
  }
}

export default Login;
