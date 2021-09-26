import axios from 'axios';

const SERVICE = 'ingress-nginx-controller';
const NAMESPACE = 'ingress-nginx';
const CLUSTER = 'svc.cluster.local';

const baseUrl = 'http://' + SERVICE + '.' + NAMESPACE + '.' + CLUSTER;

const Client = ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server

    return axios.create({
      baseURL: baseUrl,
      headers: req.headers,
    });
  } else {
    // we are on the client

    return axios.create({
      baseURL: '/',
    });
  }
};

export default Client;
