# Shift News
> Shift News is a "blog" API that copies [tab news](https://www.tabnews.com.br/)/[dev.to](https://dev.to).

## Developers
- Fullstack
	- Pedro Henrique, [Github](https://github.com/phbrg)

## Technologies
- Backend
	- Nest (Node.js) | Prisma | PostgreSQL | TypeScript

> Other packages were used in the project, you can check each packages [here](https://github.com/phbrg/shift-news/blob/master/package.json)

## Docs
### Backend

### How to run the api

To run the backend api you need:
- Node.js
- PostgreSQL
- Git or Yarn

First you need to clone the project using:

<code>git clone https://github.com/phbrg/shift-news.git</code>

After clone run:

<code>npm i</code>

to install the dependencies

Then create and <code>.env</code> archive in the project root folder and add these variables:
```JSON
DATABASE_URL="YOURURL"
JWT_KEY="YOURJWTKEY"
EMAIL="OPTIONAL (email service)"
PASSWORD="OPTIONAL (email service)"
```
> You need to create an database on pgAdmin with the right name

Then you can run using

<code>npm run dev</code>

After all the app should run, if not you can contact me.

### API Functions

### Auth

#### Register user
- Route: <code>/auth/register</code>
- Method: <code>POST</code>
- Body:
```JSON
{
  "name": "admin",
  "email": "admin@admin.com",
  "password": "Admin1234!",
  "confirmPassword": "Admin1234!"
}
```
- Response:
	- Status: <code>200</code>
	```JSON
    {
      "id": "c6176236-b048-4a02-93e1-7cf9c7bb0f90",
      "name": "admin",
      "email": "admin@admin.com"
    }
	```

#### Login
- Route: <code>/auth/login</code>
- Method: <code>POST</code>
- Body:
```JSON
{
  "email": "admin@admin.com",
  "password": "Admin1234!",
}
```
- Response:
	- Status: <code>200</code>
	```JSON
    {
      "token": "XXXXXX",
      "user": {
          "id": "uuid",
          "email": "admin@admin.com",
          "role": 1
      }
    }
	```

#### Forgetpassword (email service not working)
<code>under development</code>

### Users

#### Get user
*methods*
- id
- email
- name

- Route: <code>/user/method/data</code>
- Method: <code>GET</code>
- Response:
	- Status: <code>200</code>
	```JSON
    {
      "id": "uuid",
      "name": "admin",
      "email": "admin@admin.com",
      "role": 1,
      "totalPosts": 0,
      "totalUps": 0,
      "totalComments": 0,
      "picture": null,
      "createdAt": "9999-99-99T99:99:99.999Z",
      "updatedAt": "9999-99-99T99:99:99.999Z"
    }
  ```

#### Delete user
- Route: <code>/user/</code>
- Method: <code>DELETE</code>
- Response:
	- Status: <code>200</code>
	```JSON
    {
      "id": "uuid",
      "name": "admin",
      "email": "admin@admin.com",
      "role": 1,
      "totalPosts": 0,
      "totalUps": 0,
      "totalComments": 0,
      "picture": null,
      "createdAt": "9999-99-99T99:99:99.999Z",
      "updatedAt": "9999-99-99T99:99:99.999Z"
    }
  ```

#### Edit user
- Route: <code>/user/</code>
- Method: <code>PUT</code>
- Body:
```JSON
{
  "name": "admin"
  ...
}
```
- Response:
	- Status: <code>200</code>
	```JSON
    {
      "id": "uuid",
      "name": "admin",
      "email": "admin@admin.com",
      "role": 1,
      "totalPosts": 0,
      "totalUps": 0,
      "totalComments": 0,
      "picture": null,
      "createdAt": "9999-99-99T99:99:99.999Z",
      "updatedAt": "9999-99-99T99:99:99.999Z"
    }
  ```

### Posts

#### Create post
- Route: <code>/post/</code>
- Method: <code>POST</code>
- Body:
```JSON
{
  "title": "post title",
  "body": "post body"
}
```
- Response:
	- Status: <code>200</code>
	```JSON
    {
      "id": "uuid",
      "name": "admin",
      "email": "admin@admin.com",
      "role": 1,
      "totalPosts": 0,
      "totalUps": 0,
      "totalComments": 0,
      "picture": null,
      "createdAt": "9999-99-99T99:99:99.999Z",
      "updatedAt": "9999-99-99T99:99:99.999Z"
    }
  ```

#### Get post
*methods*
- id
- title
- body
- up
- comment

- Route: <code>/post/method?/data?</code>
- Method: <code>GET</code>
- Body:
```JSON
{
  "title": "post title",
  "body": "post body"
}
```
- Response:
	- Status: <code>200</code>
	```JSON
    [
      {
          "id": "uuid",
          "title": "post title",
          "body": "post body",
          "totalUps": 999,
          "totalComments": 999,
          "createdAt": "9999-99-99T99:99:99.999Z",
          "updatedAt": "9999-99-99T99:99:99.999Z",
          "userId": "uuid"
      },
      ...
    ]
  ```

#### Update post
- Route: <code>/post/id</code>
- Method: <code>PUT</code>
- Body:
```JSON
{
  "title": "post title",
  ...
}
```
- Response:
	- Status: <code>200</code>
	```JSON
    {
        "id": "uuid",
        "title": "post title",
        "body": "post body",
        "totalUps": 999,
        "totalComments": 999,
        "createdAt": "9999-99-99T99:99:99.999Z",
        "updatedAt": "9999-99-99T99:99:99.999Z",
        "userId": "uuid"
    }
  ```

#### Delete post
- Route: <code>/post/id</code>
- Method: <code>DELETE</code>
- Response:
	- Status: <code>200</code>
	```JSON
    {
        "id": "uuid",
        "title": "post title",
        "body": "post body",
        "totalUps": 999,
        "totalComments": 999,
        "createdAt": "9999-99-99T99:99:99.999Z",
        "updatedAt": "9999-99-99T99:99:99.999Z",
        "userId": "uuid"
    }
  ```

#### Up post
- Route: <code>/post/up/id</code>
- Method: <code>POST</code>
- Response:
	- Status: <code>200</code>
	```JSON
    { 
      "message": "Up created"
    }
  ```
  or
  - Status: <code>200</code>
	```JSON
    { 
      "message": "Up deleted"
    }
  ```

### Comments

#### Create comment
- Route: <code>/comment/id</code>
- Method: <code>POST</code>
- Body:
  ```JSON
    {
      "body": "comment content"
    }
  ```
- Response:
	- Status: <code>200</code>
	```JSON
    {
        "id": "uuid",
        "body": "comment body",
        "postId": "uuid",
        "userId": "uuid",
        "createdAt": "9999-99-99T99:99:99.999Z",
        "updatedAt": "9999-99-99T99:99:99.999Z"
    }
  ```

#### Get comment
*methods*
- id
- user
- post
- body

- Route: <code>/comment/method?/data</code>
- Method: <code>GET</code>
- Response:
	- Status: <code>200</code>
	```JSON
    [
      {
        "id": "uuid",
        "body": "comment body",
        "postId": "uuid",
        "userId": "uuid",
        "createdAt": "9999-99-99T99:99:99.999Z",
        "updatedAt": "9999-99-99T99:99:99.999Z"
      },
      ...
    ]
  ```

#### Update comment
- Route: <code>/comment/id</code>
- Method: <code>PUT</code>
- Body:
  ```JSON
    {
      "body": "comment content"
    }
  ```
- Response:
	- Status: <code>200</code>
	```JSON
    {
        "id": "uuid",
        "body": "comment body",
        "postId": "uuid",
        "userId": "uuid",
        "createdAt": "9999-99-99T99:99:99.999Z",
        "updatedAt": "9999-99-99T99:99:99.999Z"
    }
  ```

#### Delete comment
- Route: <code>/comment/id</code>
- Method: <code>DELETE</code>
- Body:
  ```JSON
    {
      "body": "comment content"
    }
  ```
- Response:
	- Status: <code>200</code>
	```JSON
    {
        "id": "uuid",
        "body": "comment body",
        "postId": "uuid",
        "userId": "uuid",
        "createdAt": "9999-99-99T99:99:99.999Z",
        "updatedAt": "9999-99-99T99:99:99.999Z"
    }
  ```

### Admin

### Methods
- comment
- post
- user

#### Edit admin
- Route: <code>/admin/method/id</code>
- Method: <code>PUT</code>
- Body:
  ```JSON
    {
      "content": "content"
    }
  ```
- Response:
	- Status: <code>200</code>
	```JSON
    {
      "value": "value",
      "value": "value",
    }
  ```

#### Delete admin
- Route: <code>/admin/method/id</code>
- Method: <code>DELETE</code>
- Response:
	- Status: <code>200</code>
	```JSON
    {
      "value": "value",
      "value": "value",
    }
  ```
	
## License
This project is under [MIT License](LICENSE). See [LICENSE](LICENSE)   
for more details.
