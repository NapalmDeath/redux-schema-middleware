# redux-schema-middleware
Using [Normalizr](https://github.com/gaearon/normalizr) to normalize redux action payload

## Motivation:
You have redux store with some entities, such as posts, comments, users, etc.
You want to parse server response and save parsed entities to store.
[Normalizr](https://github.com/gaearon/normalizr) solves this problem and this middleware automates normalizing proccess.

## Install:
`npm install redux-schema-middleware`

Put this middleware after something that generates nested data andbefore anything that need to have parsed data.
For example:
```js
applyMiddleware(
  apiMiddleware, // get nested data from server
  reduxSchemaMiddleware,
  ...
)
```

## Usage
### 1. Define your schema
If you have not use normalizr, look at [this page](https://github.com/paularmstrong/normalizr#usage)
For example, we will define post, which contains comments array.
```js
const post = new Schema('posts');
const comment = new Schema('comments');

post.define({
  comments: arrayOf(comment)
});
const feedActivity = { activity: arrayOf(post) }; // This is how server response looks like.
```
### 2. Add schema to your action
```js
serverDataReceivedAction = {
  type: DATA_RECEIVED,
  payload: someNestedData, // this can be server response obtained from server
  schema: feedActivity
}
```

### 3. Profit!
On the next steps (next middlewares or in your reducer) you can get normalized `entities` and `response` from your action.parsedResponse
You can use this data in post or comment reducer like this:
```js
const posts = (state = defaultState, action) => {
  if (actionHasParsedResponseWithPosts) {
    return update(state, {
      $merge: action.parsedResponse.entities.posts
    });
  }
  return state;
}
```
So you will get your server-response entities cached in your store!
