# Simple service application

- Clone the repo and cd into the root directory
- create a `.env` file using the `.env-sample` file. You can leave the mongodb url as is but insert your own secret value

### Run the application
- to run the application, launch docker and execute the following command
  `docker-compose up --build`

### Sample queries
Launch the app on your browser at the URL: `http://localhost:4000` and execute the following queries and mutations
```
mutation UserSignup($username: String!, $email: String!, $password: String!) {
  signup(username: $username, email: $email, password: $password) {
    token,
    user {
      email,
      username,
      id
    }
  }
}
```

```
mutation userLogin($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token,
    user {
      id,
      username,
      email
    }
  }
}
```

```
query UserQuery {
  me {
    id,
    username,
    email
  }
}
```