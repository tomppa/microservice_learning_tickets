import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  // This is executed from the browser.
  console.log(currentUser);

  return <h1>Landing page</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    // we are on the server!

    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: {
          Host: 'demo-ticketing.com',
        },
      }
    );

    return {};
  } else {
    // we are on the browser!
    const { data } = await axios.get('/api/users/currentuser');

    return data;
  }
  return {};
};

export default LandingPage;
