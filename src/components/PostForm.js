import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../util/graphql'

import { useForm } from '../util/hooks'

function PostForm() {
    const { onChange, onSubmit, values } = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, { error }] = useMutation(CREATE_POST, {
        variables: values, 
        update(proxy, result){
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            const new_post = result.data.createPost;
            proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: {
                getPosts: [new_post, ...data.getPosts] }
             });
            values.body = ''
        }
    })

    console.log(error)

    function createPostCallback(){
        createPost()
    }



    return (
        <>
        <Form className="post-form" onSubmit={onSubmit}>

        <Form.Field>
            <Form.Input 
                placeholder="What's on your mind ?"
                name="body"
                onChange={onChange}
                value={values.body}
                error={error ? true: false}
                required="true"
                />
                <Button type="submit" color="blue">
                    Post
                </Button>
        </Form.Field>
        </Form>
        {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
            <ul className="list">
                <li>{error.graphQLErrors[0].message}</li>
            </ul>
        </div>
        )}
        </>
    )
}

const CREATE_POST = gql`
mutation createPost($body: String!){
    createPost(body: $body){
        id body createdAt username
        likes{
            id username createdAt
        }
        likeCount
        comments{
            id body username createdAt
        }
        commentCount
    }
}
`

export default PostForm
