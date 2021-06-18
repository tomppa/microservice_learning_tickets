# Authentication service for ticketing application

## Setup

- Create the following secrets:
  - name: jwt-secret
    - key: JWT_KEY, value: [your-secret-value]

_Hint_: You can use the command `kubectl create secret generic [name] --from-literal=[key]=[value]` to create secrets.
