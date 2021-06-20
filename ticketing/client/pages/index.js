import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  axios.get('/api/users/currentuser').catch((err) => {
    console.log(err.message);
  });

  return <h1>Landing page</h1>;
};

LandingPage.getInitialProps = () => {
  return { color: 'red' };
};

export default LandingPage;
